package com.example.e_commerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.e_commerce.model.Categoria;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {

}