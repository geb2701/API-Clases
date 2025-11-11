package grupo7.ecommerceapi.controller;

import grupo7.ecommerceapi.dto.OrderItemResponseDTO;
import grupo7.ecommerceapi.dto.OrderResponseDTO;
import grupo7.ecommerceapi.dto.order.CreateOrderRequest;
import grupo7.ecommerceapi.dto.order.UpdateOrderStatusRequest;
import grupo7.ecommerceapi.entity.Order;
import grupo7.ecommerceapi.entity.User;
import grupo7.ecommerceapi.service.OrderService;
import grupo7.ecommerceapi.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final SecurityUtil securityUtil;

    // POST /api/orders - Crear una nueva orden
    @PostMapping
    public ResponseEntity<OrderResponseDTO> createOrder(@Valid @RequestBody CreateOrderRequest request) {
        var userOpt = securityUtil.getCurrentUser();
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        OrderResponseDTO orderResponse = orderService.createOrder(userOpt.get(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(orderResponse);
    }

    // GET /api/orders/user/{userId} - Obtener pedidos de un usuario (para admin)
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<OrderResponseDTO>> getOrdersByUserId(@PathVariable Long userId) {
        List<OrderResponseDTO> orders = orderService.getOrdersByUserId(userId);
        return ResponseEntity.ok(orders);
    }

    // GET /api/orders/number/{orderNumber} - Obtener pedido por número
    @GetMapping("/number/{orderNumber}")
    public ResponseEntity<OrderResponseDTO> getOrderByOrderNumber(@PathVariable String orderNumber) {
        OrderResponseDTO order = orderService.getOrderByOrderNumber(orderNumber);
        return ResponseEntity.ok(order);
    }

    // GET /api/orders/status/{status} - Obtener pedidos por estado
    @GetMapping("/status/{status}")
    public ResponseEntity<List<OrderResponseDTO>> getOrdersByStatus(@PathVariable Order.OrderStatus status) {
        List<OrderResponseDTO> orders = orderService.getOrdersByStatus(status);
        return ResponseEntity.ok(orders);
    }

    // GET /api/orders/{orderId}/items - Obtener items de un pedido
    @GetMapping("/{orderId:\\d+}/items")
    public ResponseEntity<List<OrderItemResponseDTO>> getOrderItems(@PathVariable Long orderId) {
        List<OrderItemResponseDTO> orderItems = orderService.getOrderItems(orderId);
        return ResponseEntity.ok(orderItems);
    }

    // PUT /api/orders/{orderId}/status - Actualizar estado del pedido
    @PutMapping("/{orderId:\\d+}/status")
    public ResponseEntity<OrderResponseDTO> updateOrderStatus(
            @PathVariable Long orderId,
            @Valid @RequestBody UpdateOrderStatusRequest request) {

        OrderResponseDTO order = orderService.updateOrderStatus(orderId, request.getStatus());
        return ResponseEntity.ok(order);
    }

    // GET /api/orders/{orderId} - Obtener pedido por ID (debe ir al final para
    // evitar conflictos)
    @GetMapping("/{orderId:\\d+}")
    public ResponseEntity<OrderResponseDTO> getOrderById(@PathVariable Long orderId) {
        OrderResponseDTO order = orderService.getOrderById(orderId);
        return ResponseEntity.ok(order);
    }

    // TODO: Re-enable when Cart feature is implemented
    /*
     * // POST /api/orders/create-from-cart - Crear pedido desde carrito
     * 
     * @PostMapping("/create-from-cart")
     * public ResponseEntity<Order> createOrderFromCart(@RequestBody
     * CreateOrderRequest request) {
     * try {
     * Order order = orderService.createOrderFromCart(
     * request.getSessionId(),
     * request.getUserId(),
     * request.getBillingAddress(),
     * request.getShippingAddress(),
     * request.getPaymentInfo());
     * return ResponseEntity.ok(order);
     * } catch (RuntimeException e) {
     * return ResponseEntity.badRequest().build();
     * }
     * }
     */
}
