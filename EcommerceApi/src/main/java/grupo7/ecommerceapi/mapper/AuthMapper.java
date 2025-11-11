package grupo7.ecommerceapi.mapper;

import grupo7.ecommerceapi.dto.auth.AuthUserDTO;
import grupo7.ecommerceapi.entity.User;
import org.springframework.stereotype.Component;

@Component
public class AuthMapper {

    public AuthUserDTO toAuthUser(User user) {
        if (user == null) {
            return null;
        }
        return AuthUserDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .surname(user.getSurname())
                .email(user.getEmail())
                .build();
    }
}


