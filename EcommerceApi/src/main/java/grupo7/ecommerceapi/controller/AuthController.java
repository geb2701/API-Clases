package grupo7.ecommerceapi.controller;

import grupo7.ecommerceapi.entity.User;
import grupo7.ecommerceapi.service.UserService;
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

  /**
   * POST /api/auth/register - Registrar nuevo usuario
   */
  @PostMapping("/register")
  public ResponseEntity<Map<String, Object>> register(@Valid @RequestBody RegisterRequest request) {
    try {
      // Crear usuario
      User user = new User();
      user.setName(request.getName());
      user.setSurname(request.getSurname());
      user.setEmail(request.getEmail());
      user.setPassword(request.getPassword());

      User createdUser = userService.createUser(user);

      // Preparar respuesta
      Map<String, Object> response = new HashMap<>();
      response.put("success", true);

      Map<String, Object> userResponse = new HashMap<>();
      userResponse.put("id", createdUser.getId());
      userResponse.put("name", createdUser.getName());
      userResponse.put("surname", createdUser.getSurname());
      userResponse.put("email", createdUser.getEmail());

      response.put("user", userResponse);
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
      Optional<User> userOpt = userService.login(request.getEmail(), request.getPassword());

      if (userOpt.isPresent()) {
        User user = userOpt.get();

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);

        Map<String, Object> userResponse = new HashMap<>();
        userResponse.put("id", user.getId());
        userResponse.put("name", user.getName());
        userResponse.put("surname", user.getSurname());
        userResponse.put("email", user.getEmail());

        response.put("user", userResponse);
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
  public ResponseEntity<Map<String, Boolean>> checkEmail(@PathVariable String email) {
    boolean exists = userService.existsByEmail(email);
    Map<String, Boolean> response = new HashMap<>();
    response.put("exists", exists);
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
