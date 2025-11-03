package grupo7.ecommerceapi.filter;

import grupo7.ecommerceapi.entity.User;
import grupo7.ecommerceapi.repository.UserRepository;
import grupo7.ecommerceapi.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // Extraer el token del header Authorization
        String authHeader = request.getHeader("Authorization");
        String token = null;
        String username = null;

        // Verificar si el header existe y tiene el formato correcto
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            try {
                username = jwtUtil.extractUsername(token);
            } catch (Exception e) {
                logger.warn("JWT token parsing error: " + e.getMessage());
            }
        }

        // Si tenemos un token válido y no hay autenticación en el contexto
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            Optional<User> userOpt = userRepository.findActiveByEmail(username);

            if (userOpt.isPresent() && jwtUtil.validateToken(token, username)) {
                User user = userOpt.get();

                // Obtener el rol del token
                String role = jwtUtil.extractRole(token);
                
                // Crear la autenticación con el rol
                UsernamePasswordAuthenticationToken authentication = 
                    new UsernamePasswordAuthenticationToken(
                        user, 
                        null, 
                        Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role))
                    );
                
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                
                // Establecer la autenticación en el contexto de seguridad
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        filterChain.doFilter(request, response);
    }
}

