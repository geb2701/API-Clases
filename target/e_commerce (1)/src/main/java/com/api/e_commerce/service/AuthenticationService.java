package com.api.e_commerce.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.api.e_commerce.dto.LoginRequest;
import com.api.e_commerce.dto.RegisterRequest;
import com.api.e_commerce.model.Role;
import com.api.e_commerce.model.Usuario;
import com.api.e_commerce.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class AuthenticationService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public String register(RegisterRequest request) {

        if (usuarioRepository.existsByEmail(request.getEmail())) {
            //TODO: ssanchez - crear exception personalizada y manejar con @ControllerAdvice
            throw new RuntimeException("Email already exists");
        }

        // Crear un nuevo usuario con los datos del request
        //builder ayuda con esto, que es boiler plate código repeptitivo
        // Usuario usuario = new Usuario();
        // usuario.setNombre(request.getNombre());
        // usuario.setApellido(request.getApellido());
        // usuario.setEmail(request.getEmail());
        // usuario.setPassword(passwordEncoder.encode(request.getPassword()));
        // usuario.setRole(Role.USER);


        //viene de Lombok (@Builder) y facilita la creación de objetos de manera más limpia y fluida
        Usuario usuario = Usuario.builder()
                .nombre(request.getNombre())
                .apellido(request.getApellido())
                .email(request.getEmail())
                // encriptado la pass que envío el usuario
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER) // Por defecto, todos los usuarios nuevos son USER
                .build();


        usuarioRepository.save(usuario);
        return "User registered successfully";
    }

    /**
     * AuthenticationManager:
     * - Se configura en SecurityConfig usando AuthenticationConfiguration
     * - Spring Boot autoconfigura el AuthenticationManager con UserDetailsService y PasswordEncoder
     * - Gestiona el proceso de autenticación completo
     * 
     * UsernamePasswordAuthenticationToken:
     * - representa las credenciales del usuario
     * - Se usa para el proceso de autenticación básica username/password
     * 
     *  Este token no autenticado se pasa al authenticationManager, que:
     * - Valida las credenciales contra la base de datos
     * - Verifica la contraseña usando el PasswordEncoder
     * - Si todo es correcto, crea un nuevo token autenticado con los roles/authorities del usuario
     *  
     *
     */
    public String authenticate(LoginRequest request) {
        //verifica que exista el email y que la pass sea correcta
        // busca el email en la db
        // pass la encripta y la compara con la pass de la db
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        //para buscar el email se utiliza el método userDetailsService de SecurityConfig
                        request.getEmail(),
                        //para verificar si esta ok la pass se utiliza passwordEncoder, encripta la pass y la compara con la pass encriptada de la db
                        request.getPassword()));

        return "Login successful";
    }
}
