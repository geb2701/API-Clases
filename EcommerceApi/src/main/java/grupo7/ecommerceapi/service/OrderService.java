package grupo7.ecommerceapi.service;

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
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Optional<Order> getOrderById(Long orderId) {
        return orderRepository.findById(orderId);
    }

    public Optional<Order> getOrderByOrderNumber(String orderNumber) {
        return orderRepository.findByOrderNumber(orderNumber);
    }

    public List<OrderItem> getOrderItems(Long orderId) {
        return orderItemRepository.findByOrderId(orderId);
    }

    public Order createOrder(
            BillingAddress billingAddress,
            ShippingAddress shippingAddress,
            PaymentInfo paymentInfo,
            List<OrderItemRequest> items) {
        
        // Calcular total
        BigDecimal totalAmount = BigDecimal.ZERO;
        
        // Validar stock y calcular total
        for (OrderItemRequest itemRequest : items) {
            Optional<Product> productOpt = productService.getProductById(itemRequest.getProductId());
            if (productOpt.isEmpty()) {
                throw new RuntimeException("Producto con ID " + itemRequest.getProductId() + " no encontrado");
            }
            Product product = productOpt.get();
            
            if (product.getStock() < itemRequest.getQuantity()) {
                throw new RuntimeException("Stock insuficiente para el producto: " + product.getName());
            }
            
            BigDecimal actualPrice = product.getDiscount() != null && product.getDiscount().compareTo(BigDecimal.ZERO) > 0
                    ? product.getDiscount()
                    : product.getPrice();
            totalAmount = totalAmount.add(actualPrice.multiply(BigDecimal.valueOf(itemRequest.getQuantity())));
        }
        
        // Crear orden
        Order order = new Order();
        
        // Obtener usuario autenticado del SecurityContext
        User user = null;
        try {
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            if (principal instanceof User) {
                user = (User) principal;
            } else {
                // Si no hay usuario autenticado, usar usuario temporal (ID 1)
                user = new User();
                user.setId(1L);
            }
        } catch (Exception e) {
            // Si hay error obteniendo el usuario, usar temporal
            user = new User();
            user.setId(1L);
        }
        
        order.setUser(user);
        order.setOrderNumber(generateOrderNumber());
        order.setStatus(Order.OrderStatus.PENDING);
        order.setTotalAmount(totalAmount);
        
        Order savedOrder = orderRepository.save(order);
        
        // Crear items de la orden
        for (OrderItemRequest itemRequest : items) {
            Product product = productService.getProductById(itemRequest.getProductId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
            
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(savedOrder);
            orderItem.setProduct(product);
            orderItem.setQuantity(itemRequest.getQuantity());
            
            BigDecimal actualPrice = product.getDiscount() != null && product.getDiscount().compareTo(BigDecimal.ZERO) > 0
                    ? product.getDiscount()
                    : product.getPrice();
            
            orderItem.setUnitPrice(actualPrice);
            orderItem.setTotalPrice(actualPrice.multiply(BigDecimal.valueOf(itemRequest.getQuantity())));
            
            orderItemRepository.save(orderItem);
            
            // Actualizar stock usando el método updateStock
            productService.updateStock(product.getId(), itemRequest.getQuantity());
        }
        
        // Crear direcciones
        if (billingAddress != null) {
            billingAddress.setOrder(savedOrder);
            billingAddress.setUser(user);
            billingAddressRepository.save(billingAddress);
        }
        
        if (shippingAddress != null) {
            shippingAddress.setOrder(savedOrder);
            shippingAddress.setUser(user);
            shippingAddressRepository.save(shippingAddress);
        }
        
        // Crear información de pago
        if (paymentInfo != null) {
            paymentInfo.setOrder(savedOrder);
            paymentInfoRepository.save(paymentInfo);
        }
        
        return savedOrder;
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

            BigDecimal actualPrice = product.getDiscount() != null
                    && product.getDiscount().compareTo(BigDecimal.ZERO) > 0
                            ? product.getPrice().subtract(product.getDiscount())
                            : product.getPrice();

            totalAmount = totalAmount.add(actualPrice.multiply(BigDecimal.valueOf(itemRequest.getQuantity())));
        }
        order.setTotalAmount(totalAmount);

        // Guardar orden
        Order savedOrder = orderRepository.save(order);

        // Crear items de la orden y actualizar stock
        for (OrderItemRequest itemRequest : items) {
            Product product = productService.getProductById(itemRequest.getProductId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

            BigDecimal actualPrice = product.getDiscount() != null
                    && product.getDiscount().compareTo(BigDecimal.ZERO) > 0
                            ? product.getPrice().subtract(product.getDiscount())
                            : product.getPrice();

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

    // Clase interna para request de items
    public static class OrderItemRequest {
        private Long productId;
        private Integer quantity;

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
