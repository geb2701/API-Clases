package com.ecommerce.controller;

import com.ecommerce.entity.Order;
import com.ecommerce.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {

  private final OrderService orderService;

  /**
   * POST /api/orders
   * Crear una nueva orden
   */
  @PostMapping
  public ResponseEntity<Order> createOrder(@Valid @RequestBody CreateOrderRequest request) {
    try {
      // Crear orden desde el request
      Order order = new Order();

      // Información de facturación
      order.setBillingFirstName(request.getBilling().getFirstName());
      order.setBillingLastName(request.getBilling().getLastName());
      order.setBillingDni(request.getBilling().getDni());
      order.setBillingAddress(request.getBilling().getAddress());
      order.setBillingCity(request.getBilling().getCity());
      order.setBillingPostalCode(request.getBilling().getPostalCode());

      // Información de envío (si es diferente)
      if (request.getShipping() != null) {
        order.setShippingFirstName(request.getShipping().getFirstName());
        order.setShippingLastName(request.getShipping().getLastName());
        order.setShippingAddress(request.getShipping().getAddress());
        order.setShippingCity(request.getShipping().getCity());
        order.setShippingPostalCode(request.getShipping().getPostalCode());
      } else {
        // Usar dirección de facturación como envío
        order.setShippingFirstName(request.getBilling().getFirstName());
        order.setShippingLastName(request.getBilling().getLastName());
        order.setShippingAddress(request.getBilling().getAddress());
        order.setShippingCity(request.getBilling().getCity());
        order.setShippingPostalCode(request.getBilling().getPostalCode());
      }

      // Información de pago (solo últimos 4 dígitos)
      String cardNumber = request.getPayment().getCardNumber().replaceAll("\\s", "");
      if (cardNumber.length() >= 4) {
        order.setCardLastFour(cardNumber.substring(cardNumber.length() - 4));
      }
      order.setCardholderName(request.getPayment().getCardholderName());

      // Crear orden con items
      Order createdOrder = orderService.createOrder(order, request.getItems());

      return ResponseEntity.ok(createdOrder);
    } catch (Exception e) {
      return ResponseEntity.badRequest().build();
    }
  }

  /**
   * GET /api/orders
   * Obtener todas las órdenes
   */
  @GetMapping
  public ResponseEntity<List<Order>> getAllOrders() {
    List<Order> orders = orderService.getAllOrders();
    return ResponseEntity.ok(orders);
  }

  /**
   * GET /api/orders/{id}
   * Obtener orden por ID
   */
  @GetMapping("/{id}")
  public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
    return orderService.getOrderById(id)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
  }

  /**
   * GET /api/orders/by-dni/{dni}
   * Obtener órdenes por DNI
   */
  @GetMapping("/by-dni/{dni}")
  public ResponseEntity<List<Order>> getOrdersByDni(@PathVariable String dni) {
    List<Order> orders = orderService.getOrdersByDni(dni);
    return ResponseEntity.ok(orders);
  }

  /**
   * PATCH /api/orders/{id}/status
   * Actualizar estado de una orden
   */
  @PatchMapping("/{id}/status")
  public ResponseEntity<Order> updateOrderStatus(
      @PathVariable Long id,
      @RequestBody Map<String, String> request) {
    try {
      Order.OrderStatus newStatus = Order.OrderStatus.valueOf(request.get("status"));
      return orderService.updateOrderStatus(id, newStatus)
          .map(ResponseEntity::ok)
          .orElse(ResponseEntity.notFound().build());
    } catch (IllegalArgumentException e) {
      return ResponseEntity.badRequest().build();
    }
  }

  // DTOs para request
  @lombok.Data
  public static class CreateOrderRequest {
    private AddressInfo billing;
    private AddressInfo shipping; // Opcional
    private PaymentInfo payment;
    private List<OrderService.OrderItemRequest> items;
  }

  @lombok.Data
  public static class AddressInfo {
    private String firstName;
    private String lastName;
    private String dni;
    private String address;
    private String city;
    private String postalCode;
  }

  @lombok.Data
  public static class PaymentInfo {
    private String cardNumber;
    private String expiryDate;
    private String cvv;
    private String cardholderName;
  }
}
