-- =====================================================
-- CORREGIR PRODUCTO PYTHON AVANZADO (ID 7)
-- =====================================================

USE ecommerce_db;
SET NAMES utf8mb4;

SET FOREIGN_KEY_CHECKS = 0;

-- Asegurar utf8mb4
ALTER TABLE products MODIFY name VARCHAR(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL;
ALTER TABLE products MODIFY description TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL;

-- Producto ID 7: Libro: Python Avanzado
-- Nombre correcto: 'Libro: Python Avanzado'
-- Descripción correcta: 'Guía completa de programación avanzada en Python. 500 páginas con ejemplos prácticos.'
UPDATE products 
SET name = UNHEX('4C6962726F3A20507974686F6E204176616E7A61646F'),
    description = UNHEX('4775C3AD6120636F6D706C6574612064652070726F6772616D616369C3B36E206176616E7A61646120656E20507974686F6E2E203530302070C3A167696E617320636F6E20656A656D706C6F73207072C3A1637469636F732E'),
    updated_at = NOW()
WHERE id = 7;

SET FOREIGN_KEY_CHECKS = 1;

-- Verificar
SELECT '=== PRODUCTO CORREGIDO ===' as estado;
SELECT id, name, LEFT(description, 80) as descripcion 
FROM products 
WHERE id = 7;

SELECT 'Producto corregido exitosamente!' as Resultado;

