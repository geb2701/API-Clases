package com.ecommerce.controller;

import com.ecommerce.dto.LoginRequest;
import com.ecommerce.dto.RegisterRequest;
import com.ecommerce.dto.UserResponse;
import com.ecommerce.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth") // /api/auth (por el context-path)
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5173" })
public class AuthController {

  private final AuthService authService;

  /**
   * POST /api/auth/register - Registrar nuevo usuario
   * Frontend: signup() en auth-context.tsx
   * Body: { "name": "Juan", "surname": "Pérez", "email": "juan@test.com",
   * "password": "123456" }
   */
  @PostMapping("/register")
  public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
    try {
      UserResponse user = authService.register(request);
      return ResponseEntity.status(HttpStatus.CREATED).body(user);
    } catch (RuntimeException e) {
      return ResponseEntity
          .status(HttpStatus.BAD_REQUEST)
          .body(new ErrorResponse(e.getMessage()));
    }
  }

  /**
   * POST /api/auth/login - Login de usuario
   * Frontend: login() en auth-context.tsx
   * Body: { "email": "test@test.com", "password": "123456" }
   */
  @PostMapping("/login")
  public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
    try {
      UserResponse user = authService.login(request);
      return ResponseEntity.ok(user);
    } catch (RuntimeException e) {
      return ResponseEntity
          .status(HttpStatus.UNAUTHORIZED)
          .body(new ErrorResponse(e.getMessage()));
    }
  }

  /**
   * POST /api/auth/logout - Cerrar sesión
   * Por ahora es un endpoint dummy, en producción limpiaría el token/sesión
   */
  @PostMapping("/logout")
  public ResponseEntity<String> logout() {
    return ResponseEntity.ok("Logout successful");
  }

  // Clase interna para respuestas de error
  record ErrorResponse(String message) {
  }
}
