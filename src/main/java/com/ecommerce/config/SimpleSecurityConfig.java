package com.ecommerce.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Configuración de seguridad simplificada para desarrollo
 * IMPORTANTE: En producción, implementar autenticación con JWT y roles
 * apropiados
 */
@Configuration
@EnableWebSecurity
public class SimpleSecurityConfig {

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .csrf(csrf -> csrf.disable()) // Deshabilitar CSRF para desarrollo
        .authorizeHttpRequests(auth -> auth
            .anyRequest().permitAll() // Permitir todas las solicitudes sin autenticación
        );

    return http.build();
  }
}
