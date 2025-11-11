package grupo7.ecommerceapi.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddressResponseDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String dni;
    private String address;
    private String city;
    private String postalCode;
}



