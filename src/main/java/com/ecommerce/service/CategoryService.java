package com.ecommerce.service;

import com.ecommerce.entity.Category;
import com.ecommerce.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CategoryService {
    
    private final CategoryRepository categoryRepository;
    
    public List<Category> getAllCategories() {
        return categoryRepository.findAllActive();
    }
    
    public Optional<Category> getCategoryById(Long id) {
        return categoryRepository.findById(id)
            .filter(Category::getIsActive);
    }
    
    public Optional<Category> getCategoryByName(String name) {
        return categoryRepository.findActiveByName(name);
    }
    
    public List<Category> searchCategories(String name) {
        return categoryRepository.findActiveByNameContaining(name);
    }
    
    @Transactional
    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }
    
    @Transactional
    public Optional<Category> updateCategory(Long id, Category categoryDetails) {
        return categoryRepository.findById(id)
            .filter(Category::getIsActive)
            .map(existingCategory -> {
                existingCategory.setName(categoryDetails.getName());
                existingCategory.setDescription(categoryDetails.getDescription());
                return categoryRepository.save(existingCategory);
            });
    }
    
    @Transactional
    public boolean deleteCategory(Long id) {
        return categoryRepository.findById(id)
            .filter(Category::getIsActive)
            .map(category -> {
                category.setIsActive(false);
                categoryRepository.save(category);
                return true;
            })
            .orElse(false);
    }
    
    public boolean existsByName(String name) {
        return categoryRepository.existsByName(name);
    }
}
