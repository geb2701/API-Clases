package com.example.e_commerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.e_commerce.model.Producto;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
    
}