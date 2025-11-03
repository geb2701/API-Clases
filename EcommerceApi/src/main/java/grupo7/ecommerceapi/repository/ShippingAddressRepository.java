package grupo7.ecommerceapi.repository;

import grupo7.ecommerceapi.entity.ShippingAddress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShippingAddressRepository extends JpaRepository<ShippingAddress, Long> {

    List<ShippingAddress> findByUserId(Long userId);

    @Query("SELECT sa FROM ShippingAddress sa WHERE sa.user.id = :userId")
    List<ShippingAddress> findByUser(@Param("userId") Long userId);

    @Query("SELECT sa FROM ShippingAddress sa WHERE sa.user.id = :userId AND sa.isDefault = true")
    Optional<ShippingAddress> findDefaultByUser(@Param("userId") Long userId);

    @Query("SELECT sa FROM ShippingAddress sa WHERE sa.order.id = :orderId")
    Optional<ShippingAddress> findByOrder(@Param("orderId") Long orderId);
    
    @Query("SELECT sa FROM ShippingAddress sa WHERE sa.order.id = :orderId")
    List<ShippingAddress> findAllByOrderId(@Param("orderId") Long orderId);

    @Query("SELECT sa FROM ShippingAddress sa WHERE sa.user.id = :userId ORDER BY sa.isDefault DESC, sa.createdAt DESC")
    List<ShippingAddress> findByUserOrderByDefaultAndCreatedAt(@Param("userId") Long userId);
}
