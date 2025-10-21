-- Script para poblar la base de datos con productos iniciales
-- Ejecutar después de que Hibernate cree las tablas

USE ecommerce_db;

INSERT INTO products (name, description, price, category, image, stock, discount, is_active, created_at, updated_at) VALUES
('Camiseta React', 'Camiseta cómoda con logo React', 25.50, 'Ropa', '/images/camiseta-react.png', 10, NULL, true, NOW(), NOW()),
('Taza Javascript', 'Taza blanca con logo JS', 12.90, 'Accesorios', '/images/taza-js.png', 10, NULL, true, NOW(), NOW()),
('Hoodie TypeScript', 'Buzo azul con logo TS', 45.00, 'Ropa', '/images/hoodie-ts.png', 10, NULL, true, NOW(), NOW()),
('Sudadera Node.js', 'Sudadera verde con logo Node', 42.00, 'Ropa', '/images/sudadera-node.png', 10, NULL, true, NOW(), NOW()),
('Tazas CSS', 'Set de 2 tazas con logo CSS', 18.50, 'Accesorios', '/images/tazas-css.png', 10, NULL, true, NOW(), NOW()),
('Libro Python', 'Guía completa de Python', 35.00, 'Libros', '/images/libro-python.png', 10, NULL, true, NOW(), NOW()),
('Gorra', 'Gorra negra bordada', 15.00, 'Accesorios', '/images/gorra.png', 10, NULL, true, NOW(), NOW()),
('Mochila', 'Mochila resistente 20L', 55.00, 'Accesorios', '/images/mochila.png', 10, NULL, true, NOW(), NOW()),
('Camiseta Fullstack', 'Camiseta dev fullstack', 28.00, 'Ropa', '/images/camiseta-fullstack.png', 10, NULL, true, NOW(), NOW()),
('Stickers', 'Pack de 50 stickers tech', 8.90, 'Accesorios', '/images/stickers.png', 10, NULL, true, NOW(), NOW()),
('Monitor', 'Monitor 24" Full HD', 250.00, 'Tecnología', '/images/monitor.png', 10, NULL, true, NOW(), NOW()),
('Teclado', 'Teclado mecánico RGB', 89.99, 'Tecnología', '/images/teclado.png', 10, NULL, true, NOW(), NOW()),
('Mouse', 'Mouse óptico gaming', 45.00, 'Tecnología', '/images/mouse.png', 10, NULL, true, NOW(), NOW()),
('Auriculares', 'Auriculares bluetooth', 75.00, 'Tecnología', '/images/auriculares.png', 10, NULL, true, NOW(), NOW()),
('Cámara', 'Webcam HD 1080p', 120.00, 'Tecnología', '/images/camara.png', 10, NULL, true, NOW(), NOW()),
('Lámpara', 'Lámpara LED escritorio', 35.00, 'Hogar', '/images/lampara.png', 10, NULL, true, NOW(), NOW()),
('Silla', 'Silla ergonómica', 180.00, 'Hogar', '/images/silla.png', 10, NULL, true, NOW(), NOW()),
('Mesa', 'Mesa de escritorio', 220.00, 'Hogar', '/images/mesa.png', 10, NULL, true, NOW(), NOW()),
('Alfombra', 'Alfombra antideslizante', 45.00, 'Hogar', '/images/alfombra.png', 10, NULL, true, NOW(), NOW()),
('Cuadro', 'Cuadro decorativo', 28.00, 'Decoración', '/images/cuadro.png', 10, NULL, true, NOW(), NOW());

-- Verificar que se insertaron
SELECT COUNT(*) as total_productos FROM products WHERE is_active = true;
SELECT * FROM products ORDER BY id LIMIT 5;

