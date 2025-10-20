package com.ecommerce.repository;

import com.ecommerce.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    
    List<CartItem> findByCartSessionId(String cartSessionId);
    
    @Query("SELECT ci FROM CartItem ci WHERE ci.cartSession.id = :cartSessionId")
    List<CartItem> findByCartSession(@Param("cartSessionId") String cartSessionId);
    
    Optional<CartItem> findByCartSessionIdAndProductId(String cartSessionId, Long productId);
    
    @Query("SELECT ci FROM CartItem ci WHERE ci.cartSession.id = :cartSessionId AND ci.product.id = :productId")
    Optional<CartItem> findByCartSessionAndProduct(@Param("cartSessionId") String cartSessionId, 
                                                  @Param("productId") Long productId);
    
    void deleteByCartSessionId(String cartSessionId);
    
    @Modifying
    @Query("DELETE FROM CartItem ci WHERE ci.cartSession.id = :cartSessionId")
    void deleteByCartSession(@Param("cartSessionId") String cartSessionId);
    
    @Modifying
    @Query("DELETE FROM CartItem ci WHERE ci.cartSession.id = :cartSessionId AND ci.product.id = :productId")
    void deleteByCartSessionAndProduct(@Param("cartSessionId") String cartSessionId, 
                                      @Param("productId") Long productId);
    
    @Query("SELECT COUNT(ci) FROM CartItem ci WHERE ci.cartSession.id = :cartSessionId")
    Integer countItemsByCartSession(@Param("cartSessionId") String cartSessionId);
    
    @Query("SELECT SUM(ci.quantity) FROM CartItem ci WHERE ci.cartSession.id = :cartSessionId")
    Integer sumQuantitiesByCartSession(@Param("cartSessionId") String cartSessionId);
}
