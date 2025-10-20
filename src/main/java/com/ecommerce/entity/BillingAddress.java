package com.ecommerce.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "billing_addresses")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BillingAddress {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull(message = "El usuario es requerido")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;
    
    @NotBlank(message = "El nombre es requerido")
    @Size(max = 100, message = "El nombre no puede exceder los 100 caracteres")
    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;
    
    @NotBlank(message = "El apellido es requerido")
    @Size(max = 100, message = "El apellido no puede exceder los 100 caracteres")
    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;
    
    @NotBlank(message = "El DNI es requerido")
    @Size(max = 20, message = "El DNI no puede exceder los 20 caracteres")
    @Column(name = "dni", nullable = false, length = 20)
    private String dni;
    
    @NotBlank(message = "La dirección es requerida")
    @Size(max = 200, message = "La dirección no puede exceder los 200 caracteres")
    @Column(name = "address", nullable = false, length = 200)
    private String address;
    
    @NotBlank(message = "La ciudad es requerida")
    @Size(max = 100, message = "La ciudad no puede exceder los 100 caracteres")
    @Column(name = "city", nullable = false, length = 100)
    private String city;
    
    @NotBlank(message = "El código postal es requerido")
    @Size(max = 20, message = "El código postal no puede exceder los 20 caracteres")
    @Column(name = "postal_code", nullable = false, length = 20)
    private String postalCode;
    
    @Column(name = "is_default", nullable = false)
    private Boolean isDefault = false;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    public String getFullName() {
        return firstName + " " + lastName;
    }
}
