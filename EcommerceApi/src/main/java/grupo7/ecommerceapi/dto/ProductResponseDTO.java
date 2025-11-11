package grupo7.ecommerceapi.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductResponseDTO {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private BigDecimal discount;
    private BigDecimal actualPrice;
    private String image;
    private Integer stock;
    private Boolean hasActiveDiscount;
    private Boolean isActive;
    private CategorySummaryDTO category;
    private BigDecimal discountPercentage;
    private String formattedPrice;
    private String formattedActualPrice;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}