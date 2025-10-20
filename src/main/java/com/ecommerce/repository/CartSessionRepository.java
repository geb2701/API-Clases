package com.ecommerce.repository;

import com.ecommerce.entity.CartSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CartSessionRepository extends JpaRepository<CartSession, String> {
    
    Optional<CartSession> findByUserId(Long userId);
    
    @Query("SELECT cs FROM CartSession cs WHERE cs.user.id = :userId")
    Optional<CartSession> findByUser(@Param("userId") Long userId);
    
    @Query("SELECT cs FROM CartSession cs WHERE cs.createdAt < :date AND cs.user IS NULL")
    List<CartSession> findOldAnonymousCarts(@Param("date") LocalDateTime date);
    
    void deleteByCreatedAtBeforeAndUserIsNull(LocalDateTime date);
}
