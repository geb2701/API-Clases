package grupo7.ecommerceapi.service;

import grupo7.ecommerceapi.dto.*;
import grupo7.ecommerceapi.entity.*;
import grupo7.ecommerceapi.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
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
    private final UserRepository userRepository;

    public List<Order> getOrdersByUserId(Long userId) {
        List<Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
        // Cargar relaciones lazy para que se serialicen en JSON
        for (Order order : orders) {
            // Cargar items de la orden desde el repositorio
            List<OrderItem> orderItems = orderItemRepository.findByOrderId(order.getId());
            order.setOrderItems(orderItems);
            
            // Forzar carga de productos en cada item (sin cargar las relaciones del producto)
            for (OrderItem item : orderItems) {
                if (item.getProduct() != null) {
                    // Solo acceder a campos básicos del producto para evitar referencia circular
                    // No cargar category explícitamente para evitar recursión
                    item.getProduct().getId();
                    item.getProduct().getName();
                    item.getProduct().getImage();
                    item.getProduct().getPrice();
                    item.getProduct().getDiscount();
                    item.getProduct().getDescription();
                    item.getProduct().getStock();
                }
            }
            
            // Cargar direcciones desde sus repositorios (solo los campos básicos)
            List<BillingAddress> billingAddresses = billingAddressRepository.findAllByOrderId(order.getId());
            for (BillingAddress addr : billingAddresses) {
                // Solo acceder a campos básicos, no a user ni order
                addr.getId();
                addr.getFirstName();
                addr.getLastName();
                addr.getDni();
                addr.getAddress();
                addr.getCity();
                addr.getPostalCode();
            }
            order.setBillingAddresses(billingAddresses);
            
            List<ShippingAddress> shippingAddresses = shippingAddressRepository.findAllByOrderId(order.getId());
            for (ShippingAddress addr : shippingAddresses) {
                // Solo acceder a campos básicos, no a user ni order
                addr.getId();
                addr.getFirstName();
                addr.getLastName();
                addr.getAddress();
                addr.getCity();
                addr.getPostalCode();
            }
            order.setShippingAddresses(shippingAddresses);
        }
        return orders;
    }

    /**
     * Obtener órdenes del usuario como DTOs (sin referencias circulares)
     */
    public List<OrderResponseDTO> getOrdersByUserIdAsDTO(Long userId) {
        List<Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return orders.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Convertir Order a OrderResponseDTO
     */
    private OrderResponseDTO convertToDTO(Order order) {
        OrderResponseDTO dto = new OrderResponseDTO();
        dto.setId(order.getId());
        dto.setOrderNumber(order.getOrderNumber());
        dto.setStatus(order.getStatus().getValue());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setUpdatedAt(order.getUpdatedAt());

        // Convertir OrderItems a DTOs
        List<OrderItem> orderItems = orderItemRepository.findByOrderId(order.getId());
        List<OrderItemResponseDTO> itemDTOs = orderItems.stream()
                .map(item -> {
                    OrderItemResponseDTO itemDTO = new OrderItemResponseDTO();
                    itemDTO.setId(item.getId());
                    itemDTO.setQuantity(item.getQuantity());
                    itemDTO.setUnitPrice(item.getUnitPrice());
                    itemDTO.setTotalPrice(item.getTotalPrice());
                    
                    // Solo campos básicos del producto
                    Product product = item.getProduct();
                    ProductSummaryDTO productDTO = new ProductSummaryDTO();
                    productDTO.setId(product.getId());
                    productDTO.setName(product.getName());
                    productDTO.setImage(product.getImage());
                    productDTO.setPrice(product.getPrice());
                    productDTO.setDiscount(product.getDiscount());
                    itemDTO.setProduct(productDTO);
                    
                    return itemDTO;
                })
                .collect(Collectors.toList());
        dto.setOrderItems(itemDTOs);

        // Convertir direcciones a DTOs
        List<BillingAddress> billingAddresses = billingAddressRepository.findAllByOrderId(order.getId());
        List<AddressResponseDTO> billingDTOs = billingAddresses.stream()
                .map(addr -> {
                    AddressResponseDTO addrDTO = new AddressResponseDTO();
                    addrDTO.setId(addr.getId());
                    addrDTO.setFirstName(addr.getFirstName());
                    addrDTO.setLastName(addr.getLastName());
                    addrDTO.setDni(addr.getDni());
                    addrDTO.setAddress(addr.getAddress());
                    addrDTO.setCity(addr.getCity());
                    addrDTO.setPostalCode(addr.getPostalCode());
                    return addrDTO;
                })
                .collect(Collectors.toList());
        dto.setBillingAddresses(billingDTOs);

        List<ShippingAddress> shippingAddresses = shippingAddressRepository.findAllByOrderId(order.getId());
        List<AddressResponseDTO> shippingDTOs = shippingAddresses.stream()
                .map(addr -> {
                    AddressResponseDTO addrDTO = new AddressResponseDTO();
                    addrDTO.setId(addr.getId());
                    addrDTO.setFirstName(addr.getFirstName());
                    addrDTO.setLastName(addr.getLastName());
                    addrDTO.setDni(null); // Shipping address no tiene DNI
                    addrDTO.setAddress(addr.getAddress());
                    addrDTO.setCity(addr.getCity());
                    addrDTO.setPostalCode(addr.getPostalCode());
                    return addrDTO;
                })
                .collect(Collectors.toList());
        dto.setShippingAddresses(shippingDTOs);

        return dto;
    }

    public Optional<Order> getOrderById(Long orderId) {
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();
            // Forzar carga de relaciones lazy
            if (order.getOrderItems() != null) {
                order.getOrderItems().size();
                order.getOrderItems().forEach(item -> {
                    if (item.getProduct() != null) {
                        item.getProduct().getName();
                    }
                });
            }
            if (order.getBillingAddresses() != null) {
                order.getBillingAddresses().size();
            }
            if (order.getShippingAddresses() != null) {
                order.getShippingAddresses().size();
            }
        }
        return orderOpt;
    }

    public Optional<Order> getOrderByOrderNumber(String orderNumber) {
        return orderRepository.findByOrderNumber(orderNumber);
    }

    public List<OrderItem> getOrderItems(Long orderId) {
        return orderItemRepository.findByOrderId(orderId);
    }


    // TODO: Re-enable when Cart feature is implemented
    /*
     * public Order createOrderFromCart(String sessionId, Long userId,
     * BillingAddress billingAddress,
     * ShippingAddress shippingAddress,
     * PaymentInfo paymentInfo) {
     * 
     * // Validar stock del carrito
     * if (!cartService.validateCartStock(sessionId)) {
     * throw new RuntimeException("Algunos productos no tienen stock suficiente");
     * }
     * 
     * // Crear el pedido
     * Order order = new Order();
     * order.setUser(new User());
     * order.getUser().setId(userId);
     * order.setOrderNumber(generateOrderNumber());
     * order.setStatus(Order.OrderStatus.PENDING);
     * order.setTotalAmount(cartService.getCartTotal(sessionId));
     * 
     * Order savedOrder = orderRepository.save(order);
     * 
     * // Crear items del pedido
     * List<CartItem> cartItems = cartService.getCartItems(sessionId);
     * for (CartItem cartItem : cartItems) {
     * OrderItem orderItem = new OrderItem();
     * orderItem.setOrder(savedOrder);
     * orderItem.setProduct(cartItem.getProduct());
     * orderItem.setQuantity(cartItem.getQuantity());
     * orderItem.setUnitPrice(cartItem.getProduct().getActualPrice());
     * orderItem.setTotalPrice(cartItem.getProduct().getActualPrice()
     * .multiply(BigDecimal.valueOf(cartItem.getQuantity())));
     * 
     * orderItemRepository.save(orderItem);
     * 
     * // Actualizar stock del producto
     * productService.updateStock(cartItem.getProduct().getId(),
     * cartItem.getQuantity());
     * }
     * 
     * // Crear direcciones
     * if (billingAddress != null) {
     * billingAddress.setOrder(savedOrder);
     * // Guardar billing address
     * }
     * 
     * if (shippingAddress != null) {
     * shippingAddress.setOrder(savedOrder);
     * // Guardar shipping address
     * }
     * 
     * // Crear información de pago
     * if (paymentInfo != null) {
     * paymentInfo.setOrder(savedOrder);
     * // Guardar payment info
     * }
     * 
     * // Limpiar carrito
     * cartService.clearCart(sessionId);
     * 
     * return savedOrder;
     * }
     */

    public Order updateOrderStatus(Long orderId, Order.OrderStatus status) {
        return orderRepository.findById(orderId)
                .map(order -> {
                    order.setStatus(status);
                    return orderRepository.save(order);
                })
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));
    }

    public List<Order> getOrdersByStatus(Order.OrderStatus status) {
        return orderRepository.findByStatus(status);
    }

    /**
     * Crea una orden desde los datos del checkout
     */
    public Order createOrder(User user, BillingAddress billingAddress, ShippingAddress shippingAddress,
            PaymentInfo paymentInfo, List<OrderItemRequest> items) {
        // Validar stock de productos
        for (OrderItemRequest itemRequest : items) {
            Optional<Product> productOpt = productService.getProductById(itemRequest.getProductId());
            if (productOpt.isEmpty()) {
                throw new RuntimeException("Producto con ID " + itemRequest.getProductId() + " no encontrado");
            }
            Product product = productOpt.get();
            if (product.getStock() < itemRequest.getQuantity()) {
                throw new RuntimeException("Stock insuficiente para el producto: " + product.getName());
            }
        }

        // Crear la orden
        Order order = new Order();
        order.setUser(user);
        order.setOrderNumber(generateOrderNumber());
        order.setStatus(Order.OrderStatus.PENDING);

        // Calcular total
        BigDecimal totalAmount = BigDecimal.ZERO;
        for (OrderItemRequest itemRequest : items) {
            Product product = productService.getProductById(itemRequest.getProductId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

            // Usar getActualPrice() que ya maneja correctamente el descuento
            BigDecimal actualPrice = product.getActualPrice();

            totalAmount = totalAmount.add(actualPrice.multiply(BigDecimal.valueOf(itemRequest.getQuantity())));
        }
        order.setTotalAmount(totalAmount);

        // Guardar orden
        Order savedOrder = orderRepository.save(order);

        // Crear items de la orden y actualizar stock
        for (OrderItemRequest itemRequest : items) {
            Product product = productService.getProductById(itemRequest.getProductId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

            // Usar getActualPrice() que ya maneja correctamente el descuento
            BigDecimal actualPrice = product.getActualPrice();

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(savedOrder);
            orderItem.setProduct(product);
            orderItem.setQuantity(itemRequest.getQuantity());
            orderItem.setUnitPrice(actualPrice);
            orderItem.setTotalPrice(actualPrice.multiply(BigDecimal.valueOf(itemRequest.getQuantity())));

            orderItemRepository.save(orderItem);

            // Actualizar stock
            product.setStock(product.getStock() - itemRequest.getQuantity());
            productService.updateProduct(product.getId(), product);
        }

        // Crear direcciones y pago
        if (billingAddress != null) {
            billingAddress.setUser(user);
            billingAddress.setOrder(savedOrder);
            billingAddressRepository.save(billingAddress);
        }

        if (shippingAddress != null) {
            shippingAddress.setUser(user);
            shippingAddress.setOrder(savedOrder);
            shippingAddressRepository.save(shippingAddress);
        }

        if (paymentInfo != null) {
            paymentInfo.setOrder(savedOrder);
            paymentInfoRepository.save(paymentInfo);
        }

        return savedOrder;
    }

    private String generateOrderNumber() {
        return "ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase() + "-" + System.currentTimeMillis();
    }

    // DTO para items de orden
    public static class OrderItemRequest {
        private Long productId;
        private Integer quantity;

        public OrderItemRequest() {}

        public OrderItemRequest(Long productId, Integer quantity) {
            this.productId = productId;
            this.quantity = quantity;
        }

        public Long getProductId() {
            return productId;
        }

        public void setProductId(Long productId) {
            this.productId = productId;
        }

        public Integer getQuantity() {
            return quantity;
        }

        public void setQuantity(Integer quantity) {
            this.quantity = quantity;
        }
    }
}
