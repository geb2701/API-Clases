package com.ecommerce.controller;

import com.ecommerce.entity.Order;
import com.ecommerce.entity.OrderItem;
import com.ecommerce.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class OrderController {
    
    private final OrderService orderService;
    
    // GET /api/orders/user/{userId} - Obtener pedidos de un usuario
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getOrdersByUserId(@PathVariable Long userId) {
        List<Order> orders = orderService.getOrdersByUserId(userId);
        return ResponseEntity.ok(orders);
    }
    
    // GET /api/orders/{orderId} - Obtener pedido por ID
    @GetMapping("/{orderId}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long orderId) {
        Optional<Order> order = orderService.getOrderById(orderId);
        return order.map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }
    
    // GET /api/orders/number/{orderNumber} - Obtener pedido por número
    @GetMapping("/number/{orderNumber}")
    public ResponseEntity<Order> getOrderByOrderNumber(@PathVariable String orderNumber) {
        Optional<Order> order = orderService.getOrderByOrderNumber(orderNumber);
        return order.map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }
    
    // GET /api/orders/{orderId}/items - Obtener items de un pedido
    @GetMapping("/{orderId}/items")
    public ResponseEntity<List<OrderItem>> getOrderItems(@PathVariable Long orderId) {
        List<OrderItem> orderItems = orderService.getOrderItems(orderId);
        return ResponseEntity.ok(orderItems);
    }
    
    // POST /api/orders/create-from-cart - Crear pedido desde carrito
    @PostMapping("/create-from-cart")
    public ResponseEntity<Order> createOrderFromCart(@RequestBody CreateOrderRequest request) {
        try {
            Order order = orderService.createOrderFromCart(
                request.getSessionId(),
                request.getUserId(),
                request.getBillingAddress(),
                request.getShippingAddress(),
                request.getPaymentInfo()
            );
            return ResponseEntity.ok(order);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // PUT /api/orders/{orderId}/status - Actualizar estado del pedido
    @PutMapping("/{orderId}/status")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestBody UpdateStatusRequest request) {
        
        try {
            Order order = orderService.updateOrderStatus(orderId, request.getStatus());
            return ResponseEntity.ok(order);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // GET /api/orders/status/{status} - Obtener pedidos por estado
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Order>> getOrdersByStatus(@PathVariable Order.OrderStatus status) {
        List<Order> orders = orderService.getOrdersByStatus(status);
        return ResponseEntity.ok(orders);
    }
    
    // Clases internas para requests
    public static class CreateOrderRequest {
        private String sessionId;
        private Long userId;
        private com.ecommerce.entity.BillingAddress billingAddress;
        private com.ecommerce.entity.ShippingAddress shippingAddress;
        private com.ecommerce.entity.PaymentInfo paymentInfo;
        
        // Getters y setters
        public String getSessionId() { return sessionId; }
        public void setSessionId(String sessionId) { this.sessionId = sessionId; }
        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }
        public com.ecommerce.entity.BillingAddress getBillingAddress() { return billingAddress; }
        public void setBillingAddress(com.ecommerce.entity.BillingAddress billingAddress) { this.billingAddress = billingAddress; }
        public com.ecommerce.entity.ShippingAddress getShippingAddress() { return shippingAddress; }
        public void setShippingAddress(com.ecommerce.entity.ShippingAddress shippingAddress) { this.shippingAddress = shippingAddress; }
        public com.ecommerce.entity.PaymentInfo getPaymentInfo() { return paymentInfo; }
        public void setPaymentInfo(com.ecommerce.entity.PaymentInfo paymentInfo) { this.paymentInfo = paymentInfo; }
    }
    
    public static class UpdateStatusRequest {
        private Order.OrderStatus status;
        
        // Getters y setters
        public Order.OrderStatus getStatus() { return status; }
        public void setStatus(Order.OrderStatus status) { this.status = status; }
    }
}
