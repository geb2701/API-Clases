package grupo7.ecommerceapi.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "payment_info")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class PaymentInfo {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @JsonIgnore
    @NotNull(message = "El pedido es requerido")
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;
    
    @NotBlank(message = "El número de tarjeta es requerido")
    @Column(name = "card_number_encrypted", nullable = false, length = 255)
    private String cardNumberEncrypted;
    
    @NotBlank(message = "La fecha de vencimiento es requerida")
    @Size(max = 10, message = "La fecha de vencimiento no puede exceder los 10 caracteres")
    @Column(name = "expiry_date", nullable = false, length = 10)
    private String expiryDate;
    
    @NotBlank(message = "El CVV es requerido")
    @Column(name = "cvv_encrypted", nullable = false, length = 255)
    private String cvvEncrypted;
    
    @NotBlank(message = "El nombre del titular es requerido")
    @Size(max = 100, message = "El nombre del titular no puede exceder los 100 caracteres")
    @Column(name = "cardholder_name", nullable = false, length = 100)
    private String cardholderName;
    
    @Column(name = "payment_method", nullable = false, length = 50)
    private String paymentMethod = "credit_card";
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
