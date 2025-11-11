package grupo7.ecommerceapi.controller;

import grupo7.ecommerceapi.dto.CreateProductRequest;
import grupo7.ecommerceapi.dto.ProductResponseDTO;
import grupo7.ecommerceapi.dto.ProductStockResponseDTO;
import grupo7.ecommerceapi.dto.ProductSummaryDTO;
import grupo7.ecommerceapi.entity.Product;
import grupo7.ecommerceapi.exception.ResourceNotFoundException;
import grupo7.ecommerceapi.mapper.ProductMapper;
import grupo7.ecommerceapi.service.ProductService;
import grupo7.ecommerceapi.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final SecurityUtil securityUtil;
    private final ProductMapper productMapper;

    // GET /api/products/my-products - Obtener productos del usuario autenticado (debe ir antes de /{id})
    @GetMapping("/my-products")
    public ResponseEntity<Page<ProductSummaryDTO>> getMyProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        
        var userOpt = securityUtil.getCurrentUser();
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Product> products = productService.getProductsByUserId(userOpt.get().getId(), pageable);
        Page<ProductSummaryDTO> dtoPage = products.map(productMapper::toSummary);
        return ResponseEntity.ok(dtoPage);
    }

    // GET /api/products - Listar todos los productos con paginación
    @GetMapping
    public ResponseEntity<Page<ProductSummaryDTO>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Product> products = productService.getAllProducts(pageable);
        Page<ProductSummaryDTO> dtoPage = products.map(productMapper::toSummary);
        return ResponseEntity.ok(dtoPage);
    }

    // GET /api/products/{id} - Obtener producto por ID
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponseDTO> getProductById(@PathVariable Long id) {
        Product product = productService.getProductById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con id: " + id));
        return ResponseEntity.ok(productMapper.toResponse(product));
    }

    // GET /api/products/category/{categoryName} - Productos por categoría
    @GetMapping("/category/{categoryName}")
    public ResponseEntity<Page<ProductSummaryDTO>> getProductsByCategory(
            @PathVariable String categoryName,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Product> products = productService.getProductsByCategory(categoryName, pageable);
        return ResponseEntity.ok(products.map(productMapper::toSummary));
    }

    // GET /api/products/search - Buscar productos
    @GetMapping("/search")
    public ResponseEntity<Page<ProductSummaryDTO>> searchProducts(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Product> products = productService.searchProducts(q, pageable);
        return ResponseEntity.ok(products.map(productMapper::toSummary));
    }

    // GET /api/products/category/{categoryName}/search - Buscar en categoría
    // específica
    @GetMapping("/category/{categoryName}/search")
    public ResponseEntity<Page<ProductSummaryDTO>> searchProductsInCategory(
            @PathVariable String categoryName,
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Product> products = productService.getProductsByCategoryAndSearch(categoryName, q, pageable);
        return ResponseEntity.ok(products.map(productMapper::toSummary));
    }

    // GET /api/products/offers - Productos con descuento
    @GetMapping("/offers")
    public ResponseEntity<Page<ProductSummaryDTO>> getDiscountedProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<Product> products = productService.getDiscountedProducts(pageable);
        return ResponseEntity.ok(products.map(productMapper::toSummary));
    }

    // GET /api/products/price-range - Productos por rango de precio
    @GetMapping("/price-range")
    public ResponseEntity<Page<ProductSummaryDTO>> getProductsByPriceRange(
            @RequestParam BigDecimal minPrice,
            @RequestParam BigDecimal maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<Product> products = productService.getProductsByPriceRange(minPrice, maxPrice, pageable);
        return ResponseEntity.ok(products.map(productMapper::toSummary));
    }

    // POST /api/products - Crear producto
    @PostMapping
    public ResponseEntity<ProductResponseDTO> createProduct(@Valid @RequestBody CreateProductRequest request) {
        var userOpt = securityUtil.getCurrentUser();
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Product createdProduct = productService.createProduct(request, userOpt.get());
        return ResponseEntity.status(HttpStatus.CREATED).body(productMapper.toResponse(createdProduct));
    }

    // PUT /api/products/{id} - Actualizar producto (Admin)
    @PutMapping("/{id}")
    public ResponseEntity<ProductResponseDTO> updateProduct(@PathVariable Long id, @Valid @RequestBody CreateProductRequest request) {
        Product updatedProduct = productService.updateProduct(id, request);
        return ResponseEntity.ok(productMapper.toResponse(updatedProduct));
    }

    // DELETE /api/products/{id} - Eliminar producto (Admin)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    // GET /api/products/{id}/stock - Verificar stock
    @GetMapping("/{id}/stock")
    public ResponseEntity<ProductStockResponseDTO> getProductStock(@PathVariable Long id) {
        int stock = productService.getProductStock(id);
        return ResponseEntity.ok(new ProductStockResponseDTO(id, stock));
    }

    // GET /api/products/low-stock - Productos con stock bajo
    @GetMapping("/low-stock")
    public ResponseEntity<List<ProductSummaryDTO>> getLowStockProducts(@RequestParam(defaultValue = "5") Integer threshold) {
        List<Product> products = productService.getLowStockProducts(threshold);
        List<ProductSummaryDTO> dtoList = products.stream()
                .map(productMapper::toSummary)
                .toList();
        return ResponseEntity.ok(dtoList);
    }
}
