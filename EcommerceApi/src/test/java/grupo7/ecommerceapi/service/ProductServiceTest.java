package grupo7.ecommerceapi.service;

import grupo7.ecommerceapi.dto.CreateProductRequest;
import grupo7.ecommerceapi.entity.Category;
import grupo7.ecommerceapi.entity.Product;
import grupo7.ecommerceapi.entity.User;
import grupo7.ecommerceapi.exception.ResourceNotFoundException;
import grupo7.ecommerceapi.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CategoryService categoryService;

    @InjectMocks
    private ProductService productService;

    private CreateProductRequest createProductRequest;
    private Category category;
    private User user;

    @BeforeEach
    void setUp() {
        createProductRequest = new CreateProductRequest();
        createProductRequest.setName("Test Product");
        createProductRequest.setDescription("Description");
        createProductRequest.setPrice(BigDecimal.valueOf(100));
        createProductRequest.setCategory("Electronics");
        createProductRequest.setImage("image.png");
        createProductRequest.setStock(10);
        createProductRequest.setDiscount(BigDecimal.valueOf(90));

        category = new Category();
        category.setId(1L);
        category.setName("Electronics");

        user = new User();
        user.setId(5L);
    }

    @Test
    void createProduct_shouldPersistProduct_whenCategoryExists() {
        when(categoryService.getCategoryByName("Electronics")).thenReturn(Optional.of(category));
        when(productRepository.save(org.mockito.ArgumentMatchers.any(Product.class)))
                .thenAnswer(invocation -> {
                    Product product = invocation.getArgument(0);
                    product.setId(10L);
                    return product;
                });

        Product created = productService.createProduct(createProductRequest, user);

        assertEquals(10L, created.getId());
        assertEquals(user, created.getCreatedBy());
        ArgumentCaptor<Product> productCaptor = ArgumentCaptor.forClass(Product.class);
        verify(productRepository).save(productCaptor.capture());
        Product savedProduct = productCaptor.getValue();
        assertEquals("Test Product", savedProduct.getName());
        assertEquals(category, savedProduct.getCategory());
    }

    @Test
    void createProduct_shouldThrowException_whenCategoryNotFound() {
        when(categoryService.getCategoryByName("Electronics")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> productService.createProduct(createProductRequest, user));
    }

    @Test
    void updateProduct_shouldThrowException_whenProductNotFound() {
        when(productRepository.findActiveById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> productService.updateProduct(1L, createProductRequest));
    }

    @Test
    void adjustStock_shouldThrowException_whenResultingStockNegative() {
        Product product = new Product();
        product.setId(1L);
        product.setStock(1);
        when(productRepository.findActiveById(1L)).thenReturn(Optional.of(product));

        assertThrows(IllegalArgumentException.class, () -> productService.adjustStock(1L, -5));
    }

    @Test
    void getProductStock_shouldReturnStock_whenProductExists() {
        when(productRepository.findStockById(1L)).thenReturn(Optional.of(15));

        int stock = productService.getProductStock(1L);

        assertEquals(15, stock);
    }

    @Test
    void getProductStock_shouldThrow_whenProductDoesNotExist() {
        when(productRepository.findStockById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> productService.getProductStock(1L));
    }

    @Test
    void getAllProducts_shouldReturnPage() {
        Product product = new Product();
        product.setCategory(new Category());
        Page<Product> page = new PageImpl<>(List.of(product));
        when(productRepository.findAllActive(PageRequest.of(0, 10))).thenReturn(page);

        Page<Product> result = productService.getAllProducts(PageRequest.of(0, 10));

        assertEquals(1, result.getTotalElements());
    }
}


