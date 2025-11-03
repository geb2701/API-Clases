-- =====================================================
-- SCRIPT PARA AJUSTAR PRODUCTOS: EXACTAMENTE 10 POR CATEGORÍA
-- Elimina productos sobrantes y agrega los faltantes
-- =====================================================

USE ecommerce_db;

-- =====================================================
-- 1. ELIMINAR PRODUCTOS SOBRANTES
-- =====================================================

-- Accesorios: Eliminar 1 producto (tiene 11, necesita 10)
DELETE FROM products WHERE id IN (28); -- Estuche Protector Laptop

-- Ropa: Eliminar 2 productos (tiene 12, necesita 10)
DELETE FROM products WHERE id IN (17, 18); -- Zapatillas Casual Urbanas, Camisa Flannel

-- Tecnología: Eliminar 8 productos (tiene 18, necesita 10)
DELETE FROM products WHERE id IN (29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42);
-- Mantener solo: Mouse, Teclado Mecánico, Auriculares Bluetooth, Raspberry Pi 4, Smartwatch, Reloj Inteligente Pro, Router, Cámara Digital, Portátil, Tablet

-- =====================================================
-- 2. AGREGAR PRODUCTOS FALTANTES
-- =====================================================

-- Decoración: Agregar 10 productos nuevos (tiene 0, necesita 10)
INSERT INTO products (name, description, price, category_id, image, stock, discount, is_active, created_at, updated_at) VALUES
('Cuadro Arte Digital Moderno', 'Cuadro con arte digital impreso en alta calidad. Marco de aluminio negro.', 35.00, 2, 'cuadro.png', 40, 31.50, TRUE, NOW(), NOW()),
('Set Posters Gaming Retro', 'Set de 3 posters de videojuegos clásicos. Tamaño A3 con marcos.', 28.00, 2, 'posters.png', 50, NULL, TRUE, NOW(), NOW()),
('Cuadro Minimalista Abstracto', 'Cuadro abstracto minimalista tamaño 60x40cm. Marco dorado elegante.', 65.00, 2, 'CuadroMinimalista_sin_fondo.png', 20, 58.50, TRUE, NOW(), NOW()),
('Escultura Metálica Decorativa', 'Escultura decorativa de metal con acabado satinado. Altura 35cm.', 95.00, 2, 'Esculturamoderna_sin_fondo.png', 12, NULL, TRUE, NOW(), NOW()),
('Cuadro Código Binario Tech', 'Cuadro con diseño de código binario. Perfecto para desarrolladores tech.', 32.00, 2, 'cuadro.png', 38, 28.80, TRUE, NOW(), NOW()),
('Poster Vintage Retrotech 90s', 'Poster vintage con diseño retro de tecnología años 90. Impresión premium.', 18.00, 2, 'posters.png', 45, NULL, TRUE, NOW(), NOW()),
('Arte Abstracto Contemporáneo', 'Cuadro con arte abstracto contemporáneo. Colores vibrantes y diseño único.', 48.00, 2, 'CuadroMinimalista_sin_fondo.png', 28, 43.20, TRUE, NOW(), NOW()),
('Escultura Minimalista Resina', 'Escultura decorativa minimalista de resina. Diseño elegante y moderno.', 58.00, 2, 'Esculturamoderna_sin_fondo.png', 15, NULL, TRUE, NOW(), NOW()),
('Set Cuadros Tríptico', 'Set de 3 cuadros complementarios formando un tríptico. Ideal para decorar espacios amplios.', 85.00, 2, 'cuadro.png', 22, 76.50, TRUE, NOW(), NOW()),
('Poster Mapa del Mundo Vintage', 'Poster decorativo con mapa del mundo estilo vintage. Tamaño grande 90x60cm.', 42.00, 2, 'posters.png', 30, NULL, TRUE, NOW(), NOW());

-- Hogar: Agregar 10 productos nuevos (tiene 0, necesita 10)
INSERT INTO products (name, description, price, category_id, image, stock, discount, is_active, created_at, updated_at) VALUES
('Lámpara LED Escritorio Pro', 'Lámpara LED con tecnología Eye-Care. Regulación de brillo y temperatura de color.', 42.00, 3, 'lampara.png', 35, 37.80, TRUE, NOW(), NOW()),
('Silla Ergonómica Executive', 'Silla ejecutiva con soporte lumbar y reposabrazos ajustables. Material premium.', 245.00, 3, 'silla.png', 12, NULL, TRUE, NOW(), NOW()),
('Mesa Escritorio Ergonómica', 'Mesa de escritorio con altura ajustable eléctrica. Dimensiones 160x80cm.', 380.00, 3, 'mesa.png', 8, 342.00, TRUE, NOW(), NOW()),
('Alfombra Gaming XL Premium', 'Alfombra gaming extra grande. Superficie suave y fácil de limpiar. Resistente.', 55.00, 3, 'alfombra.png', 28, NULL, TRUE, NOW(), NOW()),
('Cama King Size Premium', 'Cama king con somier y cabecero tapizado. Estilo moderno y elegante.', 520.00, 3, 'cama_sin_fondo.png', 5, 468.00, TRUE, NOW(), NOW()),
('Sofá Esquinero Moderno', 'Sofá esquinero con chaise longue. Tapizado de alta calidad y diseño contemporáneo.', 720.00, 3, 'sillon3plazas_sin_fondo.png', 4, NULL, TRUE, NOW(), NOW()),
('Lámpara de Pared Moderna LED', 'Lámpara de pared con diseño minimalista. Luz LED regulable con sensor.', 68.00, 3, 'LamparaPared_sin_fondo.png', 18, 61.20, TRUE, NOW(), NOW()),
('Estantería Librería 6 Niveles', 'Estantería de 6 niveles para libros y decoración. Madera natural tratada.', 145.00, 3, 'EstanteriaModular_sin_fondo.png', 11, NULL, TRUE, NOW(), NOW()),
('Cafetera Espresso Automática', 'Cafetera espresso automática con espumador de leche integrado. Tecnología avanzada.', 225.00, 3, 'cafetera.png', 15, 202.50, TRUE, NOW(), NOW()),
('Organizador de Escritorio Modular', 'Set organizador con múltiples cajones para documentos y útiles. Diseño modular.', 38.00, 3, '61e4cFFg6XL._AC_SL1001__sin_fondo.png', 32, NULL, TRUE, NOW(), NOW());

-- Libros: Agregar 1 producto más (tiene 9, necesita 10)
INSERT INTO products (name, description, price, category_id, image, stock, discount, is_active, created_at, updated_at) VALUES
('DevOps: CI/CD y Docker', 'Manual práctico de DevOps con Docker, Kubernetes y pipelines de CI/CD.', 59.00, 4, 'libro-python.png', 21, 53.10, TRUE, NOW(), NOW());

-- =====================================================
-- VERIFICACIÓN
-- =====================================================
SELECT '=== PRODUCTOS AJUSTADOS EXITOSAMENTE ===' as resultado;

SELECT 'Resumen: 10 productos por categoria' as info;
SELECT 
    c.name as categoria,
    COUNT(p.id) as total_productos
FROM categories c
LEFT JOIN products p ON c.id = p.category_id AND p.is_active = 1
GROUP BY c.id, c.name
ORDER BY c.name;

SELECT 'Listado de productos por categoria' as info;
SELECT 
    p.id,
    p.name,
    c.name as categoria,
    p.price,
    p.stock
FROM products p
JOIN categories c ON p.category_id = c.id
WHERE p.is_active = 1
ORDER BY c.name, p.id;

