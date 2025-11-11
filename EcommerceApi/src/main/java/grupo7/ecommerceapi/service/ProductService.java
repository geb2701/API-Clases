package grupo7.ecommerceapi.service;

import grupo7.ecommerceapi.dto.CreateProductRequest;
import grupo7.ecommerceapi.entity.Category;
import grupo7.ecommerceapi.entity.Product;
import grupo7.ecommerceapi.entity.User;
import grupo7.ecommerceapi.exception.ResourceNotFoundException;
import grupo7.ecommerceapi.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryService categoryService;

    @Transactional(readOnly = true)
    public Page<Product> getAllProducts(Pageable pageable) {
        Page<Product> products = productRepository.findAllActive(pageable);
        // Forzar carga de categorías para evitar problemas de serialización
        products.getContent().forEach(this::ensureCategoryLoaded);
        return products;
    }

    @Transactional(readOnly = true)
    public Optional<Product> getProductById(Long id) {
        return productRepository.findActiveById(id);
    }

    @Transactional(readOnly = true)
    public Page<Product> getProductsByCategory(String categoryName, Pageable pageable) {
        Page<Product> products = productRepository.findByCategoryNameAndActiveTrue(categoryName, pageable);
        products.getContent().forEach(this::ensureCategoryLoaded);
        return products;
    }

    @Transactional(readOnly = true)
    public Page<Product> searchProducts(String searchTerm, Pageable pageable) {
        Page<Product> products = productRepository.findBySearchTermAndActiveTrue(searchTerm, pageable);
        products.getContent().forEach(this::ensureCategoryLoaded);
        return products;
    }

    @Transactional(readOnly = true)
    public Page<Product> getProductsByCategoryAndSearch(String categoryName, String searchTerm, Pageable pageable) {
        Page<Product> products = productRepository.findByCategoryAndSearchTerm(categoryName, searchTerm, pageable);
        products.getContent().forEach(this::ensureCategoryLoaded);
        return products;
    }

    @Transactional(readOnly = true)
    public Page<Product> getDiscountedProducts(Pageable pageable) {
        Page<Product> products = productRepository.findDiscountedProducts(pageable);
        products.getContent().forEach(this::ensureCategoryLoaded);
        return products;
    }

    @Transactional(readOnly = true)
    public Page<Product> getProductsByPriceRange(BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable) {
        Page<Product> products = productRepository.findByPriceRangeAndActiveTrue(minPrice, maxPrice, pageable);
        products.getContent().forEach(this::ensureCategoryLoaded);
        return products;
    }

    @Transactional(readOnly = true)
    public Page<Product> getProductsByUserId(Long userId, Pageable pageable) {
        Page<Product> products = productRepository.findByCreatedByIdAndActiveTrue(userId, pageable);
        products.getContent().forEach(this::ensureCategoryLoaded);
        return products;
    }

    @Transactional(readOnly = true)
    public Page<Product> getProductsSortedByName(String direction, Pageable pageable) {
        Page<Product> products = "desc".equalsIgnoreCase(direction)
                ? productRepository.findAllActiveOrderByNameDesc(pageable)
                : productRepository.findAllActiveOrderByNameAsc(pageable);
        products.getContent().forEach(this::ensureCategoryLoaded);
        return products;
    }

    @Transactional(readOnly = true)
    public Page<Product> getProductsSortedByPrice(String direction, Pageable pageable) {
        Page<Product> products = "desc".equalsIgnoreCase(direction)
                ? productRepository.findAllActiveOrderByPriceDesc(pageable)
                : productRepository.findAllActiveOrderByPriceAsc(pageable);
        products.getContent().forEach(this::ensureCategoryLoaded);
        return products;
    }

    @Transactional
    public Product createProduct(CreateProductRequest request, User user) {
        Category category = categoryService.getCategoryByName(request.getCategory())
                .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada: " + request.getCategory()));

        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setCategory(category);
        product.setImage(request.getImage());
        product.setStock(request.getStock());
        product.setDiscount(request.getDiscount());
        product.setCreatedBy(user);
        product.setIsActive(true);

        return productRepository.save(product);
    }

    @Transactional
    public Product updateProduct(Long id, CreateProductRequest request) {
        Product product = productRepository.findActiveById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con id: " + id));

        Category category = categoryService.getCategoryByName(request.getCategory())
                .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada: " + request.getCategory()));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setCategory(category);
        product.setImage(request.getImage());
        product.setStock(request.getStock());
        product.setDiscount(request.getDiscount());

        return productRepository.save(product);
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findActiveById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con id: " + id));

        product.setIsActive(false);
        productRepository.save(product);
    }

    @Transactional(readOnly = true)
    public int getProductStock(Long productId) {
        return productRepository.findStockById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con id: " + productId));
    }

    @Transactional(readOnly = true)
    public List<Product> getLowStockProducts(Integer threshold) {
        List<Product> products = productRepository.findLowStockProducts(threshold);
        products.forEach(this::ensureCategoryLoaded);
        return products;
    }

    @Transactional
    public void adjustStock(Long productId, int delta) {
        Product product = productRepository.findActiveById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con id: " + productId));

        int newStock = product.getStock() + delta;
        if (newStock < 0) {
            throw new IllegalArgumentException("La operación de stock dejaría el producto con stock negativo");
        }
        product.setStock(newStock);
        productRepository.save(product);
    }

    private void ensureCategoryLoaded(Product product) {
        if (product != null && product.getCategory() != null) {
            Category category = product.getCategory();
            category.getId();
            category.getName();
            category.getDescription();
            category.getIsActive();
        }
    }
}
