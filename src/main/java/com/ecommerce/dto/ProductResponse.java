package com.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {
  private Long id;
  private String name;
  private String description;
  private BigDecimal price;
  private String category; // Como string
  private String image;
  private Integer stock;
  private BigDecimal discount;

  // Campos calculados útiles para el frontend
  public BigDecimal getActualPrice() {
    return (discount != null && discount.compareTo(price) < 0) ? discount : price;
  }

  public boolean hasDiscount() {
    return discount != null && discount.compareTo(price) < 0;
  }
}
