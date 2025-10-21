package grupo7.ecommerceapi.service;

import grupo7.ecommerceapi.entity.Product;
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

    public Page<Product> getAllProducts(Pageable pageable) {
        return productRepository.findAllActive(pageable);
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findActiveById(id);
    }

    public Page<Product> getProductsByCategory(String categoryName, Pageable pageable) {
        return productRepository.findByCategoryNameAndActiveTrue(categoryName, pageable);
    }

    public Page<Product> searchProducts(String searchTerm, Pageable pageable) {
        return productRepository.findBySearchTermAndActiveTrue(searchTerm, pageable);
    }

    public Page<Product> getProductsByCategoryAndSearch(String categoryName, String searchTerm, Pageable pageable) {
        return productRepository.findByCategoryAndSearchTerm(categoryName, searchTerm, pageable);
    }

    public Page<Product> getDiscountedProducts(Pageable pageable) {
        return productRepository.findDiscountedProducts(pageable);
    }

    public Page<Product> getProductsByPriceRange(BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable) {
        return productRepository.findByPriceRangeAndActiveTrue(minPrice, maxPrice, pageable);
    }

    public Page<Product> getProductsSortedByName(String direction, Pageable pageable) {
        return "desc".equalsIgnoreCase(direction)
                ? productRepository.findAllActiveOrderByNameDesc(pageable)
                : productRepository.findAllActiveOrderByNameAsc(pageable);
    }

    public Page<Product> getProductsSortedByPrice(String direction, Pageable pageable) {
        return "desc".equalsIgnoreCase(direction)
                ? productRepository.findAllActiveOrderByPriceDesc(pageable)
                : productRepository.findAllActiveOrderByPriceAsc(pageable);
    }

    @Transactional
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    @Transactional
    public Optional<Product> updateProduct(Long id, Product productDetails) {
        return productRepository.findActiveById(id)
                .map(existingProduct -> {
                    existingProduct.setName(productDetails.getName());
                    existingProduct.setDescription(productDetails.getDescription());
                    existingProduct.setPrice(productDetails.getPrice());
                    existingProduct.setCategory(productDetails.getCategory());
                    existingProduct.setImage(productDetails.getImage());
                    existingProduct.setStock(productDetails.getStock());
                    existingProduct.setDiscount(productDetails.getDiscount());
                    return productRepository.save(existingProduct);
                });
    }

    @Transactional
    public boolean deleteProduct(Long id) {
        return productRepository.findActiveById(id)
                .map(product -> {
                    product.setIsActive(false);
                    productRepository.save(product);
                    return true;
                })
                .orElse(false);
    }

    public Optional<Integer> getProductStock(Long productId) {
        return productRepository.findStockById(productId);
    }

    public List<Product> getLowStockProducts(Integer threshold) {
        return productRepository.findLowStockProducts(threshold);
    }

    @Transactional
    public boolean updateStock(Long productId, Integer quantity) {
        return productRepository.findActiveById(productId)
                .map(product -> {
                    if (product.getStock() >= quantity) {
                        product.setStock(product.getStock() - quantity);
                        productRepository.save(product);
                        return true;
                    }
                    return false;
                })
                .orElse(false);
    }
}
