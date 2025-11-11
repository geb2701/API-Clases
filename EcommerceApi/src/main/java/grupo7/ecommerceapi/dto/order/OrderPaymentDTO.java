package grupo7.ecommerceapi.dto.order;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class OrderPaymentDTO {

    @NotBlank(message = "El número de tarjeta es requerido")
    private String cardNumber;

    @NotBlank(message = "La fecha de expiración es requerida")
    @Pattern(regexp = "(0[1-9]|1[0-2])\\/(\\d{2})", message = "El formato de expiración debe ser MM/YY")
    private String expiryDate;

    @NotBlank(message = "El CVV es requerido")
    private String cvv;

    @NotBlank(message = "El nombre del titular es requerido")
    private String cardholderName;
}


