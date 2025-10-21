package grupo7.ecommerceapi.repository;

import grupo7.ecommerceapi.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    Optional<Category> findByName(String name);

    boolean existsByName(String name);

    @Query("SELECT c FROM Category c WHERE c.isActive = true")
    List<Category> findAllActive();

    @Query("SELECT c FROM Category c WHERE c.name = :name AND c.isActive = true")
    Optional<Category> findActiveByName(@Param("name") String name);

    @Query("SELECT c FROM Category c WHERE c.name LIKE %:name% AND c.isActive = true")
    List<Category> findActiveByNameContaining(@Param("name") String name);
}
