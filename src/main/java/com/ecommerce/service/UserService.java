package com.ecommerce.service;

import com.ecommerce.entity.User;
import com.ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

  private final UserRepository userRepository;

  @Transactional(readOnly = true)
  public Optional<User> findByEmail(String email) {
    return userRepository.findByEmail(email);
  }

  @Transactional(readOnly = true)
  public boolean existsByEmail(String email) {
    return userRepository.existsByEmail(email);
  }

  @Transactional
  public User register(User user) {
    // Verificar si el email ya existe
    if (existsByEmail(user.getEmail())) {
      throw new RuntimeException("El email ya está registrado");
    }

    // Por simplicidad, guardamos la contraseña en texto plano
    // En producción, usar BCryptPasswordEncoder
    return userRepository.save(user);
  }

  @Transactional(readOnly = true)
  public Optional<User> login(String email, String password) {
    Optional<User> user = findByEmail(email);

    if (user.isPresent()) {
      // Por simplicidad, comparamos contraseñas en texto plano
      // En producción, usar BCryptPasswordEncoder
      if (user.get().getPassword().equals(password)) {
        return user;
      }
    }

    return Optional.empty();
  }
}
