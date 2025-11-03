package grupo7.ecommerceapi.controller;

import grupo7.ecommerceapi.entity.User;
import grupo7.ecommerceapi.service.UserService;
import grupo7.ecommerceapi.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

  private final UserService userService;
  private final JwtUtil jwtUtil;

  /**
   * POST /api/auth/register - Registrar nuevo usuario
   */
  @PostMapping("/register")
  public ResponseEntity<Map<String, Object>> register(@Valid @RequestBody RegisterRequest request) {
    try {
      // Normalizar email a lowercase
      String normalizedEmail = request.getEmail() != null ? request.getEmail().trim().toLowerCase() : null;

      if (normalizedEmail == null || normalizedEmail.isEmpty()) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("success", false);
        errorResponse.put("message", "El email es requerido");
        return ResponseEntity.badRequest().body(errorResponse);
      }

      // Crear usuario
      User user = new User();
      user.setName(request.getName());
      user.setSurname(request.getSurname());
      user.setEmail(normalizedEmail);
      user.setPassword(request.getPassword());

      User createdUser = userService.createUser(user);

      // Generar token JWT
      String token = jwtUtil.generateToken(createdUser.getId(), createdUser.getEmail());

      // Preparar respuesta
      Map<String, Object> response = new HashMap<>();
      response.put("success", true);

      Map<String, Object> userResponse = new HashMap<>();
      userResponse.put("id", createdUser.getId());
      userResponse.put("name", createdUser.getName());
      userResponse.put("surname", createdUser.getSurname());
      userResponse.put("email", createdUser.getEmail());

      response.put("user", userResponse);
      response.put("token", token);
      response.put("message", "Usuario registrado exitosamente");

      return ResponseEntity.ok(response);

    } catch (RuntimeException e) {
      Map<String, Object> errorResponse = new HashMap<>();
      errorResponse.put("success", false);
      errorResponse.put("message", e.getMessage());
      return ResponseEntity.badRequest().body(errorResponse);
    }
  }

  /**
   * POST /api/auth/login - Iniciar sesión
   */
  @PostMapping("/login")
  public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody LoginRequest request) {
    try {
      // Normalizar email a lowercase para comparación case-insensitive
      String normalizedEmail = request.getEmail() != null ? request.getEmail().trim().toLowerCase() : null;

      if (normalizedEmail == null || normalizedEmail.isEmpty()) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("success", false);
        errorResponse.put("message", "El email es requerido");
        return ResponseEntity.badRequest().body(errorResponse);
      }

      Optional<User> userOpt = userService.login(normalizedEmail, request.getPassword());

      if (userOpt.isPresent()) {
        User user = userOpt.get();

        // Generar token JWT
        String token = jwtUtil.generateToken(user.getId(), user.getEmail());

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);

        Map<String, Object> userResponse = new HashMap<>();
        userResponse.put("id", user.getId());
        userResponse.put("name", user.getName());
        userResponse.put("surname", user.getSurname());
        userResponse.put("email", user.getEmail());

        response.put("user", userResponse);
        response.put("token", token);
        response.put("message", "Login exitoso");

        return ResponseEntity.ok(response);
      } else {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("success", false);
        errorResponse.put("message", "Credenciales inválidas");
        return ResponseEntity.badRequest().body(errorResponse);
      }

    } catch (Exception e) {
      Map<String, Object> errorResponse = new HashMap<>();
      errorResponse.put("success", false);
      errorResponse.put("message", "Error al iniciar sesión: " + e.getMessage());
      return ResponseEntity.badRequest().body(errorResponse);
    }
  }

  /**
   * POST /api/auth/logout - Cerrar sesión
   */
  @PostMapping("/logout")
  public ResponseEntity<Map<String, String>> logout() {
    // Por ahora solo devolver respuesta exitosa
    // En el futuro, aquí se invalidaría el token JWT o la sesión
    Map<String, String> response = new HashMap<>();
    response.put("message", "Logout exitoso");
    return ResponseEntity.ok(response);
  }

  /**
   * GET /api/auth/check-email/{email} - Verificar si un email existe
   */
  @GetMapping("/check-email/{email}")
  public ResponseEntity<Map<String, Object>> checkEmail(@PathVariable String email) {
    String normalizedEmail = email != null ? email.trim().toLowerCase() : null;
    boolean exists = normalizedEmail != null ? userService.existsByEmail(normalizedEmail) : false;

    Map<String, Object> response = new HashMap<>();
    response.put("exists", exists);
    if (exists) {
      // Intentar obtener el email real que existe
      Optional<User> userOpt = userService.getUserByEmail(normalizedEmail);
      if (userOpt.isPresent()) {
        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("id", userOpt.get().getId());
        userInfo.put("email", userOpt.get().getEmail());
        userInfo.put("name", userOpt.get().getName());
        response.put("user", userInfo);
      }
    }
    return ResponseEntity.ok(response);
  }

  // DTOs internos
  public static class RegisterRequest {
    private String name;
    private String surname;
    private String email;
    private String password;

    // Getters y setters
    public String getName() {
      return name;
    }

    public void setName(String name) {
      this.name = name;
    }

    public String getSurname() {
      return surname;
    }

    public void setSurname(String surname) {
      this.surname = surname;
    }

    public String getEmail() {
      return email;
    }

    public void setEmail(String email) {
      this.email = email;
    }

    public String getPassword() {
      return password;
    }

    public void setPassword(String password) {
      this.password = password;
    }
  }

  public static class LoginRequest {
    private String email;
    private String password;

    // Getters y setters
    public String getEmail() {
      return email;
    }

    public void setEmail(String email) {
      this.email = email;
    }

    public String getPassword() {
      return password;
    }

    public void setPassword(String password) {
      this.password = password;
    }
  }
}
