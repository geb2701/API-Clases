package com.ecommerce.service;

import com.ecommerce.entity.Order;
import com.ecommerce.entity.OrderItem;
import com.ecommerce.entity.Product;
import com.ecommerce.repository.OrderRepository;
import com.ecommerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OrderService {

  private final OrderRepository orderRepository;
  private final ProductRepository productRepository;

  @Transactional(readOnly = true)
  public List<Order> getAllOrders() {
    return orderRepository.findAll();
  }

  @Transactional(readOnly = true)
  public Optional<Order> getOrderById(Long id) {
    return orderRepository.findById(id);
  }

  @Transactional(readOnly = true)
  public List<Order> getOrdersByDni(String dni) {
    return orderRepository.findByBillingDniOrderByCreatedAtDesc(dni);
  }

  @Transactional
  public Order createOrder(Order order, List<OrderItemRequest> items) {
    // Calcular total
    BigDecimal total = BigDecimal.ZERO;

    // Crear items de la orden
    for (OrderItemRequest itemRequest : items) {
      Product product = productRepository.findById(itemRequest.getProductId())
          .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + itemRequest.getProductId()));

      // Verificar stock
      if (product.getStock() < itemRequest.getQuantity()) {
        throw new RuntimeException("Stock insuficiente para " + product.getName());
      }

      // Crear item
      OrderItem orderItem = new OrderItem();
      orderItem.setProduct(product);
      orderItem.setQuantity(itemRequest.getQuantity());

      // Usar precio actual o con descuento
      BigDecimal price = product.getDiscount() != null && product.getDiscount().compareTo(BigDecimal.ZERO) > 0
          ? product.getDiscount()
          : product.getPrice();

      orderItem.setPrice(price);
      order.addItem(orderItem);

      // Sumar al total
      total = total.add(price.multiply(BigDecimal.valueOf(itemRequest.getQuantity())));

      // Reducir stock
      product.setStock(product.getStock() - itemRequest.getQuantity());
      productRepository.save(product);
    }

    order.setTotal(total);
    return orderRepository.save(order);
  }

  @Transactional
  public Optional<Order> updateOrderStatus(Long id, Order.OrderStatus newStatus) {
    return orderRepository.findById(id)
        .map(order -> {
          order.setStatus(newStatus);
          return orderRepository.save(order);
        });
  }

  // Clase interna para request de items
  @lombok.Data
  public static class OrderItemRequest {
    private Long productId;
    private Integer quantity;
  }
}
