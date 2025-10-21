package com.ecommerce.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {

  @NotBlank(message = "El nombre es requerido")
  @Size(max = 100, message = "El nombre no puede exceder los 100 caracteres")
  private String name;

  private String surname; // Opcional según tu frontend

  @NotBlank(message = "El email es requerido")
  @Email(message = "El email debe tener un formato válido")
  private String email;

  @NotBlank(message = "La contraseña es requerida")
  @Size(min = 6, message = "La contraseña debe tener al menos 6 caracteres")
  private String password;
}
