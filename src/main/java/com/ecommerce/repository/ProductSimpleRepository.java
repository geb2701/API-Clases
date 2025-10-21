package com.ecommerce.repository;

import com.ecommerce.entity.ProductSimple;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductSimpleRepository extends JpaRepository<ProductSimple, Long> {

  // Buscar por categoría (case insensitive)
  @Query("SELECT p FROM ProductSimple p WHERE LOWER(p.category) = LOWER(:category) AND p.isActive = true")
  List<ProductSimple> findByCategoryIgnoreCase(@Param("category") String category);

  // Buscar por nombre o descripción (case insensitive)
  @Query("SELECT p FROM ProductSimple p WHERE " +
      "(LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
      "LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
      "p.isActive = true")
  List<ProductSimple> searchProducts(@Param("query") String query);

  // Productos con descuento
  @Query("SELECT p FROM ProductSimple p WHERE p.discount IS NOT NULL AND p.discount < p.price AND p.isActive = true")
  List<ProductSimple> findProductsWithDiscount();

  // Productos activos
  List<ProductSimple> findByIsActiveTrue();

  // Productos con stock bajo
  @Query("SELECT p FROM ProductSimple p WHERE p.stock <= :threshold AND p.isActive = true")
  List<ProductSimple> findLowStockProducts(@Param("threshold") Integer threshold);
}
