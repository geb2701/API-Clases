package grupo7.ecommerceapi.service;

import grupo7.ecommerceapi.entity.*;
import grupo7.ecommerceapi.repository.OrderRepository;
import grupo7.ecommerceapi.repository.OrderItemRepository;
import lombok.RequiredArgsConstructor;
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
    // TODO: Re-enable when Cart feature is implemented
    // private final CartService cartService;
    private final ProductService productService;

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

    private String generateOrderNumber() {
        return "ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase() + "-" + System.currentTimeMillis();
    }
}
