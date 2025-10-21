package com.ecommerce.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Versión simplificada de Product que usa category como String
 * Esto facilita la integración con el frontend que también usa strings para
 * categorías
 */
@Entity
@Table(name = "products_simple")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductSimple {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotBlank
  @Column(nullable = false, length = 200)
  private String name;

  @NotBlank
  @Column(nullable = false, columnDefinition = "TEXT")
  private String description;

  @NotNull
  @DecimalMin(value = "0.01")
  @Column(nullable = false, precision = 10, scale = 2)
  private BigDecimal price;

  @NotBlank
  @Column(nullable = false, length = 100)
  private String category; // String en lugar de entidad

  @NotBlank
  @Column(nullable = false, length = 500)
  private String image;

  @NotNull
  @Min(0)
  @Column(nullable = false)
  private Integer stock;

  @Column(precision = 10, scale = 2)
  private BigDecimal discount;

  @Column(nullable = false)
  private Boolean isActive = true;

  @CreationTimestamp
  @Column(nullable = false, updatable = false)
  private LocalDateTime createdAt;

  @UpdateTimestamp
  private LocalDateTime updatedAt;

  // Métodos de utilidad
  public BigDecimal getActualPrice() {
    return (discount != null && discount.compareTo(price) < 0) ? discount : price;
  }

  public boolean hasDiscount() {
    return discount != null && discount.compareTo(price) < 0;
  }
}
