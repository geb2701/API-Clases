package com.ecommerce.repository;

import com.ecommerce.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    // Búsqueda por categoría
    @Query("SELECT p FROM Product p WHERE p.category.id = :categoryId AND p.isActive = true")
    Page<Product> findByCategoryIdAndActiveTrue(@Param("categoryId") Long categoryId, Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.category.name = :categoryName AND p.isActive = true")
    Page<Product> findByCategoryNameAndActiveTrue(@Param("categoryName") String categoryName, Pageable pageable);
    
    // Búsqueda por texto
    @Query("SELECT p FROM Product p WHERE p.isActive = true AND " +
           "(LOWER(p.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    Page<Product> findBySearchTermAndActiveTrue(@Param("searchTerm") String searchTerm, Pageable pageable);
    
    // Productos con descuento
    @Query("SELECT p FROM Product p WHERE p.isActive = true AND p.discount IS NOT NULL AND p.discount < p.price")
    Page<Product> findDiscountedProducts(Pageable pageable);
    
    // Filtros por precio
    @Query("SELECT p FROM Product p WHERE p.isActive = true AND p.price BETWEEN :minPrice AND :maxPrice")
    Page<Product> findByPriceRangeAndActiveTrue(@Param("minPrice") BigDecimal minPrice, 
                                               @Param("maxPrice") BigDecimal maxPrice, 
                                               Pageable pageable);
    
    // Ordenamiento
    @Query("SELECT p FROM Product p WHERE p.isActive = true ORDER BY p.name ASC")
    Page<Product> findAllActiveOrderByNameAsc(Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.isActive = true ORDER BY p.name DESC")
    Page<Product> findAllActiveOrderByNameDesc(Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.isActive = true ORDER BY p.price ASC")
    Page<Product> findAllActiveOrderByPriceAsc(Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.isActive = true ORDER BY p.price DESC")
    Page<Product> findAllActiveOrderByPriceDesc(Pageable pageable);
    
    // Consultas básicas
    @Query("SELECT p FROM Product p WHERE p.isActive = true")
    Page<Product> findAllActive(Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.id = :id AND p.isActive = true")
    Optional<Product> findActiveById(@Param("id") Long id);
    
    // Búsqueda combinada (categoría + texto)
    @Query("SELECT p FROM Product p WHERE p.isActive = true AND " +
           "p.category.name = :categoryName AND " +
           "(LOWER(p.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    Page<Product> findByCategoryAndSearchTerm(@Param("categoryName") String categoryName, 
                                             @Param("searchTerm") String searchTerm, 
                                             Pageable pageable);
    
    // Verificar stock
    @Query("SELECT p.stock FROM Product p WHERE p.id = :productId AND p.isActive = true")
    Optional<Integer> findStockById(@Param("productId") Long productId);
    
    // Productos con stock bajo
    @Query("SELECT p FROM Product p WHERE p.isActive = true AND p.stock <= :threshold")
    List<Product> findLowStockProducts(@Param("threshold") Integer threshold);
}
