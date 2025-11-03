package grupo7.ecommerceapi.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateProductRequest {
    
    @NotBlank(message = "El nombre del producto es requerido")
    @Size(max = 200, message = "El nombre no puede exceder los 200 caracteres")
    private String name;

    @NotBlank(message = "La descripción es requerida")
    private String description;

    @NotNull(message = "El precio es requerido")
    @DecimalMin(value = "0.01", message = "El precio debe ser mayor a 0")
    private BigDecimal price;

    @NotBlank(message = "La categoría es requerida")
    private String category; // Nombre de la categoría como string

    @NotBlank(message = "La imagen es requerida")
    @Size(max = 500, message = "La URL de la imagen no puede exceder los 500 caracteres")
    private String image;

    @NotNull(message = "El stock es requerido")
    @Min(value = 0, message = "El stock no puede ser negativo")
    private Integer stock = 0;

    @DecimalMin(value = "0.0", message = "El descuento no puede ser negativo")
    private BigDecimal discount;
}

