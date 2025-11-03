-- =====================================================
-- SCRIPT PARA AGREGAR PRODUCTOS ADICIONALES
-- Agrega aproximadamente 10 productos más por categoría
-- Sin crear nuevas categorías
-- =====================================================

USE ecommerce_db;

-- =====================================================
-- CATEGORÍA: Ropa (category_id = 5)
-- =====================================================
INSERT INTO products (name, description, price, category_id, image, stock, discount, is_active, created_at, updated_at) VALUES
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

-- =====================================================
-- CATEGORÍA: Accesorios (category_id = 1)
-- =====================================================
INSERT INTO products (name, description, price, category_id, image, stock, discount, is_active, created_at, updated_at) VALUES
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

-- =====================================================
-- CATEGORÍA: Tecnología (category_id = 6)
-- =====================================================
INSERT INTO products (name, description, price, category_id, image, stock, discount, is_active, created_at, updated_at) VALUES
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

-- =====================================================
-- CATEGORÍA: Libros (category_id = 4)
-- =====================================================
INSERT INTO products (name, description, price, category_id, image, stock, discount, is_active, created_at, updated_at) VALUES
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

-- =====================================================
-- CATEGORÍA: Hogar (category_id = 3)
-- =====================================================
INSERT INTO products (name, description, price, category_id, image, stock, discount, is_active, created_at, updated_at) VALUES
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

-- =====================================================
-- CATEGORÍA: Decoración (category_id = 2)
-- =====================================================
INSERT INTO products (name, description, price, category_id, image, stock, discount, is_active, created_at, updated_at) VALUES
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
-- VERIFICACIÓN
-- =====================================================
SELECT '=== PRODUCTOS AGREGADOS EXITOSAMENTE ===' as resultado;

SELECT 'Resumen por categoria' as info;
SELECT 
    c.name as categoria,
    COUNT(p.id) as total_productos,
    SUM(CASE WHEN p.is_active = TRUE THEN 1 ELSE 0 END) as productos_activos
FROM categories c
LEFT JOIN products p ON c.id = p.category_id
GROUP BY c.id, c.name
ORDER BY c.name;

SELECT 'Ultimos 10 productos agregados' as info;
SELECT 
    p.id,
    p.name,
    c.name as categoria,
    p.price,
    p.stock,
    p.is_active
FROM products p
JOIN categories c ON p.category_id = c.id
ORDER BY p.id DESC
LIMIT 10;

