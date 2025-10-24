-- =====================================================
-- SCRIPT PARA ELIMINAR TABLAS DE CARRITO
-- =====================================================
-- El carrito ahora funciona solo con localStorage
-- en el frontend, por lo que estas tablas no son necesarias
-- =====================================================

USE ecommerce_db;

-- Deshabilitar foreign keys temporalmente
SET FOREIGN_KEY_CHECKS = 0;

-- Eliminar tablas de carrito
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS cart_sessions;

-- Rehabilitar foreign keys
SET FOREIGN_KEY_CHECKS = 1;

SELECT '¡Tablas de carrito eliminadas exitosamente!' as Resultado;
SELECT 'El carrito ahora funciona 100% con localStorage en el navegador' as Info;

