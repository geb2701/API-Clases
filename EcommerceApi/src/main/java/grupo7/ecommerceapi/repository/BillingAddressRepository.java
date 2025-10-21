package grupo7.ecommerceapi.repository;

import grupo7.ecommerceapi.entity.BillingAddress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BillingAddressRepository extends JpaRepository<BillingAddress, Long> {

    List<BillingAddress> findByUserId(Long userId);

    @Query("SELECT ba FROM BillingAddress ba WHERE ba.user.id = :userId")
    List<BillingAddress> findByUser(@Param("userId") Long userId);

    @Query("SELECT ba FROM BillingAddress ba WHERE ba.user.id = :userId AND ba.isDefault = true")
    Optional<BillingAddress> findDefaultByUser(@Param("userId") Long userId);

    @Query("SELECT ba FROM BillingAddress ba WHERE ba.order.id = :orderId")
    Optional<BillingAddress> findByOrder(@Param("orderId") Long orderId);

    @Query("SELECT ba FROM BillingAddress ba WHERE ba.user.id = :userId ORDER BY ba.isDefault DESC, ba.createdAt DESC")
    List<BillingAddress> findByUserOrderByDefaultAndCreatedAt(@Param("userId") Long userId);
}
