package com.ecommerce.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO para crear una orden desde el carrito LOCAL del frontend
 * El frontend mantiene el carrito en localStorage, por lo que envía
 * directamente los items
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrderRequest {

  @NotNull(message = "El usuario es requerido")
  private Long userId;

  @NotEmpty(message = "La orden debe tener al menos un item")
  private List<OrderItemRequest> items;

  @NotNull(message = "La dirección de facturación es requerida")
  private BillingAddressRequest billingAddress;

  @NotNull(message = "La dirección de envío es requerida")
  private ShippingAddressRequest shippingAddress;

  @NotNull(message = "La información de pago es requerida")
  private PaymentInfoRequest paymentInfo;

  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  public static class OrderItemRequest {
    @NotNull(message = "El ID del producto es requerido")
    private Long productId;

    @NotNull(message = "La cantidad es requerida")
    private Integer quantity;
  }

  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  public static class BillingAddressRequest {
    private String firstName;
    private String lastName;
    private String dni;
    private String address;
    private String city;
    private String postalCode;
  }

  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  public static class ShippingAddressRequest {
    private String firstName;
    private String lastName;
    private String address;
    private String city;
    private String postalCode;
  }

  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  public static class PaymentInfoRequest {
    private String cardNumber;
    private String cardholderName;
    private String expiryDate;
    private String cvv;
  }
}
