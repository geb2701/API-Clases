package grupo7.ecommerceapi.util;

import grupo7.ecommerceapi.entity.User;
import grupo7.ecommerceapi.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class SecurityUtil {

    private final UserRepository userRepository;

    /**
     * Obtiene el usuario autenticado desde el SecurityContext
     */
    public Optional<User> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.isAuthenticated()
                && authentication.getPrincipal() instanceof String) {
            String email = (String) authentication.getPrincipal();
            System.out.println("DEBUG: SecurityUtil.getCurrentUser - Email del principal: " + email);
            Optional<User> user = userRepository.findActiveByEmail(email);
            if (user.isEmpty()) {
                System.out.println("DEBUG: SecurityUtil.getCurrentUser - No se encontró usuario con email: " + email);
            } else {
                System.out.println("DEBUG: SecurityUtil.getCurrentUser - Usuario encontrado: " + user.get().getEmail());
            }
            return user;
        }

        System.out.println("DEBUG: SecurityUtil.getCurrentUser - No hay autenticación válida. Principal: " + 
            (authentication != null ? authentication.getPrincipal().getClass().getName() : "null"));
        return Optional.empty();
    }

    /**
     * Obtiene el email del usuario autenticado
     */
    public Optional<String> getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.isAuthenticated()
                && authentication.getPrincipal() instanceof String) {
            return Optional.of((String) authentication.getPrincipal());
        }

        return Optional.empty();
    }
}
