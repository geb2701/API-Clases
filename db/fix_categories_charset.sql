-- =====================================================
-- SCRIPT PARA ARREGLAR PROBLEMAS DE CODIFICACIÓN UTF-8
-- EN LAS CATEGORÍAS
-- =====================================================

USE ecommerce_db;

-- PASO 1: Verificar el charset actual de las tablas
SELECT '=== CHARSET ACTUAL DE LAS TABLAS ===' as '';
SELECT TABLE_NAME, TABLE_COLLATION 
FROM information_schema.TABLES 
WHERE TABLE_SCHEMA = 'ecommerce_db' 
AND TABLE_NAME IN ('categories', 'products')
ORDER BY TABLE_NAME;

-- PASO 2: Convertir las tablas a utf8mb4 si no lo están
ALTER TABLE categories CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE products CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- PASO 3: Limpiar categorías con problemas
DELETE FROM categories;

-- PASO 4: Insertar categorías correctas con UTF-8
INSERT INTO categories (id, name, description, is_active, created_at, updated_at) VALUES
(1, 'Accesorios', 'Accesorios y complementos tecnológicos', TRUE, NOW(), NOW()),
(2, 'Decoración', 'Artículos decorativos modernos y minimalistas', TRUE, NOW(), NOW()),
(3, 'Hogar', 'Muebles y productos para el hogar', TRUE, NOW(), NOW()),
(4, 'Libros', 'Libros técnicos y material educativo', TRUE, NOW(), NOW()),
(5, 'Ropa', 'Ropa y textiles con diseños geek', TRUE, NOW(), NOW()),
(6, 'Tecnología', 'Productos tecnológicos y electrónicos', TRUE, NOW(), NOW());

-- PASO 5: Verificar que se insertaron correctamente
SELECT '=== CATEGORÍAS CORREGIDAS ===' as '';
SELECT id, HEX(name) as name_hex, name, description FROM categories ORDER BY id;

-- PASO 6: Mostrar estadísticas
SELECT '=== RESUMEN ===' as '';
SELECT c.name as Categoría, COUNT(p.id) as Productos
FROM categories c
LEFT JOIN products p ON c.id = p.category_id AND p.is_active = TRUE
GROUP BY c.id, c.name
ORDER BY c.name;

SELECT '¡Problema de codificación resuelto!' as Resultado;
