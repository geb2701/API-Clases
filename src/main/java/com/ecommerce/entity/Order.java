package com.ecommerce.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  // Información de facturación
  @NotNull(message = "El nombre de facturación es requerido")
  @Column(name = "billing_first_name", nullable = false)
  private String billingFirstName;

  @NotNull(message = "El apellido de facturación es requerido")
  @Column(name = "billing_last_name", nullable = false)
  private String billingLastName;

  @NotNull(message = "El DNI es requerido")
  @Column(name = "billing_dni", nullable = false)
  private String billingDni;

  @NotNull(message = "La dirección de facturación es requerida")
  @Column(name = "billing_address", nullable = false)
  private String billingAddress;

  @NotNull(message = "La ciudad de facturación es requerida")
  @Column(name = "billing_city", nullable = false)
  private String billingCity;

  @NotNull(message = "El código postal de facturación es requerido")
  @Column(name = "billing_postal_code", nullable = false)
  private String billingPostalCode;

  // Información de envío
  @Column(name = "shipping_first_name")
  private String shippingFirstName;

  @Column(name = "shipping_last_name")
  private String shippingLastName;

  @Column(name = "shipping_address")
  private String shippingAddress;

  @Column(name = "shipping_city")
  private String shippingCity;

  @Column(name = "shipping_postal_code")
  private String shippingPostalCode;

  // Información de pago (solo últimos 4 dígitos por seguridad)
  @Column(name = "card_last_four")
  private String cardLastFour;

  @Column(name = "cardholder_name")
  private String cardholderName;

  // Total de la orden
  @NotNull(message = "El total es requerido")
  @Column(nullable = false, precision = 10, scale = 2)
  private BigDecimal total;

  // Estado de la orden
  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private OrderStatus status = OrderStatus.PENDING;

  // Productos de la orden
  @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<OrderItem> items = new ArrayList<>();

  @Column(name = "created_at")
  private LocalDateTime createdAt;

  @Column(name = "updated_at")
  private LocalDateTime updatedAt;

  @PrePersist
  protected void onCreate() {
    createdAt = LocalDateTime.now();
    updatedAt = LocalDateTime.now();
  }

  @PreUpdate
  protected void onUpdate() {
    updatedAt = LocalDateTime.now();
  }

  // Método helper para agregar items
  public void addItem(OrderItem item) {
    items.add(item);
    item.setOrder(this);
  }

  // Enum para estados de orden
  public enum OrderStatus {
    PENDING, // Pendiente
    PROCESSING, // En proceso
    SHIPPED, // Enviado
    DELIVERED, // Entregado
    CANCELLED // Cancelado
  }
}
