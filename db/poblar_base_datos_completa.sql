-- =====================================================
-- SCRIPT COMPLETO PARA POBLAR BASE DE DATOS
-- E-commerce - Datos de Prueba
-- =====================================================

USE ecommerce_db;

-- Configurar codificación UTF-8 para esta sesión (CRÍTICO para acentos)
-- IMPORTANTE: Ejecutar esto ANTES de cualquier INSERT
SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;
SET CHARACTER SET utf8mb4;
SET CHARACTER_SET_CLIENT = utf8mb4;
SET CHARACTER_SET_CONNECTION = utf8mb4;
SET CHARACTER_SET_RESULTS = utf8mb4;
SET COLLATION_CONNECTION = utf8mb4_unicode_ci;

-- Deshabilitar temporalmente foreign keys para facilitar la inserción
SET FOREIGN_KEY_CHECKS = 0;

-- Asegurar que las tablas usen utf8mb4
ALTER TABLE categories MODIFY name VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL;
ALTER TABLE categories MODIFY description TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Asegurar que la tabla products también use utf8mb4
ALTER TABLE products MODIFY name VARCHAR(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL;
ALTER TABLE products MODIFY description TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL;

-- =====================================================
-- 1. CATEGORÍAS
-- =====================================================
-- Limpiar categorías existentes para evitar duplicados
DELETE FROM categories;

-- Insertar categorías con nombres correctos en UTF-8
-- Usando strings UTF-8 directamente (el archivo está guardado en UTF-8)
-- Con SET NAMES utf8mb4 al inicio del script, MySQL interpretará correctamente los caracteres
INSERT INTO categories (id, name, description, is_active, created_at, updated_at) VALUES
(1, 'Accesorios', 'Accesorios y complementos tecnológicos', TRUE, NOW(), NOW()),
(2, 'Decoración', 'Artículos decorativos modernos y minimalistas', TRUE, NOW(), NOW()),
(3, 'Hogar', 'Muebles y productos para el hogar', TRUE, NOW(), NOW()),
(4, 'Libros', 'Libros técnicos y material educativo', TRUE, NOW(), NOW()),
(5, 'Ropa', 'Ropa y textiles con diseños geek', TRUE, NOW(), NOW()),
(6, 'Tecnología', 'Productos tecnológicos y electrónicos', TRUE, NOW(), NOW());

-- =====================================================
-- 2. USUARIOS DE PRUEBA
-- =====================================================
-- Limpiar usuarios existentes para evitar duplicados
DELETE FROM users;

-- Contraseñas: todas son "password123" (hasheadas con BCrypt)
INSERT INTO users (name, surname, email, password, is_active, created_at, updated_at) VALUES
('Admin', 'Sistema', 'admin@ecommerce.com', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1T8SSRq', TRUE, NOW(), NOW()),
('Juan', 'Pérez', 'juan.perez@email.com', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1T8SSRq', TRUE, NOW(), NOW()),
('María', 'García', 'maria.garcia@email.com', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1T8SSRq', TRUE, NOW(), NOW()),
('Carlos', 'López', 'carlos.lopez@email.com', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1T8SSRq', TRUE, NOW(), NOW()),
('Ana', 'Martínez', 'ana.martinez@email.com', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1T8SSRq', TRUE, NOW(), NOW()),
('Demo', 'User', 'demo@demo.com', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1T8SSRq', TRUE, NOW(), NOW());

-- =====================================================
-- 3. PRODUCTOS (Amplia variedad)
-- =====================================================
-- Limpiar productos existentes para evitar duplicados
-- IMPORTANTE: Esto permite que el script funcione incluso si se ejecuta manualmente
DELETE FROM products;

-- CATEGORÍA: Ropa (5)
INSERT INTO products (name, description, price, category_id, image, stock, discount, is_active, created_at, updated_at) VALUES
('Camiseta React', 'Camiseta 100% algodón con logo React. Diseño minimalista y cómodo para desarrolladores.', 25.50, 5, 'camiseta-react.png', 45, NULL, TRUE, NOW(), NOW()),
('Hoodie TypeScript', 'Sudadera con capucha azul marino con logo TypeScript bordado. Material suave y resistente.', 45.00, 5, 'hoodie-ts.png', 30, 40.50, TRUE, NOW(), NOW()),
('Sudadera Node.js', 'Sudadera verde con diseño del logo Node.js. Perfecta para el día a día.', 42.00, 5, 'sudadera-node.png', 25, NULL, TRUE, NOW(), NOW()),
('Camiseta Fullstack', 'Camiseta con diseño "Fullstack Developer". Ideal para mostrar tu pasión por el código.', 28.00, 5, 'camiseta-fullstack.png', 50, 24.00, TRUE, NOW(), NOW()),
('Chaqueta Bomber Tech', 'Chaqueta bomber con estilo tech. Resistente al agua y muy cómoda.', 85.00, 5, 'chaquetaBomber_sin_fondo.png', 15, NULL, TRUE, NOW(), NOW()),
('Pantalón Cargo Urbano', 'Pantalón cargo con múltiples bolsillos. Estilo urbano y funcional.', 55.00, 5, 'PantalonCargo_sin_fondo.png', 20, 49.00, TRUE, NOW(), NOW()),
('Zapatillas Deportivas', 'Zapatillas deportivas urbanas. Cómodas para el día a día.', 75.00, 5, 'ZapatosDeportivosUrbanos_sin_fondo.png', 18, NULL, TRUE, NOW(), NOW()),
('Remera Básica Premium', 'Remera 100% algodón orgánico. Corte moderno y cómodo. Disponible en múltiples colores.', 22.00, 5, 'camiseta-react.png', 50, 19.80, TRUE, NOW(), NOW()),
('Campera Softshell', 'Campera ligera resistente al agua. Ideal para primavera y otoño.', 68.00, 5, 'chaquetaBomber_sin_fondo.png', 25, NULL, TRUE, NOW(), NOW()),
('Jean Slim Fit', 'Pantalón jean corte slim. Tela elástica para mayor comodidad.', 49.90, 5, 'PantalonCargo_sin_fondo.png', 40, 44.90, TRUE, NOW(), NOW()),
('Buzo Canguro Oversize', 'Buzo con capucha y bolsillo canguro. Diseño oversize y cómodo.', 52.00, 5, 'sudadera-node.png', 35, NULL, TRUE, NOW(), NOW()),
('Remera Vintage Wash', 'Remera con efecto vintage y diseño retro. 100% algodón.', 24.50, 5, 'camiseta-fullstack.png', 45, 21.50, TRUE, NOW(), NOW()),
('Chaqueta Parka Ligera', 'Chaqueta parka de estilo urbano. Impermeable y transpirable.', 79.00, 5, 'chaquetaBomber_sin_fondo.png', 20, 71.00, TRUE, NOW(), NOW()),
('Pantalón Chino Classic', 'Pantalón chino corte clásico. Versátil para uso casual y semi-formal.', 43.00, 5, 'PantalonCargo_sin_fondo.png', 30, NULL, TRUE, NOW(), NOW()),
('Buzo Premium Algodón', 'Buzo de algodón premium con diseño minimalista. Calidad superior.', 58.00, 5, 'hoodie-ts.png', 28, 52.00, TRUE, NOW(), NOW()),
('Zapatillas Casual Urbanas', 'Zapatillas urbanas para uso diario. Suela cómoda y diseño moderno.', 65.00, 5, 'zapatillas.png', 38, NULL, TRUE, NOW(), NOW()),
('Camisa Flannel', 'Camisa de franela suave y cálida. Perfecta para el invierno.', 38.00, 5, '43422601_0_1_20220921152310_sin_fondo.png', 32, 34.00, TRUE, NOW(), NOW());

-- CATEGORÍA: Accesorios (1)
INSERT INTO products (name, description, price, category_id, image, stock, discount, is_active, created_at, updated_at) VALUES
('Taza JavaScript', 'Taza de cerámica blanca con logo JavaScript. Capacidad 350ml.', 12.90, 1, 'taza-js.png', 100, NULL, TRUE, NOW(), NOW()),
('Tazas CSS (Set x2)', 'Set de 2 tazas con logos CSS3. Perfectas para tu café matutino.', 18.50, 1, 'tazas-css.png', 50, 16.50, TRUE, NOW(), NOW()),
('Gorra Negra Tech', 'Gorra ajustable con bordado tech. 100% algodón.', 15.00, 1, 'gorra.png', 60, NULL, TRUE, NOW(), NOW()),
('Mochila Resistente 20L', 'Mochila con compartimento para laptop hasta 15". Resistente al agua.', 55.00, 1, 'mochila.png', 35, NULL, TRUE, NOW(), NOW()),
('Pack Stickers Tech', 'Set de 50 stickers con diseños de tecnología. Resistentes al agua.', 8.90, 1, 'stickers.png', 200, 6.90, TRUE, NOW(), NOW()),
('Agenda 2024', 'Agenda con diseño minimalista. 200 páginas.', 18.00, 1, 'agenda.png', 40, NULL, TRUE, NOW(), NOW()),
('Botella Térmica', 'Botella térmica de acero inoxidable. Mantiene temperatura 12h.', 25.00, 1, 'botella.png', 45, NULL, TRUE, NOW(), NOW()),
('Cargador Inalámbrico', 'Cargador inalámbrico de carga rápida. Compatible con todos los dispositivos.', 32.00, 1, 'cargador.png', 30, 28.00, TRUE, NOW(), NOW()),
('Mochila Tactical 25L', 'Mochila táctica con múltiples compartimentos. Ideal para viajes cortos.', 65.00, 1, 'mochila.png', 30, 58.00, TRUE, NOW(), NOW()),
('Set Tazas Premium x4', 'Set de 4 tazas de cerámica de alta calidad. Diseño elegante.', 24.90, 1, 'tazas-css.png', 45, NULL, TRUE, NOW(), NOW()),
('Gorra Snapback Retro', 'Gorra snapback con diseño retro. Ajuste personalizable.', 18.00, 1, 'gorra.png', 55, 16.20, TRUE, NOW(), NOW()),
('Organizador Porta Cables', 'Organizador con múltiples compartimentos para cables y accesorios.', 19.90, 1, '61e4cFFg6XL._AC_SL1001__sin_fondo.png', 60, NULL, TRUE, NOW(), NOW()),
('Pack Stickers Premium', 'Pack de 100 stickers premium con diseños exclusivos.', 12.00, 1, 'stickers.png', 80, 10.80, TRUE, NOW(), NOW()),
('Agenda Ejecutiva 2025', 'Agenda profesional con diseño elegante. Cubierta de cuero sintético.', 28.00, 1, 'agenda.png', 35, NULL, TRUE, NOW(), NOW()),
('Botella Acero 750ml', 'Botella de acero inoxidable de 750ml. Aislante térmico premium.', 32.00, 1, 'botella.png', 40, 28.80, TRUE, NOW(), NOW()),
('Cargador Magsafe', 'Cargador inalámbrico MagSafe compatible con iPhone. Carga rápida.', 45.00, 1, 'cargador.png', 25, NULL, TRUE, NOW(), NOW()),
('Kit Cables Premium', 'Set completo de cables USB-C, Lightning y micro-USB. Longitud 1.5m.', 35.00, 1, 'D_NQ_NP_859818-MLA79523608172_102024-O_sin_fondo.png', 50, 31.50, TRUE, NOW(), NOW()),
('Estuche Protector Laptop', 'Estuche acolchado para laptop hasta 15.6". Resistente y elegante.', 42.00, 1, 'KitHerramientasDigitales_sin_fondo.png', 22, NULL, TRUE, NOW(), NOW());

-- CATEGORÍA: Tecnología (6)
INSERT INTO products (name, description, price, category_id, image, stock, discount, is_active, created_at, updated_at) VALUES
('Monitor 24" Full HD', 'Monitor LED 24 pulgadas Full HD. Frecuencia 75Hz, tiempo de respuesta 5ms.', 250.00, 6, 'monitor.png', 20, 225.00, TRUE, NOW(), NOW()),
('Teclado Mecánico RGB', 'Teclado mecánico con iluminación RGB personalizable. Switches azules.', 89.99, 6, 'teclado.png', 35, NULL, TRUE, NOW(), NOW()),
('Teclado Compacto', 'Teclado compacto 60% ideal para espacios reducidos. Silencioso.', 65.00, 6, 'teclado-compacto.png', 25, 58.00, TRUE, NOW(), NOW()),
('Mouse Gaming Óptico', 'Mouse óptico gaming con 7 botones programables y DPI ajustable hasta 12000.', 45.00, 6, 'mouse.png', 50, NULL, TRUE, NOW(), NOW()),
('Auriculares Bluetooth', 'Auriculares inalámbricos con cancelación activa de ruido. Batería 30h.', 75.00, 6, 'auriculares.png', 40, 65.00, TRUE, NOW(), NOW()),
('Webcam HD 1080p', 'Cámara web Full HD 1080p con micrófono incorporado. Ideal para streaming.', 120.00, 6, 'camara.png', 28, NULL, TRUE, NOW(), NOW()),
('Raspberry Pi 4 Kit', 'Kit completo Raspberry Pi 4 con 4GB RAM. Incluye carcasa y fuente.', 95.00, 6, 'raspberry.png', 15, 86.50, TRUE, NOW(), NOW()),
('Smartwatch Fitness', 'Reloj inteligente con monitor de frecuencia cardíaca y GPS.', 180.00, 6, 'smartwatch.png', 22, NULL, TRUE, NOW(), NOW()),
('Reloj Inteligente Pro', 'Smartwatch premium con pantalla AMOLED y múltiples sensores.', 250.00, 6, 'RelojInteligente_sin_fondo.png', 12, 225.00, TRUE, NOW(), NOW()),
('Router WiFi 6', 'Router de alta velocidad WiFi 6 con cobertura hasta 200m². 4 antenas.', 110.00, 6, 'router.png', 18, NULL, TRUE, NOW(), NOW()),
('Cámara Digital 4K', 'Cámara digital profesional con grabación 4K y estabilización óptica.', 650.00, 6, 'CamaraDigital4k.png', 8, 599.00, TRUE, NOW(), NOW()),
('Portátil Gamer', 'Laptop gaming con RTX 3060, 16GB RAM y SSD 512GB.', 1200.00, 6, 'PortatilGamer_sin_fondo.png', 5, NULL, TRUE, NOW(), NOW()),
('Tablet Pro 12"', 'Tablet profesional con pantalla 12" y lápiz incluido.', 750.00, 6, 'tabltpro_sin_fondo.png', 10, 699.00, TRUE, NOW(), NOW()),
('Kit Herramientas Digitales', 'Set completo de herramientas para reparación de dispositivos.', 45.00, 6, 'KitHerramientasDigitales_sin_fondo.png', 30, NULL, TRUE, NOW(), NOW()),
('Monitor Curvo 27" 144Hz', 'Monitor gaming curvo con alta frecuencia de actualización. Panel VA.', 320.00, 6, 'monitor.png', 15, 288.00, TRUE, NOW(), NOW()),
('Teclado Mecánico 87 teclas', 'Teclado mecánico compacto 87 teclas. Switches marrones silenciosos.', 95.00, 6, 'teclado.png', 30, NULL, TRUE, NOW(), NOW()),
('Teclado Bluetooth Portátil', 'Teclado inalámbrico Bluetooth compacto. Batería recargable.', 55.00, 6, 'teclado-compacto.png', 40, 49.50, TRUE, NOW(), NOW()),
('Mouse Ergonómico Vertical', 'Mouse vertical ergonómico para reducir fatiga. Conexión inalámbrica.', 52.00, 6, 'mouse.png', 35, NULL, TRUE, NOW(), NOW()),
('Auriculares Over-Ear Pro', 'Auriculares over-ear con cancelación de ruido activa. Sonido Hi-Fi.', 195.00, 6, 'auriculares.png', 18, 175.00, TRUE, NOW(), NOW()),
('Webcam 4K Ultra HD', 'Cámara web 4K con seguimiento automático y micrófono estéreo.', 180.00, 6, 'camara.png', 12, NULL, TRUE, NOW(), NOW()),
('Raspberry Pi 4 8GB Kit', 'Kit completo Raspberry Pi 4 con 8GB RAM. Incluye todos los accesorios.', 125.00, 6, 'raspberry.png', 10, 112.00, TRUE, NOW(), NOW()),
('Smartwatch Deportivo', 'Smartwatch con GPS, monitor cardíaco y resistencia al agua 50m.', 220.00, 6, 'smartwatch.png', 20, NULL, TRUE, NOW(), NOW()),
('Reloj Inteligente Premium', 'Smartwatch premium con pantalla AMOLED y batería de larga duración.', 280.00, 6, 'RelojInteligente_sin_fondo.png', 8, 250.00, TRUE, NOW(), NOW()),
('Router Mesh WiFi 6E', 'Sistema Mesh WiFi 6E de alta velocidad. Cobertura hasta 400m².', 195.00, 6, 'router.png', 14, NULL, TRUE, NOW(), NOW()),
('Cámara GoPro Hero', 'Cámara deportiva 4K con estabilización avanzada. Resistente al agua.', 380.00, 6, 'CamaraDigital4k.png', 6, 342.00, TRUE, NOW(), NOW()),
('Laptop Business 14"', 'Laptop profesional con procesador Intel i7 y 16GB RAM. Ideal para trabajo.', 950.00, 6, 'PortatilGamer_sin_fondo.png', 9, NULL, TRUE, NOW(), NOW()),
('Tablet Android Pro', 'Tablet profesional Android con pantalla 11" y lápiz óptico incluido.', 420.00, 6, 'tabltpro_sin_fondo.png', 15, 378.00, TRUE, NOW(), NOW()),
('Kit Herramientas Electrónicas', 'Set profesional de herramientas para reparación de dispositivos móviles.', 65.00, 6, 'KitHerramientasDigitales_sin_fondo.png', 25, NULL, TRUE, NOW(), NOW());

-- CATEGORÍA: Libros (4)
INSERT INTO products (name, description, price, category_id, image, stock, discount, is_active, created_at, updated_at) VALUES
('Libro: Python Avanzado', 'Guía completa de programación avanzada en Python. 500 páginas con ejemplos prácticos.', 50.00, 4, 'libro-python.png', 30, 47.50, TRUE, NOW(), NOW()),
('Guía: Algoritmos y Estructuras', 'Manual completo de algoritmos con implementaciones en múltiples lenguajes.', 55.00, 4, 'GuiaAlgoritmos.png', 25, NULL, TRUE, NOW(), NOW()),
('Libro: Machine Learning', 'Introducción al aprendizaje automático con casos prácticos.', 65.00, 4, 'GuiaMachineLearning_sin_fondo.png', 20, 58.00, TRUE, NOW(), NOW()),
('Manual: Seguridad Cibernética', 'Guía práctica de ciberseguridad para desarrolladores.', 48.00, 4, 'ManualSeguridadCibernetica.png', 22, NULL, TRUE, NOW(), NOW()),
('Python: De Cero a Experto', 'Libro completo de Python desde básico hasta avanzado. 600 páginas.', 55.00, 4, 'libro-python.png', 28, 49.50, TRUE, NOW(), NOW()),
('Algoritmos y Estructuras de Datos', 'Manual completo con implementaciones en Python, Java y C++.', 62.00, 4, 'GuiaAlgoritmos.png', 22, NULL, TRUE, NOW(), NOW()),
('Machine Learning con TensorFlow', 'Guía práctica de machine learning usando TensorFlow y Python.', 72.00, 4, 'GuiaMachineLearning_sin_fondo.png', 18, 64.80, TRUE, NOW(), NOW()),
('Ciberseguridad para Desarrolladores', 'Manual de seguridad web y protección de aplicaciones.', 52.00, 4, 'ManualSeguridadCibernetica.png', 25, NULL, TRUE, NOW(), NOW()),
('JavaScript Moderno ES6+', 'Guía completa de JavaScript moderno con todas las nuevas características.', 48.00, 4, 'libro-python.png', 30, 43.20, TRUE, NOW(), NOW()),
('React Avanzado: Patrones y Prácticas', 'Libro sobre patrones avanzados en React y mejores prácticas.', 58.00, 4, 'GuiaAlgoritmos.png', 20, NULL, TRUE, NOW(), NOW()),
('Base de Datos: SQL y NoSQL', 'Manual completo sobre bases de datos relacionales y no relacionales.', 54.00, 4, 'GuiaMachineLearning_sin_fondo.png', 24, 48.60, TRUE, NOW(), NOW()),
('Arquitectura de Software', 'Guía sobre diseño de arquitecturas escalables y mantenibles.', 68.00, 4, 'ManualSeguridadCibernetica.png', 16, NULL, TRUE, NOW(), NOW()),
('DevOps: CI/CD y Docker', 'Manual práctico de DevOps con Docker, Kubernetes y pipelines.', 59.00, 4, 'libro-python.png', 21, 53.10, TRUE, NOW(), NOW()),
('Clean Code en Español', 'Traducción del clásico libro sobre escribir código limpio y mantenible.', 45.00, 4, 'GuiaAlgoritmos.png', 35, NULL, TRUE, NOW(), NOW());

-- CATEGORÍA: Hogar (3)
INSERT INTO products (name, description, price, category_id, image, stock, discount, is_active, created_at, updated_at) VALUES
('Lámpara LED Escritorio', 'Lámpara LED regulable con puerto USB. Luz cálida y fría ajustable.', 35.00, 3, 'lampara.png', 40, NULL, TRUE, NOW(), NOW()),
('Silla Ergonómica Office', 'Silla de oficina ergonómica con soporte lumbar. Altura ajustable.', 180.00, 3, 'silla.png', 15, 165.00, TRUE, NOW(), NOW()),
('Mesa Escritorio Gaming', 'Mesa de escritorio con gestión de cables y soporte para monitor.', 220.00, 3, 'mesa.png', 12, NULL, TRUE, NOW(), NOW()),
('Alfombra Antideslizante', 'Alfombra de escritorio XL. Superficie lisa para mouse gaming.', 45.00, 3, 'alfombra.png', 35, 39.00, TRUE, NOW(), NOW()),
('Cama Queen Size', 'Cama queen con cabecero moderno. Estructura de madera resistente.', 450.00, 3, 'cama_sin_fondo.png', 8, NULL, TRUE, NOW(), NOW()),
('Sillón 3 Plazas', 'Sofá de 3 plazas con tapizado de alta calidad y diseño moderno.', 680.00, 3, 'sillon3plazas_sin_fondo.png', 6, 599.00, TRUE, NOW(), NOW()),
('Lámpara de Pared LED', 'Lámpara de pared moderna con luz LED regulable.', 55.00, 3, 'LamparaPared_sin_fondo.png', 20, NULL, TRUE, NOW(), NOW()),
('Estantería Modular', 'Sistema de estanterías modulares de 5 niveles.', 120.00, 3, 'EstanteriaModular_sin_fondo.png', 14, 108.00, TRUE, NOW(), NOW()),
('Cafetera Automática', 'Cafetera programable con molinillo integrado.', 180.00, 3, 'cafetera.png', 18, NULL, TRUE, NOW(), NOW()),
('Lámpara LED Escritorio Pro', 'Lámpara LED con tecnología Eye-Care. Regulación de brillo y temperatura.', 42.00, 3, 'lampara.png', 35, 37.80, TRUE, NOW(), NOW()),
('Silla Ergonómica Executive', 'Silla ejecutiva con soporte lumbar y reposabrazos ajustables.', 245.00, 3, 'silla.png', 12, NULL, TRUE, NOW(), NOW()),
('Mesa Escritorio Ergonómica', 'Mesa de escritorio con altura ajustable eléctrica. 160x80cm.', 380.00, 3, 'mesa.png', 8, 342.00, TRUE, NOW(), NOW()),
('Alfombra Gaming XL', 'Alfombra gaming extra grande. Superficie suave y fácil de limpiar.', 55.00, 3, 'alfombra.png', 28, NULL, TRUE, NOW(), NOW()),
('Cama King Size Premium', 'Cama king con somier y cabecero tapizado. Estilo moderno.', 520.00, 3, 'cama_sin_fondo.png', 5, 468.00, TRUE, NOW(), NOW()),
('Sofá Esquinero Moderno', 'Sofá esquinero con chaise longue. Tapizado de alta calidad.', 720.00, 3, 'sillon3plazas_sin_fondo.png', 4, NULL, TRUE, NOW(), NOW()),
('Lámpara de Pared Moderna', 'Lámpara de pared con diseño minimalista. Luz LED regulable.', 68.00, 3, 'LamparaPared_sin_fondo.png', 18, 61.20, TRUE, NOW(), NOW()),
('Estantería Librería 6 Niveles', 'Estantería de 6 niveles para libros y decoración. Madera natural.', 145.00, 3, 'EstanteriaModular_sin_fondo.png', 11, NULL, TRUE, NOW(), NOW()),
('Cafetera Espresso Automática', 'Cafetera espresso automática con espumador de leche integrado.', 225.00, 3, 'cafetera.png', 15, 202.50, TRUE, NOW(), NOW()),
('Organizador de Escritorio', 'Set organizador con múltiples cajones para documentos y útiles.', 38.00, 3, '61e4cFFg6XL._AC_SL1001__sin_fondo.png', 32, NULL, TRUE, NOW(), NOW());

-- CATEGORÍA: Decoración (2)
INSERT INTO products (name, description, price, category_id, image, stock, discount, is_active, created_at, updated_at) VALUES
('Cuadro Decorativo Tech', 'Cuadro con diseño minimalista tech. Marco de aluminio.', 28.00, 2, 'cuadro.png', 45, NULL, TRUE, NOW(), NOW()),
('Set Posters Vintage', 'Set de 3 posters vintage de videojuegos clásicos.', 22.00, 2, 'posters.png', 60, 19.00, TRUE, NOW(), NOW()),
('Cuadro Minimalista', 'Cuadro abstracto minimalista. 60x40cm.', 45.00, 2, 'CuadroMinimalista_sin_fondo.png', 25, NULL, TRUE, NOW(), NOW()),
('Escultura Moderna', 'Escultura decorativa moderna de resina.', 75.00, 2, 'Esculturamoderna_sin_fondo.png', 15, 68.00, TRUE, NOW(), NOW()),
('Cuadro Arte Digital', 'Cuadro con arte digital impreso en alta calidad. Marco de aluminio.', 35.00, 2, 'cuadro.png', 40, 31.50, TRUE, NOW(), NOW()),
('Set Posters Gaming x5', 'Set de 5 posters de videojuegos clásicos. Tamaño A3 cada uno.', 28.00, 2, 'posters.png', 50, NULL, TRUE, NOW(), NOW()),
('Cuadro Minimalista Grande', 'Cuadro abstracto minimalista tamaño 80x60cm. Marco dorado.', 65.00, 2, 'CuadroMinimalista_sin_fondo.png', 20, 58.50, TRUE, NOW(), NOW()),
('Escultura Metal Moderna', 'Escultura decorativa de metal con acabado satinado. Altura 40cm.', 95.00, 2, 'Esculturamoderna_sin_fondo.png', 12, NULL, TRUE, NOW(), NOW()),
('Cuadro Código Binario', 'Cuadro con diseño de código binario. Perfecto para desarrolladores.', 32.00, 2, 'cuadro.png', 38, 28.80, TRUE, NOW(), NOW()),
('Poster Vintage Retrotech', 'Poster vintage con diseño retro de tecnología. Impresión premium.', 18.00, 2, 'posters.png', 45, NULL, TRUE, NOW(), NOW()),
('Arte Abstracto Moderno', 'Cuadro con arte abstracto moderno. Colores vibrantes y diseño único.', 48.00, 2, 'CuadroMinimalista_sin_fondo.png', 28, 43.20, TRUE, NOW(), NOW()),
('Escultura Minimalista', 'Escultura decorativa minimalista de resina. Diseño elegante y moderno.', 58.00, 2, 'Esculturamoderna_sin_fondo.png', 15, NULL, TRUE, NOW(), NOW()),
('Set Cuadros 3 en 1', 'Set de 3 cuadros complementarios. Ideal para decorar espacios amplios.', 85.00, 2, 'cuadro.png', 22, 76.50, TRUE, NOW(), NOW()),
('Poster Mapa del Mundo', 'Poster decorativo con mapa del mundo vintage. Tamaño grande 90x60cm.', 42.00, 2, 'posters.png', 30, NULL, TRUE, NOW(), NOW());

-- =====================================================
-- 4. DIRECCIONES DE FACTURACIÓN (Para usuarios de prueba)
-- =====================================================
INSERT INTO billing_addresses (user_id, order_id, first_name, last_name, dni, address, city, postal_code, is_default, created_at, updated_at) VALUES
(2, NULL, 'Juan', 'Pérez', '12345678A', 'Calle Principal 123', 'Madrid', '28001', TRUE, NOW(), NOW()),
(3, NULL, 'María', 'García', '87654321B', 'Avenida Libertad 456', 'Barcelona', '08001', TRUE, NOW(), NOW()),
(4, NULL, 'Carlos', 'López', '11223344C', 'Plaza Mayor 789', 'Valencia', '46001', TRUE, NOW(), NOW()),
(5, NULL, 'Ana', 'Martínez', '55667788D', 'Calle Luna 321', 'Sevilla', '41001', TRUE, NOW(), NOW());

-- =====================================================
-- 5. DIRECCIONES DE ENVÍO (Para usuarios de prueba)
-- =====================================================
INSERT INTO shipping_addresses (user_id, order_id, first_name, last_name, address, city, postal_code, is_default, created_at, updated_at) VALUES
(2, NULL, 'Juan', 'Pérez', 'Calle Principal 123', 'Madrid', '28001', TRUE, NOW(), NOW()),
(3, NULL, 'María', 'García', 'Avenida Libertad 456', 'Barcelona', '08001', TRUE, NOW(), NOW()),
(4, NULL, 'Carlos', 'López', 'Plaza Mayor 789', 'Valencia', '46001', TRUE, NOW(), NOW()),
(5, NULL, 'Ana', 'Martínez', 'Calle Luna 321', 'Sevilla', '41001', TRUE, NOW(), NOW());

-- =====================================================
-- 6. ÓRDENES DE PRUEBA
-- =====================================================
INSERT INTO orders (user_id, order_number, status, total_amount, created_at, updated_at) VALUES
(2, 'ORD-2024-001', 'delivered', 145.40, DATE_SUB(NOW(), INTERVAL 15 DAY), DATE_SUB(NOW(), INTERVAL 10 DAY)),
(3, 'ORD-2024-002', 'shipped', 389.50, DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY)),
(4, 'ORD-2024-003', 'processing', 225.00, DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY)),
(5, 'ORD-2024-004', 'pending', 95.00, NOW(), NOW());

-- =====================================================
-- 7. ITEMS DE ÓRDENES
-- =====================================================
-- Orden 1 (Juan - Entregada)
INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price, created_at) VALUES
(1, 1, 2, 25.50, 51.00, DATE_SUB(NOW(), INTERVAL 15 DAY)),  -- 2 Camisetas React
(1, 9, 1, 12.90, 12.90, DATE_SUB(NOW(), INTERVAL 15 DAY)),   -- 1 Taza JavaScript
(1, 20, 1, 89.99, 89.99, DATE_SUB(NOW(), INTERVAL 15 DAY));  -- 1 Teclado Mecánico

-- Orden 2 (María - Enviada)
INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price, created_at) VALUES
(2, 19, 1, 225.00, 225.00, DATE_SUB(NOW(), INTERVAL 7 DAY)),  -- 1 Monitor
(2, 25, 1, 75.00, 75.00, DATE_SUB(NOW(), INTERVAL 7 DAY)),    -- 1 Auriculares
(2, 23, 1, 45.00, 45.00, DATE_SUB(NOW(), INTERVAL 7 DAY));    -- 1 Mouse

-- Orden 3 (Carlos - En proceso)
INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price, created_at) VALUES
(3, 36, 1, 180.00, 180.00, DATE_SUB(NOW(), INTERVAL 2 DAY)),  -- 1 Silla Ergonómica
(4, 10, 5, 8.90, 44.50, NOW());                                -- 5 Packs de Stickers

-- Orden 4 (Ana - Pendiente)
INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price, created_at) VALUES
(4, 27, 1, 95.00, 95.00, NOW());  -- 1 Raspberry Pi

-- =====================================================
-- 8. SESIONES DE CARRITO ACTIVAS
-- =====================================================
INSERT INTO cart_sessions (id, user_id, created_at, updated_at) VALUES
('cart-anonymous-001', NULL, NOW(), NOW()),
('cart-user-2', 2, NOW(), NOW()),
('cart-user-6', 6, NOW(), NOW());

-- =====================================================
-- 9. ITEMS EN CARRITOS ACTIVOS
-- =====================================================
-- Carrito anónimo
INSERT INTO cart_items (cart_session_id, product_id, quantity, created_at, updated_at) VALUES
('cart-anonymous-001', 2, 1, NOW(), NOW()),   -- Hoodie TypeScript
('cart-anonymous-001', 20, 1, NOW(), NOW());  -- Teclado Mecánico

-- Carrito Juan
INSERT INTO cart_items (cart_session_id, product_id, quantity, created_at, updated_at) VALUES
('cart-user-2', 19, 1, NOW(), NOW()),  -- Monitor
('cart-user-2', 23, 1, NOW(), NOW()),  -- Mouse
('cart-user-2', 25, 1, NOW(), NOW());  -- Auriculares

-- Carrito Demo
INSERT INTO cart_items (cart_session_id, product_id, quantity, created_at, updated_at) VALUES
('cart-user-6', 1, 2, NOW(), NOW()),   -- 2 Camisetas React
('cart-user-6', 9, 1, NOW(), NOW());   -- Taza JavaScript

-- Rehabilitar foreign keys
SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================
-- VERIFICACIONES
-- =====================================================
SELECT '=== RESUMEN DE DATOS INSERTADOS ===' as '';

SELECT 'Categorías' as Tabla, COUNT(*) as Total FROM categories;
SELECT 'Usuarios' as Tabla, COUNT(*) as Total FROM users;
SELECT 'Productos' as Tabla, COUNT(*) as Total FROM products;
SELECT 'Productos Activos' as Tabla, COUNT(*) as Total FROM products WHERE is_active = TRUE;
SELECT 'Productos con Descuento' as Tabla, COUNT(*) as Total FROM products WHERE discount IS NOT NULL;
SELECT 'Direcciones Facturación' as Tabla, COUNT(*) as Total FROM billing_addresses;
SELECT 'Direcciones Envío' as Tabla, COUNT(*) as Total FROM shipping_addresses;
SELECT 'Órdenes' as Tabla, COUNT(*) as Total FROM orders;
SELECT 'Items en Órdenes' as Tabla, COUNT(*) as Total FROM order_items;
SELECT 'Sesiones Carrito' as Tabla, COUNT(*) as Total FROM cart_sessions;
SELECT 'Items en Carritos' as Tabla, COUNT(*) as Total FROM cart_items;

SELECT '=== PRODUCTOS POR CATEGORIA ===' as info;
SELECT c.name as Categoria, COUNT(p.id) as Total_Productos
FROM categories c
LEFT JOIN products p ON c.id = p.category_id AND p.is_active = TRUE
GROUP BY c.id, c.name
ORDER BY COUNT(p.id) DESC;

SELECT '=== ULTIMOS 10 PRODUCTOS ===' as info;
SELECT p.id, p.name, c.name as categoria, p.price, p.discount, p.stock
FROM products p
JOIN categories c ON p.category_id = c.id
WHERE p.is_active = TRUE
ORDER BY p.id DESC
LIMIT 10;

SELECT '=== ORDENES RECIENTES ===' as info;
SELECT o.order_number, u.name as usuario, o.status, o.total_amount, o.created_at
FROM orders o
JOIN users u ON o.user_id = u.id
ORDER BY o.created_at DESC;

SELECT 'Base de datos poblada exitosamente!' as Resultado;


