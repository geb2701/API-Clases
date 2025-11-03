package grupo7.ecommerceapi.controller;

import grupo7.ecommerceapi.entity.*;
import grupo7.ecommerceapi.service.OrderService;
import grupo7.ecommerceapi.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
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
    public ResponseEntity<?> createOrder(@Valid @RequestBody CreateOrderRequest request) {
        try {
            // Obtener usuario autenticado
            User user = securityUtil.getCurrentUser()
                    .orElseThrow(() -> new RuntimeException("Usuario no autenticado"));

            // Crear entidades desde el request
            BillingAddress billingAddress = new BillingAddress();
            billingAddress.setFirstName(request.getBilling().getFirstName());
            billingAddress.setLastName(request.getBilling().getLastName());
            billingAddress.setDni(request.getBilling().getDni());
            billingAddress.setAddress(request.getBilling().getAddress());
            billingAddress.setCity(request.getBilling().getCity());
            billingAddress.setPostalCode(request.getBilling().getPostalCode());

            ShippingAddress shippingAddress = null;
            if (request.getShipping() != null) {
                shippingAddress = new ShippingAddress();
                shippingAddress.setFirstName(request.getShipping().getFirstName());
                shippingAddress.setLastName(request.getShipping().getLastName());
                shippingAddress.setAddress(request.getShipping().getAddress());
                shippingAddress.setCity(request.getShipping().getCity());
                shippingAddress.setPostalCode(request.getShipping().getPostalCode());
            }

            PaymentInfo paymentInfo = new PaymentInfo();
            paymentInfo.setCardNumberEncrypted(request.getPayment().getCardNumber()); // En producción, encriptar
            paymentInfo.setExpiryDate(request.getPayment().getExpiryDate());
            paymentInfo.setCvvEncrypted(request.getPayment().getCvv()); // En producción, encriptar
            paymentInfo.setCardholderName(request.getPayment().getCardholderName());

            // Convertir items del request
            List<OrderService.OrderItemRequest> orderItems = request.getItems().stream()
                    .map(item -> {
                        OrderService.OrderItemRequest orderItem = new OrderService.OrderItemRequest();
                        orderItem.setProductId(item.getProductId());
                        orderItem.setQuantity(item.getQuantity());
                        return orderItem;
                    })
                    .toList();

            // Crear orden
            Order order = orderService.createOrder(user, billingAddress, shippingAddress, paymentInfo, orderItems);

            // Preparar respuesta
            java.util.Map<String, Object> response = new java.util.HashMap<>();
            response.put("id", order.getId());
            response.put("orderNumber", order.getOrderNumber());
            response.put("total", order.getTotalAmount());
            response.put("status", order.getStatus().getValue());
            response.put("createdAt", order.getCreatedAt());

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new java.util.HashMap<String, String>() {
                {
                    put("error", e.getMessage());
                }
            });
        }
    }

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
    public static class AddressInfo {
        private String firstName;
        private String lastName;
        private String dni;
        private String address;
        private String city;
        private String postalCode;

        public String getFirstName() {
            return firstName;
        }

        public void setFirstName(String firstName) {
            this.firstName = firstName;
        }

        public String getLastName() {
            return lastName;
        }

        public void setLastName(String lastName) {
            this.lastName = lastName;
        }

        public String getDni() {
            return dni;
        }

        public void setDni(String dni) {
            this.dni = dni;
        }

        public String getAddress() {
            return address;
        }

        public void setAddress(String address) {
            this.address = address;
        }

        public String getCity() {
            return city;
        }

        public void setCity(String city) {
            this.city = city;
        }

        public String getPostalCode() {
            return postalCode;
        }

        public void setPostalCode(String postalCode) {
            this.postalCode = postalCode;
        }
    }

    public static class PaymentInfoDto {
        private String cardNumber;
        private String expiryDate;
        private String cvv;
        private String cardholderName;

        public String getCardNumber() {
            return cardNumber;
        }

        public void setCardNumber(String cardNumber) {
            this.cardNumber = cardNumber;
        }

        public String getExpiryDate() {
            return expiryDate;
        }

        public void setExpiryDate(String expiryDate) {
            this.expiryDate = expiryDate;
        }

        public String getCvv() {
            return cvv;
        }

        public void setCvv(String cvv) {
            this.cvv = cvv;
        }

        public String getCardholderName() {
            return cardholderName;
        }

        public void setCardholderName(String cardholderName) {
            this.cardholderName = cardholderName;
        }
    }

    public static class OrderItemDto {
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

    public static class CreateOrderRequest {
        private AddressInfo billing;
        private AddressInfo shipping;
        private PaymentInfoDto payment;
        private List<OrderItemDto> items;

        public AddressInfo getBilling() {
            return billing;
        }

        public void setBilling(AddressInfo billing) {
            this.billing = billing;
        }

        public AddressInfo getShipping() {
            return shipping;
        }

        public void setShipping(AddressInfo shipping) {
            this.shipping = shipping;
        }

        public PaymentInfoDto getPayment() {
            return payment;
        }

        public void setPayment(PaymentInfoDto payment) {
            this.payment = payment;
        }

        public List<OrderItemDto> getItems() {
            return items;
        }

        public void setItems(List<OrderItemDto> items) {
            this.items = items;
        }
    }

    public static class UpdateStatusRequest {
        private Order.OrderStatus status;

        // Getters y setters
        public Order.OrderStatus getStatus() {
            return status;
        }

        public void setStatus(Order.OrderStatus status) {
            this.status = status;
        }
    }
}
