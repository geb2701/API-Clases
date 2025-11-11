package grupo7.ecommerceapi.controller;

import grupo7.ecommerceapi.dto.OrderResponseDTO;
import grupo7.ecommerceapi.entity.Order;
import grupo7.ecommerceapi.entity.User;
import grupo7.ecommerceapi.service.OrderService;
import grupo7.ecommerceapi.service.UserService;
import grupo7.ecommerceapi.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final OrderService orderService;
    private final SecurityUtil securityUtil;

    // GET /api/users - Listar todos los usuarios (Admin)
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    // GET /api/users/me/orders - Obtener pedidos del usuario autenticado (debe ir
    // antes de /{id})
    @GetMapping("/me/orders")
    public ResponseEntity<List<OrderResponseDTO>> getMyOrders() {
        try {
            // Obtener usuario autenticado
            Optional<User> userOpt = securityUtil.getCurrentUser();
            if (userOpt.isEmpty()) {
                System.out.println("DEBUG: No se encontró usuario autenticado en getMyOrders");
                return ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED).build();
            }

            User user = userOpt.get();
            System.out.println(
                    "DEBUG: Usuario autenticado encontrado: " + user.getEmail() + " (ID: " + user.getId() + ")");

            List<OrderResponseDTO> orders = orderService.getOrdersByUserId(user.getId());
            System.out.println("DEBUG: Se encontraron " + orders.size() + " órdenes para el usuario");

            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            System.out.println("DEBUG: Error en getMyOrders: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // GET /api/users/email/{email} - Obtener usuario por email
    @GetMapping("/email/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        Optional<User> user = userService.getUserByEmail(email);
        return user.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST /api/users/register - Registrar nuevo usuario
    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@Valid @RequestBody User user) {
        try {
            User createdUser = userService.createUser(user);
            return ResponseEntity.ok(createdUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // POST /api/users/login - Login de usuario
    @PostMapping("/login")
    public ResponseEntity<User> loginUser(@RequestBody LoginRequest loginRequest) {
        try {
            Optional<User> user = userService.login(loginRequest.getEmail(), loginRequest.getPassword());
            return user.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.badRequest().build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // POST /api/users/check-email - Verificar si email existe
    @PostMapping("/check-email")
    public ResponseEntity<Boolean> checkEmailExists(@RequestBody EmailCheckRequest emailRequest) {
        boolean exists = userService.existsByEmail(emailRequest.getEmail());
        return ResponseEntity.ok(exists);
    }

    // GET /api/users/{id} - Obtener usuario por ID (debe ir después de rutas
    // específicas)
    @GetMapping("/{id:\\d+}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        Optional<User> user = userService.getUserById(id);
        return user.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // PUT /api/users/{id} - Actualizar usuario
    @PutMapping("/{id:\\d+}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @Valid @RequestBody User userDetails) {
        Optional<User> updatedUser = userService.updateUser(id, userDetails);
        return updatedUser.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE /api/users/{id} - Eliminar usuario (Admin)
    @DeleteMapping("/{id:\\d+}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        boolean deleted = userService.deleteUser(id);
        return deleted ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }

    // Clases internas para requests
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

    public static class EmailCheckRequest {
        private String email;

        // Getters y setters
        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }
    }
}
