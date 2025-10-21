package com.ecommerce.service;

import com.ecommerce.dto.ProductRequest;
import com.ecommerce.dto.ProductResponse;
import com.ecommerce.entity.ProductSimple;
import com.ecommerce.repository.ProductSimpleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class ProductSimpleService {

  private final ProductSimpleRepository productRepository;

  // Obtener todos los productos activos
  public List<ProductResponse> getAllProducts() {
    return productRepository.findByIsActiveTrue()
        .stream()
        .map(this::toProductResponse)
        .collect(Collectors.toList());
  }

  // Obtener producto por ID
  public ProductResponse getProductById(Long id) {
    ProductSimple product = productRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + id));
    return toProductResponse(product);
  }

  // Crear producto
  public ProductResponse createProduct(ProductRequest request) {
    ProductSimple product = ProductSimple.builder()
        .name(request.getName())
        .description(request.getDescription())
        .price(request.getPrice())
        .category(request.getCategory())
        .image(request.getImage())
        .stock(request.getStock())
        .discount(request.getDiscount())
        .isActive(true)
        .build();

    ProductSimple savedProduct = productRepository.save(product);
    return toProductResponse(savedProduct);
  }

  // Actualizar producto
  public ProductResponse updateProduct(Long id, ProductRequest request) {
    ProductSimple product = productRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + id));

    product.setName(request.getName());
    product.setDescription(request.getDescription());
    product.setPrice(request.getPrice());
    product.setCategory(request.getCategory());
    product.setImage(request.getImage());
    product.setStock(request.getStock());
    product.setDiscount(request.getDiscount());

    ProductSimple updatedProduct = productRepository.save(product);
    return toProductResponse(updatedProduct);
  }

  // Eliminar producto (soft delete)
  public void deleteProduct(Long id) {
    ProductSimple product = productRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + id));

    product.setIsActive(false);
    productRepository.save(product);
  }

  // Buscar productos por categoría
  public List<ProductResponse> getProductsByCategory(String category) {
    return productRepository.findByCategoryIgnoreCase(category)
        .stream()
        .map(this::toProductResponse)
        .collect(Collectors.toList());
  }

  // Buscar productos
  public List<ProductResponse> searchProducts(String query) {
    return productRepository.searchProducts(query)
        .stream()
        .map(this::toProductResponse)
        .collect(Collectors.toList());
  }

  // Productos con descuento
  public List<ProductResponse> getDiscountedProducts() {
    return productRepository.findProductsWithDiscount()
        .stream()
        .map(this::toProductResponse)
        .collect(Collectors.toList());
  }

  // Productos con stock bajo
  public List<ProductResponse> getLowStockProducts(Integer threshold) {
    return productRepository.findLowStockProducts(threshold)
        .stream()
        .map(this::toProductResponse)
        .collect(Collectors.toList());
  }

  // Convertir entidad a DTO
  private ProductResponse toProductResponse(ProductSimple product) {
    return ProductResponse.builder()
        .id(product.getId())
        .name(product.getName())
        .description(product.getDescription())
        .price(product.getPrice())
        .category(product.getCategory())
        .image(product.getImage())
        .stock(product.getStock())
        .discount(product.getDiscount())
        .build();
  }
}
