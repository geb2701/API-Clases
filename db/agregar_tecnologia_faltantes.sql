-- Agregar productos faltantes de Tecnología
USE ecommerce_db;

INSERT INTO products (name, description, price, category_id, image, stock, discount, is_active, created_at, updated_at) VALUES
('Smartwatch Fitness', 'Reloj inteligente con monitor de frecuencia cardíaca y GPS.', 180.00, 6, 'smartwatch.png', 22, NULL, TRUE, NOW(), NOW()),
('Reloj Inteligente Pro', 'Smartwatch premium con pantalla AMOLED y múltiples sensores.', 250.00, 6, 'RelojInteligente_sin_fondo.png', 8, 225.00, TRUE, NOW(), NOW()),
('Router WiFi 6', 'Router de alta velocidad WiFi 6 con cobertura hasta 200m². 4 antenas.', 110.00, 6, 'router.png', 18, NULL, TRUE, NOW(), NOW()),
('Cámara Digital 4K', 'Cámara digital profesional con grabación 4K y estabilización óptica.', 650.00, 6, 'CamaraDigital4k.png', 8, 599.00, TRUE, NOW(), NOW()),
('Portátil Gamer', 'Laptop gaming con RTX 3060, 16GB RAM y SSD 512GB.', 1200.00, 6, 'PortatilGamer_sin_fondo.png', 5, NULL, TRUE, NOW(), NOW()),
('Tablet Pro 12"', 'Tablet profesional con pantalla 12" y lápiz incluido.', 750.00, 6, 'tabltpro_sin_fondo.png', 10, 699.00, TRUE, NOW(), NOW());

SELECT '=== PRODUCTOS DE TECNOLOGÍA AGREGADOS ===' as resultado;
SELECT c.name as categoria, COUNT(p.id) as total FROM categories c LEFT JOIN products p ON c.id = p.category_id WHERE p.is_active = 1 AND c.name = 'Tecnología' GROUP BY c.id, c.name;

