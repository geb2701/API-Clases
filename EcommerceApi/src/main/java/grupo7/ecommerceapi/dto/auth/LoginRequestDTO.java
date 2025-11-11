package grupo7.ecommerceapi.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequestDTO {

    @NotBlank(message = "El email es requerido")
    @Email(message = "El email debe ser válido")
    private String email;

    @NotBlank(message = "La contraseña es requerida")
    private String password;
}


