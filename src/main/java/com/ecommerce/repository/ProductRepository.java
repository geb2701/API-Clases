package com.ecommerce.repository;

import com.ecommerce.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    // Buscar productos activos con paginación
    Page<Product> findByIsActiveTrue(Pageable pageable);
    
    // Buscar por categoría (case insensitive)
    @Query("SELECT p FROM Product p WHERE LOWER(p.category) = LOWER(:category) AND p.isActive = true")
    Page<Product> findByCategoryIgnoreCase(@Param("category") String category, Pageable pageable);
    
    // Buscar por nombre o descripción
    @Query("SELECT p FROM Product p WHERE " +
           "(LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "p.isActive = true")
    Page<Product> searchProducts(@Param("query") String query, Pageable pageable);
}

