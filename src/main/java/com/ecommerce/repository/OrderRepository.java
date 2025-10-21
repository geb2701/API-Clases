package com.ecommerce.repository;

import com.ecommerce.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

  List<Order> findByBillingDniOrderByCreatedAtDesc(String dni);

  List<Order> findByStatusOrderByCreatedAtDesc(Order.OrderStatus status);
}
