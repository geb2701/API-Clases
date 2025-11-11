package grupo7.ecommerceapi.controller;

import grupo7.ecommerceapi.dto.MessageResponseDTO;
import grupo7.ecommerceapi.dto.auth.AuthResponseDTO;
import grupo7.ecommerceapi.dto.auth.EmailCheckResponseDTO;
import grupo7.ecommerceapi.dto.auth.LoginRequestDTO;
import grupo7.ecommerceapi.dto.auth.RegisterRequestDTO;
import grupo7.ecommerceapi.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

  private final AuthService authService;

  /**
   * POST /api/auth/register - Registrar nuevo usuario
   */
  @PostMapping("/register")
  public ResponseEntity<AuthResponseDTO> register(@Valid @RequestBody RegisterRequestDTO request) {
    AuthResponseDTO response = authService.register(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(response);
  }

  /**
   * POST /api/auth/login - Iniciar sesión
   */
  @PostMapping("/login")
  public ResponseEntity<AuthResponseDTO> login(@Valid @RequestBody LoginRequestDTO request) {
    AuthResponseDTO response = authService.login(request);
    return ResponseEntity.ok(response);
  }

  /**
   * POST /api/auth/logout - Cerrar sesión
   */
  @PostMapping("/logout")
  public ResponseEntity<MessageResponseDTO> logout() {
    return ResponseEntity.ok(authService.logout());
  }

  /**
   * GET /api/auth/check-email/{email} - Verificar si un email existe
   */
  @GetMapping("/check-email/{email}")
  public ResponseEntity<EmailCheckResponseDTO> checkEmail(@PathVariable String email) {
    EmailCheckResponseDTO response = authService.checkEmail(email);
    return ResponseEntity.ok(response);
  }
}
