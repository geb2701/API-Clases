-- =====================================================
-- SCRIPT PARA CORREGIR ENCODING DE CATEGORÍAS
-- Este script corrige los caracteres corruptos usando HEX directo
-- =====================================================

USE ecommerce_db;
SET NAMES utf8mb4;

-- Deshabilitar foreign keys temporalmente
SET FOREIGN_KEY_CHECKS = 0;

-- Verificar el estado actual
SELECT '=== ESTADO ACTUAL ===' as estado;
SELECT id, name, HEX(name) as name_hex FROM categories ORDER BY id;

-- Corregir cada categoría usando UNHEX con los bytes UTF-8 correctos
-- Decoración: ó en UTF-8 es C3B3
-- Tecnología: í en UTF-8 es C3AD

UPDATE categories 
SET name = UNHEX('4465636F72616369C3B36E'), -- 'Decoración' en hex
    updated_at = NOW()
WHERE id = 2;

UPDATE categories 
SET name = UNHEX('5465636E6F6C6F67C3AD61'), -- 'Tecnología' en hex
    updated_at = NOW()
WHERE id = 6;

-- Asegurar que las columnas estén en utf8mb4
ALTER TABLE categories MODIFY name VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL;
ALTER TABLE categories MODIFY description TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Rehabilitar foreign keys
SET FOREIGN_KEY_CHECKS = 1;

-- Verificar el resultado
SELECT '=== ESTADO DESPUES DE CORRECCION ===' as estado;
SELECT id, name, HEX(name) as name_hex FROM categories ORDER BY id;

SELECT 'Categorias corregidas exitosamente!' as Resultado;
