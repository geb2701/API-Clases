package com.ecommerce.controller;

import com.ecommerce.entity.User;
import com.ecommerce.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

  private final UserService userService;

  /**
   * POST /api/auth/register
   * Registrar nuevo usuario
   */
  @PostMapping("/register")
  public ResponseEntity<Map<String, Object>> register(@Valid @RequestBody RegisterRequest request) {
    try {
      // Verificar si el email ya existe
      if (userService.existsByEmail(request.getEmail())) {
        Map<String, Object> error = new HashMap<>();
        error.put("success", false);
        error.put("message", "El email ya está registrado");
        return ResponseEntity.badRequest().body(error);
      }

      // Crear usuario
      User user = new User();
      user.setName(request.getName());
      user.setSurname(request.getSurname());
      user.setEmail(request.getEmail());
      user.setPassword(request.getPassword());

      User createdUser = userService.register(user);

      // Responder sin la contraseña
      Map<String, Object> response = new HashMap<>();
      response.put("success", true);
      response.put("user", createUserResponse(createdUser));

      return ResponseEntity.ok(response);
    } catch (Exception e) {
      Map<String, Object> error = new HashMap<>();
      error.put("success", false);
      error.put("message", "Error al registrar usuario: " + e.getMessage());
      return ResponseEntity.badRequest().body(error);
    }
  }

  /**
   * POST /api/auth/login
   * Iniciar sesión
   */
  @PostMapping("/login")
  public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody LoginRequest request) {
    try {
      return userService.login(request.getEmail(), request.getPassword())
          .map(user -> {
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("user", createUserResponse(user));
            return ResponseEntity.ok(response);
          })
          .orElseGet(() -> {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Credenciales inválidas");
            return ResponseEntity.badRequest().body(error);
          });
    } catch (Exception e) {
      Map<String, Object> error = new HashMap<>();
      error.put("success", false);
      error.put("message", "Error al iniciar sesión");
      return ResponseEntity.badRequest().body(error);
    }
  }

  /**
   * POST /api/auth/logout
   * Cerrar sesión
   */
  @PostMapping("/logout")
  public ResponseEntity<Map<String, Object>> logout() {
    Map<String, Object> response = new HashMap<>();
    response.put("success", true);
    response.put("message", "Sesión cerrada correctamente");
    return ResponseEntity.ok(response);
  }

  /**
   * GET /api/auth/check-email/{email}
   * Verificar si un email existe
   */
  @GetMapping("/check-email/{email}")
  public ResponseEntity<Map<String, Boolean>> checkEmail(@PathVariable String email) {
    Map<String, Boolean> response = new HashMap<>();
    response.put("exists", userService.existsByEmail(email));
    return ResponseEntity.ok(response);
  }

  // Helper para crear respuesta de usuario sin contraseña
  private Map<String, Object> createUserResponse(User user) {
    Map<String, Object> userMap = new HashMap<>();
    userMap.put("id", user.getId());
    userMap.put("name", user.getName());
    userMap.put("surname", user.getSurname());
    userMap.put("email", user.getEmail());
    return userMap;
  }

  // DTOs
  @lombok.Data
  public static class RegisterRequest {
    private String name;
    private String surname;
    private String email;
    private String password;
  }

  @lombok.Data
  public static class LoginRequest {
    private String email;
    private String password;
  }
}
