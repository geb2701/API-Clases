-- =====================================================
-- SCRIPT PARA LIMPIAR DATOS EXISTENTES
-- =====================================================

USE ecommerce_db;

-- Deshabilitar foreign keys temporalmente
SET FOREIGN_KEY_CHECKS = 0;

-- Limpiar todas las tablas en orden inverso de dependencias
DELETE FROM payment_info;
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM cart_items;
DELETE FROM cart_sessions;
DELETE FROM shipping_addresses;
DELETE FROM billing_addresses;
DELETE FROM products;
DELETE FROM categories;
DELETE FROM users;

-- Reiniciar auto_increment
ALTER TABLE users AUTO_INCREMENT = 1;
ALTER TABLE categories AUTO_INCREMENT = 1;
ALTER TABLE products AUTO_INCREMENT = 1;
ALTER TABLE orders AUTO_INCREMENT = 1;
ALTER TABLE order_items AUTO_INCREMENT = 1;
ALTER TABLE cart_items AUTO_INCREMENT = 1;
ALTER TABLE billing_addresses AUTO_INCREMENT = 1;
ALTER TABLE shipping_addresses AUTO_INCREMENT = 1;
ALTER TABLE payment_info AUTO_INCREMENT = 1;

-- Rehabilitar foreign keys
SET FOREIGN_KEY_CHECKS = 1;

SELECT '¡Datos limpiados exitosamente!' as Resultado;



