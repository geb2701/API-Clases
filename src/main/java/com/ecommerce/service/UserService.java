package com.ecommerce.service;

import com.ecommerce.entity.User;
import com.ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    public List<User> getAllUsers() {
        return userRepository.findAllActive();
    }
    
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id)
            .filter(User::getIsActive);
    }
    
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findActiveByEmail(email);
    }
    
    public User createUser(User user) {
        // Verificar si el email ya existe
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("El email ya está registrado");
        }
        
        // Encriptar contraseña
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setIsActive(true);
        
        return userRepository.save(user);
    }
    
    public Optional<User> updateUser(Long id, User userDetails) {
        return userRepository.findById(id)
            .filter(User::getIsActive)
            .map(existingUser -> {
                existingUser.setName(userDetails.getName());
                existingUser.setSurname(userDetails.getSurname());
                existingUser.setEmail(userDetails.getEmail());
                // No actualizar la contraseña aquí por seguridad
                return userRepository.save(existingUser);
            });
    }
    
    public boolean deleteUser(Long id) {
        return userRepository.findById(id)
            .filter(User::getIsActive)
            .map(user -> {
                user.setIsActive(false);
                userRepository.save(user);
                return true;
            })
            .orElse(false);
    }
    
    public boolean authenticateUser(String email, String password) {
        return userRepository.findActiveByEmail(email)
            .map(user -> passwordEncoder.matches(password, user.getPassword()))
            .orElse(false);
    }
    
    public Optional<User> login(String email, String password) {
        return userRepository.findActiveByEmail(email)
            .filter(user -> passwordEncoder.matches(password, user.getPassword()));
    }
    
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
}
