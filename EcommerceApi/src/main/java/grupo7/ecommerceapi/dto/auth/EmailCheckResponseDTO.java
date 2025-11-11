package grupo7.ecommerceapi.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmailCheckResponseDTO {
    private boolean exists;
    private AuthUserDTO user;
}


