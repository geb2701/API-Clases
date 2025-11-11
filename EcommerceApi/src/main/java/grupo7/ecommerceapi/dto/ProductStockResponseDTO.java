package grupo7.ecommerceapi.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductStockResponseDTO {
    private Long productId;
    private Integer stock;
}


