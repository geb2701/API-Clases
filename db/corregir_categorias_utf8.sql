-- =====================================================
-- SCRIPT PARA CORREGIR CATEGORÍAS CON PROBLEMAS DE CODIFICACIÓN
-- =====================================================

USE ecommerce_db;

-- Deshabilitar foreign keys temporalmente
SET FOREIGN_KEY_CHECKS = 0;

-- Actualizar categorías con nombres correctos (UTF-8)
UPDATE categories 
SET name = 'Accesorios', 
    description = 'Accesorios y complementos tecnológicos',
    updated_at = NOW()
WHERE id = 1;

UPDATE categories 
SET name = 'Decoración', 
    description = 'Artículos decorativos modernos y minimalistas',
    updated_at = NOW()
WHERE id = 2;

UPDATE categories 
SET name = 'Hogar', 
    description = 'Muebles y productos para el hogar',
    updated_at = NOW()
WHERE id = 3;

UPDATE categories 
SET name = 'Libros', 
    description = 'Libros técnicos y material educativo',
    updated_at = NOW()
WHERE id = 4;

UPDATE categories 
SET name = 'Ropa', 
    description = 'Ropa y textiles con diseños geek',
    updated_at = NOW()
WHERE id = 5;

UPDATE categories 
SET name = 'Tecnología', 
    description = 'Productos tecnológicos y electrónicos',
    updated_at = NOW()
WHERE id = 6;

-- Rehabilitar foreign keys
SET FOREIGN_KEY_CHECKS = 1;

-- Verificar que se actualizaron correctamente
SELECT '=== CATEGORÍAS ACTUALIZADAS ===' as '';
SELECT id, name, description FROM categories ORDER BY id;

-- Verificar productos por categoría
SELECT '=== PRODUCTOS POR CATEGORÍA ===' as '';
SELECT c.name as Categoría, COUNT(p.id) as 'Total Productos'
FROM categories c
LEFT JOIN products p ON c.id = p.category_id AND p.is_active = TRUE
GROUP BY c.id, c.name
ORDER BY c.name;

SELECT '¡Categorías corregidas exitosamente!' as Resultado;
