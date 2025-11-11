package grupo7.ecommerceapi.dto.order;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class OrderAddressDTO {

    @NotBlank(message = "El nombre es requerido")
    private String firstName;

    @NotBlank(message = "El apellido es requerido")
    private String lastName;

    private String dni;

    @NotBlank(message = "La dirección es requerida")
    private String address;

    @NotBlank(message = "La ciudad es requerida")
    private String city;

    @NotBlank(message = "El código postal es requerido")
    private String postalCode;
}


