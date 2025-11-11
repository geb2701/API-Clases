package grupo7.ecommerceapi.mapper;

import grupo7.ecommerceapi.dto.CategorySummaryDTO;
import grupo7.ecommerceapi.dto.ProductResponseDTO;
import grupo7.ecommerceapi.dto.ProductStockResponseDTO;
import grupo7.ecommerceapi.dto.ProductSummaryDTO;
import grupo7.ecommerceapi.entity.Category;
import grupo7.ecommerceapi.entity.Product;
import org.springframework.stereotype.Component;

@Component
public class ProductMapper {

    public ProductResponseDTO toResponse(Product product) {
        if (product == null) {
            return null;
        }
        return ProductResponseDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .discount(product.getDiscount())
                .actualPrice(product.getActualPrice())
                .image(product.getImage())
                .stock(product.getStock())
                .hasActiveDiscount(product.hasDiscount())
                .isActive(product.getIsActive())
                .category(mapCategory(product.getCategory()))
                .discountPercentage(product.getDiscountPercentage())
                .formattedPrice(product.getFormattedPrice())
                .formattedActualPrice(product.getFormattedActualPrice())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }

    public ProductSummaryDTO toSummary(Product product) {
        if (product == null) {
            return null;
        }
        return ProductSummaryDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .discount(product.getDiscount())
                .actualPrice(product.getActualPrice())
                .image(product.getImage())
                .stock(product.getStock())
                .hasActiveDiscount(product.hasDiscount())
                .isActive(product.getIsActive())
                .category(mapCategory(product.getCategory()))
                .discountPercentage(product.getDiscountPercentage())
                .formattedPrice(product.getFormattedPrice())
                .formattedActualPrice(product.getFormattedActualPrice())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }

    public ProductStockResponseDTO toStock(Product product) {
        if (product == null) {
            return null;
        }
        return new ProductStockResponseDTO(product.getId(), product.getStock());
    }

    private CategorySummaryDTO mapCategory(Category category) {
        if (category == null) {
            return null;
        }
        return CategorySummaryDTO.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .isActive(category.getIsActive())
                .createdAt(category.getCreatedAt())
                .updatedAt(category.getUpdatedAt())
                .build();
    }
}