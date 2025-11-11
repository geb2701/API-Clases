package grupo7.ecommerceapi.service;

import grupo7.ecommerceapi.dto.OrderItemResponseDTO;
import grupo7.ecommerceapi.dto.OrderResponseDTO;
import grupo7.ecommerceapi.dto.order.CreateOrderRequest;
import grupo7.ecommerceapi.dto.order.OrderAddressDTO;
import grupo7.ecommerceapi.dto.order.OrderItemRequestDTO;
import grupo7.ecommerceapi.dto.order.OrderPaymentDTO;
import grupo7.ecommerceapi.entity.BillingAddress;
import grupo7.ecommerceapi.entity.Order;
import grupo7.ecommerceapi.entity.OrderItem;
import grupo7.ecommerceapi.entity.PaymentInfo;
import grupo7.ecommerceapi.entity.Product;
import grupo7.ecommerceapi.entity.ShippingAddress;
import grupo7.ecommerceapi.entity.User;
import grupo7.ecommerceapi.exception.InsufficientStockException;
import grupo7.ecommerceapi.exception.ResourceNotFoundException;
import grupo7.ecommerceapi.mapper.OrderMapper;
import grupo7.ecommerceapi.repository.BillingAddressRepository;
import grupo7.ecommerceapi.repository.OrderItemRepository;
import grupo7.ecommerceapi.repository.OrderRepository;
import grupo7.ecommerceapi.repository.PaymentInfoRepository;
import grupo7.ecommerceapi.repository.ShippingAddressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final BillingAddressRepository billingAddressRepository;
    private final ShippingAddressRepository shippingAddressRepository;
    private final PaymentInfoRepository paymentInfoRepository;
    private final ProductService productService;
    private final OrderMapper orderMapper;

    @Transactional(readOnly = true)
    public List<OrderResponseDTO> getOrdersByUserId(Long userId) {
        List<Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
        orders.forEach(this::initializeOrderRelations);
        return orderMapper.toResponseList(orders);
    }

    @Transactional(readOnly = true)
    public OrderResponseDTO getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido no encontrado con id: " + orderId));
        initializeOrderRelations(order);
        return orderMapper.toResponse(order);
    }

    @Transactional(readOnly = true)
    public OrderResponseDTO getOrderByOrderNumber(String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido no encontrado con número: " + orderNumber));
        initializeOrderRelations(order);
        return orderMapper.toResponse(order);
    }

    @Transactional(readOnly = true)
    public List<OrderResponseDTO> getOrdersByStatus(Order.OrderStatus status) {
        List<Order> orders = orderRepository.findByStatus(status);
        orders.forEach(this::initializeOrderRelations);
        return orderMapper.toResponseList(orders);
    }

    @Transactional(readOnly = true)
    public List<OrderItemResponseDTO> getOrderItems(Long orderId) {
        if (!orderRepository.existsById(orderId)) {
            throw new ResourceNotFoundException("Pedido no encontrado con id: " + orderId);
        }
        List<OrderItem> orderItems = orderItemRepository.findByOrderId(orderId);
        orderItems.forEach(item -> {
            Product product = item.getProduct();
            if (product != null) {
                product.getId();
                product.getName();
                product.getImage();
                product.getPrice();
                product.getDiscount();
            }
        });
        return orderItems.stream()
                .map(orderMapper::toOrderItem)
                .collect(Collectors.toList());
    }

    public OrderResponseDTO updateOrderStatus(Long orderId, Order.OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido no encontrado con id: " + orderId));
        order.setStatus(status);
        Order saved = orderRepository.save(order);
        initializeOrderRelations(saved);
        return orderMapper.toResponse(saved);
    }

    public OrderResponseDTO createOrder(User user, CreateOrderRequest request) {
        validateOrderRequest(request);

        Map<Long, Product> products = loadAndValidateProducts(request.getItems());

        Order order = new Order();
        order.setUser(user);
        order.setOrderNumber(generateOrderNumber());
        order.setStatus(Order.OrderStatus.PENDING);
        order.setTotalAmount(calculateTotalAmount(request.getItems(), products));

        Order savedOrder = orderRepository.save(order);

        persistOrderItems(savedOrder, request.getItems(), products);
        persistAddresses(savedOrder, user, request.getBilling(), request.getShipping());
        persistPaymentInfo(savedOrder, request.getPayment());

        return getOrderById(savedOrder.getId());
    }

    private void validateOrderRequest(CreateOrderRequest request) {
        if (request == null || request.getItems() == null || request.getItems().isEmpty()) {
            throw new IllegalArgumentException("La orden debe contener al menos un producto");
        }
    }

    private Map<Long, Product> loadAndValidateProducts(List<OrderItemRequestDTO> items) {
        Map<Long, Product> products = new HashMap<>();
        for (OrderItemRequestDTO item : items) {
            Product product = productService.getProductById(item.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Producto no encontrado con id: " + item.getProductId()));

            if (product.getStock() < item.getQuantity()) {
                throw new InsufficientStockException(
                        "Stock insuficiente para el producto: " + product.getName());
            }
            products.put(product.getId(), product);
        }
        return products;
    }

    private BigDecimal calculateTotalAmount(List<OrderItemRequestDTO> items, Map<Long, Product> products) {
        BigDecimal totalAmount = BigDecimal.ZERO;
        for (OrderItemRequestDTO item : items) {
            Product product = products.get(item.getProductId());
            BigDecimal actualPrice = product.getActualPrice();
            totalAmount = totalAmount.add(actualPrice.multiply(BigDecimal.valueOf(item.getQuantity())));
        }
        return totalAmount;
    }

    private void persistOrderItems(Order order, List<OrderItemRequestDTO> items, Map<Long, Product> products) {
        for (OrderItemRequestDTO item : items) {
            Product product = products.get(item.getProductId());
            BigDecimal actualPrice = product.getActualPrice();

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(item.getQuantity());
            orderItem.setUnitPrice(actualPrice);
            orderItem.setTotalPrice(actualPrice.multiply(BigDecimal.valueOf(item.getQuantity())));

            orderItemRepository.save(orderItem);
            productService.adjustStock(product.getId(), -item.getQuantity());
        }
    }

    private void persistAddresses(Order order, User user, OrderAddressDTO billingDto, OrderAddressDTO shippingDto) {
        if (billingDto != null) {
            BillingAddress billingAddress = new BillingAddress();
            billingAddress.setUser(user);
            billingAddress.setOrder(order);
            billingAddress.setFirstName(billingDto.getFirstName());
            billingAddress.setLastName(billingDto.getLastName());
            billingAddress.setDni(billingDto.getDni());
            billingAddress.setAddress(billingDto.getAddress());
            billingAddress.setCity(billingDto.getCity());
            billingAddress.setPostalCode(billingDto.getPostalCode());
            billingAddressRepository.save(billingAddress);
        }

        if (shippingDto != null) {
            ShippingAddress shippingAddress = new ShippingAddress();
            shippingAddress.setUser(user);
            shippingAddress.setOrder(order);
            shippingAddress.setFirstName(shippingDto.getFirstName());
            shippingAddress.setLastName(shippingDto.getLastName());
            shippingAddress.setAddress(shippingDto.getAddress());
            shippingAddress.setCity(shippingDto.getCity());
            shippingAddress.setPostalCode(shippingDto.getPostalCode());
            shippingAddressRepository.save(shippingAddress);
        }
    }

    private void persistPaymentInfo(Order order, OrderPaymentDTO paymentDto) {
        if (paymentDto == null) {
            return;
        }
        PaymentInfo paymentInfo = new PaymentInfo();
        paymentInfo.setOrder(order);
        paymentInfo.setCardNumberEncrypted(paymentDto.getCardNumber());
        paymentInfo.setExpiryDate(paymentDto.getExpiryDate());
        paymentInfo.setCvvEncrypted(paymentDto.getCvv());
        paymentInfo.setCardholderName(paymentDto.getCardholderName());
        paymentInfoRepository.save(paymentInfo);
    }

    private void initializeOrderRelations(Order order) {
        if (order.getOrderItems() != null) {
            order.getOrderItems().forEach(item -> {
                if (item.getProduct() != null) {
                    item.getProduct().getId();
                    item.getProduct().getName();
                    item.getProduct().getImage();
                    item.getProduct().getPrice();
                    item.getProduct().getDiscount();
                }
            });
        }
        if (order.getBillingAddresses() != null) {
            order.getBillingAddresses().forEach(address -> {
                address.getId();
                address.getFirstName();
                address.getLastName();
                address.getDni();
            });
        }
        if (order.getShippingAddresses() != null) {
            order.getShippingAddresses().forEach(address -> {
                address.getId();
                address.getFirstName();
                address.getLastName();
            });
        }
    }

    private String generateOrderNumber() {
        return "ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase() + "-" + System.currentTimeMillis();
    }
}
