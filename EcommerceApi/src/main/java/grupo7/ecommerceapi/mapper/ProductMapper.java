package grupo7.ecommerceapi.mapper;

import grupo7.ecommerceapi.dto.ProductResponseDTO;
import grupo7.ecommerceapi.dto.ProductStockResponseDTO;
import grupo7.ecommerceapi.dto.ProductSummaryDTO;
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
                .hasDiscount(product.hasDiscount())
                .active(product.getIsActive())
                .categoryId(product.getCategory() != null ? product.getCategory().getId() : null)
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }

    public ProductSummaryDTO toSummary(Product product) {
        if (product == null) {
            return null;
        }
        return new ProductSummaryDTO(
                product.getId(),
                product.getName(),
                product.getImage(),
                product.getPrice(),
                product.getDiscount()
        );
    }

    public ProductStockResponseDTO toStock(Product product) {
        if (product == null) {
            return null;
        }
        return new ProductStockResponseDTO(product.getId(), product.getStock());
    }
}


