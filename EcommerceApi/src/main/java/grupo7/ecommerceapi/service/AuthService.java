package grupo7.ecommerceapi.service;

import grupo7.ecommerceapi.dto.MessageResponseDTO;
import grupo7.ecommerceapi.dto.auth.AuthResponseDTO;
import grupo7.ecommerceapi.dto.auth.AuthUserDTO;
import grupo7.ecommerceapi.dto.auth.EmailCheckResponseDTO;
import grupo7.ecommerceapi.dto.auth.LoginRequestDTO;
import grupo7.ecommerceapi.dto.auth.RegisterRequestDTO;
import grupo7.ecommerceapi.entity.User;
import grupo7.ecommerceapi.exception.InvalidCredentialsException;
import grupo7.ecommerceapi.mapper.AuthMapper;
import grupo7.ecommerceapi.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final AuthMapper authMapper;

    public AuthResponseDTO register(RegisterRequestDTO request) {
        User newUser = new User();
        newUser.setName(request.getName());
        newUser.setSurname(request.getSurname());
        newUser.setEmail(normalizeEmail(request.getEmail()));
        newUser.setPassword(request.getPassword());

        User createdUser = userService.createUser(newUser);
        String token = jwtUtil.generateToken(createdUser.getId(), createdUser.getEmail());
        return buildAuthResponse(createdUser, token, "Usuario registrado exitosamente");
    }

    public AuthResponseDTO login(LoginRequestDTO request) {
        String normalizedEmail = normalizeEmail(request.getEmail());

        User user = userService.login(normalizedEmail, request.getPassword())
                .orElseThrow(() -> new InvalidCredentialsException("Credenciales inválidas"));

        String token = jwtUtil.generateToken(user.getId(), user.getEmail());
        return buildAuthResponse(user, token, "Login exitoso");
    }

    @Transactional(readOnly = true)
    public EmailCheckResponseDTO checkEmail(String email) {
        String normalizedEmail = email != null ? email.trim().toLowerCase() : null;
        if (normalizedEmail == null || normalizedEmail.isEmpty()) {
            return EmailCheckResponseDTO.builder()
                    .exists(false)
                    .user(null)
                    .build();
        }

        boolean exists = userService.existsByEmail(normalizedEmail);
        AuthUserDTO userDTO = null;
        if (exists) {
            userDTO = userService.getUserByEmail(normalizedEmail)
                    .map(authMapper::toAuthUser)
                    .orElse(null);
        }

        return EmailCheckResponseDTO.builder()
                .exists(exists)
                .user(userDTO)
                .build();
    }

    public MessageResponseDTO logout() {
        return new MessageResponseDTO("Logout exitoso");
    }

    private String normalizeEmail(String email) {
        if (email == null) {
            throw new IllegalArgumentException("El email es requerido");
        }
        return email.trim().toLowerCase();
    }

    private AuthResponseDTO buildAuthResponse(User user, String token, String message) {
        return AuthResponseDTO.builder()
                .user(authMapper.toAuthUser(user))
                .token(token)
                .message(message)
                .build();
    }
}


