package com.ecommerce.service;

import com.ecommerce.dto.LoginRequest;
import com.ecommerce.dto.RegisterRequest;
import com.ecommerce.dto.UserResponse;
import com.ecommerce.entity.User;
import com.ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Servicio de autenticación simplificado sin Spring Security
 * Para producción, se recomienda implementar Spring Security con JWT
 */
@Service
@Transactional
@RequiredArgsConstructor
public class AuthService {

  private final UserRepository userRepository;

  // Registrar nuevo usuario
  public UserResponse register(RegisterRequest request) {
    // Verificar si el email ya existe
    if (userRepository.existsByEmail(request.getEmail())) {
      throw new RuntimeException("El email ya está registrado");
    }

    // Crear nuevo usuario
    User user = new User();
    user.setName(request.getName());
    user.setSurname(request.getSurname() != null ? request.getSurname() : "");
    user.setEmail(request.getEmail());
    // TODO: En producción, encriptar la contraseña con BCrypt
    user.setPassword(request.getPassword());
    user.setIsActive(true);

    User savedUser = userRepository.save(user);
    return toUserResponse(savedUser);
  }

  // Login
  public UserResponse login(LoginRequest request) {
    // Buscar usuario por email
    User user = userRepository.findByEmail(request.getEmail())
        .orElseThrow(() -> new RuntimeException("Email o contraseña incorrectos"));

    // Verificar contraseña
    // TODO: En producción, usar BCrypt para comparar
    if (!user.getPassword().equals(request.getPassword())) {
      throw new RuntimeException("Email o contraseña incorrectos");
    }

    // Verificar que esté activo
    if (!user.getIsActive()) {
      throw new RuntimeException("La cuenta está inactiva");
    }

    return toUserResponse(user);
  }

  // Convertir entidad a DTO
  private UserResponse toUserResponse(User user) {
    return UserResponse.builder()
        .id(user.getId())
        .name(user.getName())
        .surname(user.getSurname())
        .email(user.getEmail())
        .build();
  }
}
