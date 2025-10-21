package com.ecommerce.controller;

import com.ecommerce.dto.ProductRequest;
import com.ecommerce.dto.ProductResponse;
import com.ecommerce.service.ProductSimpleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/productos") // /api/productos (por el context-path)
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5173" })
public class ProductSimpleController {

  private final ProductSimpleService productService;

  /**
   * GET /api/productos - Listar todos los productos
   * Frontend: getProducts() en product-service.ts
   */
  @GetMapping
  public ResponseEntity<List<ProductResponse>> getAllProducts() {
    List<ProductResponse> products = productService.getAllProducts();
    return ResponseEntity.ok(products);
  }

  /**
   * GET /api/productos/{id} - Obtener producto por ID
   * Frontend: getProductById(id) en product-service.ts
   */
  @GetMapping("/{id}")
  public ResponseEntity<ProductResponse> getProductById(@PathVariable Long id) {
    try {
      ProductResponse product = productService.getProductById(id);
      return ResponseEntity.ok(product);
    } catch (RuntimeException e) {
      return ResponseEntity.notFound().build();
    }
  }

  /**
   * GET /api/productos/categoria/{category} - Productos por categoría
   * Frontend: getProductsByCategory(category)
   */
  @GetMapping("/categoria/{category}")
  public ResponseEntity<List<ProductResponse>> getProductsByCategory(@PathVariable String category) {
    List<ProductResponse> products = productService.getProductsByCategory(category);
    return ResponseEntity.ok(products);
  }

  /**
   * GET /api/productos/buscar?q=texto - Buscar productos
   * Frontend: searchProducts(query)
   */
  @GetMapping("/buscar")
  public ResponseEntity<List<ProductResponse>> searchProducts(@RequestParam String q) {
    List<ProductResponse> products = productService.searchProducts(q);
    return ResponseEntity.ok(products);
  }

  /**
   * GET /api/productos/ofertas - Productos con descuento
   */
  @GetMapping("/ofertas")
  public ResponseEntity<List<ProductResponse>> getDiscountedProducts() {
    List<ProductResponse> products = productService.getDiscountedProducts();
    return ResponseEntity.ok(products);
  }

  /**
   * GET /api/productos/stock-bajo?threshold=5 - Productos con stock bajo
   */
  @GetMapping("/stock-bajo")
  public ResponseEntity<List<ProductResponse>> getLowStockProducts(
      @RequestParam(defaultValue = "5") Integer threshold) {
    List<ProductResponse> products = productService.getLowStockProducts(threshold);
    return ResponseEntity.ok(products);
  }

  /**
   * POST /api/productos - Crear producto (Admin)
   * Frontend: createProduct(data) en add-product.tsx
   */
  @PostMapping
  public ResponseEntity<ProductResponse> createProduct(@Valid @RequestBody ProductRequest request) {
    try {
      ProductResponse product = productService.createProduct(request);
      return ResponseEntity.status(HttpStatus.CREATED).body(product);
    } catch (Exception e) {
      return ResponseEntity.badRequest().build();
    }
  }

  /**
   * PUT /api/productos/{id} - Actualizar producto (Admin)
   * Frontend: updateProduct(id, data) en edit-product.tsx
   */
  @PutMapping("/{id}")
  public ResponseEntity<ProductResponse> updateProduct(
      @PathVariable Long id,
      @Valid @RequestBody ProductRequest request) {
    try {
      ProductResponse product = productService.updateProduct(id, request);
      return ResponseEntity.ok(product);
    } catch (RuntimeException e) {
      return ResponseEntity.notFound().build();
    } catch (Exception e) {
      return ResponseEntity.badRequest().build();
    }
  }

  /**
   * DELETE /api/productos/{id} - Eliminar producto (Admin)
   * Frontend: deleteProduct(id) en manage-products.tsx
   */
  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
    try {
      productService.deleteProduct(id);
      return ResponseEntity.ok().build();
    } catch (RuntimeException e) {
      return ResponseEntity.notFound().build();
    }
  }
}
