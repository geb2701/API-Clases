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
    private Boolean hasDiscount;
    private Boolean active;
    private Long categoryId;
    private String categoryName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}


