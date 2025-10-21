package com.api.e_commerce.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.api.e_commerce.model.Usuario;

/**
 * Repositorio para manejar operaciones CRUD de la entidad Usuario.
 * Create add, Read find, Update save, Delete delete.
 */
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    //Optional se usa para manejar valores que pueden ser nulos de una manera más segura.
    //Si encuentra un usuario con ese email, retorna Optional.of(usuario)
    //Si no encuentra un usuario, retorna Optional.empty()

    //automaticamente crea la consulta sql: SELECT * FROM usuario WHERE email = ?
    Optional<Usuario> findByEmail(String email);
    
    //automaticamente crea la consulta sql: SELECT * FROM usuario WHERE email = ? -> true o false   
    Boolean existsByEmail(String email);
}
