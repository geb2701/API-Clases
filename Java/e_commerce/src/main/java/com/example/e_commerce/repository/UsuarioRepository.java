package com.example.e_commerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.e_commerce.model.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

}