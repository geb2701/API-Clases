package com.ecommerce.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "order_id", nullable = false)
  private Order order;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "product_id", nullable = false)
  private Product product;

  @NotNull(message = "La cantidad es requerida")
  @Min(value = 1, message = "La cantidad debe ser al menos 1")
  @Column(nullable = false)
  private Integer quantity;

  @NotNull(message = "El precio es requerido")
  @Column(nullable = false, precision = 10, scale = 2)
  private BigDecimal price;

  @Column(precision = 10, scale = 2)
  private BigDecimal subtotal;

  @PrePersist
  @PreUpdate
  protected void calculateSubtotal() {
    if (price != null && quantity != null) {
      subtotal = price.multiply(BigDecimal.valueOf(quantity));
    }
  }
}
