package grupo7.ecommerceapi.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre es requerido")
    @Size(max = 100, message = "El nombre no puede exceder los 100 caracteres")
    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @NotBlank(message = "El apellido es requerido")
    @Size(max = 100, message = "El apellido no puede exceder los 100 caracteres")
    @Column(name = "surname", nullable = false, length = 100)
    private String surname;

    @NotBlank(message = "El email es requerido")
    @Email(message = "El email debe tener un formato válido")
    @Column(name = "email", nullable = false, unique = true, length = 255)
    private String email;

    @JsonIgnore
    @NotBlank(message = "La contraseña es requerida")
    @Size(min = 6, message = "La contraseña debe tener al menos 6 caracteres")
    @Column(name = "password", nullable = false, length = 255)
    private String password;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, length = 20)
    private Role role = Role.USER;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Relaciones
    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Order> orders;

    // TODO: Re-enable when Cart feature is implemented
    // @JsonIgnore
    // @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch =
    // FetchType.LAZY)
    // private List<CartSession> cartSessions;

    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<BillingAddress> billingAddresses;

    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ShippingAddress> shippingAddresses;

    // Métodos de utilidad
    public String getDisplayName() {
        return name + " <" + email + ">";
    }

    public String getFullName() {
        return name + " " + surname;
    }

    // Enum para roles
    public enum Role {
        USER,
        ADMIN
    }
}
