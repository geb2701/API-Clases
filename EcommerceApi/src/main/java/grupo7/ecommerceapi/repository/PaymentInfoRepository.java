package grupo7.ecommerceapi.repository;

import grupo7.ecommerceapi.entity.PaymentInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentInfoRepository extends JpaRepository<PaymentInfo, Long> {

    Optional<PaymentInfo> findByOrderId(Long orderId);

    @Query("SELECT pi FROM PaymentInfo pi WHERE pi.order.id = :orderId")
    Optional<PaymentInfo> findByOrder(@Param("orderId") Long orderId);
}
