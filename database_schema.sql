CREATE DATABASE IF NOT EXISTS ecommerce_db;
USE ecommerce_db;

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    surname VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_name (name, surname),
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name),
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    category_id BIGINT NOT NULL,
    image VARCHAR(500) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    discount DECIMAL(10,2) NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
    INDEX idx_name (name),
    INDEX idx_category (category_id),
    INDEX idx_price (price),
    INDEX idx_stock (stock),
    INDEX idx_active (is_active),
    INDEX idx_category_active (category_id, is_active),
    INDEX idx_price_active (price, is_active),
    FULLTEXT idx_search (name, description)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE cart_sessions (
    id CHAR(36) PRIMARY KEY,
    user_id BIGINT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE cart_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cart_session_id CHAR(36) NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (cart_session_id) REFERENCES cart_sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_cart_product (cart_session_id, product_id),
    INDEX idx_cart (cart_session_id),
    INDEX idx_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    total_amount DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    shipping_cost DECIMAL(10,2) DEFAULT 0,
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_user (user_id),
    INDEX idx_order_number (order_number),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_user_created (user_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
    INDEX idx_order (order_id),
    INDEX idx_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE addresses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    address_type ENUM('billing', 'shipping', 'both') NOT NULL DEFAULT 'both',
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    dni VARCHAR(20) NULL,
    address_line1 VARCHAR(200) NOT NULL,
    address_line2 VARCHAR(200) NULL,
    city VARCHAR(100) NOT NULL,
    state_province VARCHAR(100) NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) DEFAULT 'Argentina',
    phone VARCHAR(20) NULL,
    is_default BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_user_type (user_id, address_type),
    INDEX idx_default (user_id, is_default)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE order_addresses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    address_type ENUM('billing', 'shipping') NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    dni VARCHAR(20) NULL,
    address_line1 VARCHAR(200) NOT NULL,
    address_line2 VARCHAR(200) NULL,
    city VARCHAR(100) NOT NULL,
    state_province VARCHAR(100) NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) DEFAULT 'Argentina',
    phone VARCHAR(20) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    INDEX idx_order (order_id),
    INDEX idx_order_type (order_id, address_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE payment_info (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    payment_method ENUM('credit_card', 'debit_card', 'transfer', 'cash') DEFAULT 'credit_card',
    card_last_four CHAR(4) NULL,
    card_brand VARCHAR(50) NULL,
    cardholder_name VARCHAR(100) NULL,
    payment_status ENUM('pending', 'authorized', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    transaction_id VARCHAR(255) NULL,
    payment_gateway VARCHAR(50) NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_date TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    INDEX idx_order (order_id),
    INDEX idx_status (payment_status),
    INDEX idx_transaction (transaction_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE order_status_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') NOT NULL,
    notes TEXT NULL,
    changed_by BIGINT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (changed_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_order (order_id),
    INDEX idx_status (status),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO categories (id, name, description) VALUES
(1, 'Accesorios', 'Accesorios y complementos varios'),
(2, 'Decoración', 'Artículos decorativos para el hogar'),
(3, 'Hogar', 'Productos para el hogar y muebles'),
(4, 'Libros', 'Libros y material educativo'),
(5, 'Ropa', 'Ropa y textiles'),
(6, 'Tecnología', 'Productos tecnológicos y electrónicos');

INSERT INTO users (name, surname, email, password) VALUES
('Demo', 'User', 'demo@demo.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy');

INSERT INTO products (id, name, description, price, category_id, image, stock, discount) VALUES
(1, 'Camiseta React', 'Camiseta cómoda con logo React', 25.50, 5, '/images/camiseta-react.png', 10, NULL),
(2, 'Taza Javascript', 'Taza blanca con logo JS', 12.90, 1, '/images/taza-js.png', 10, NULL),
(3, 'Hoodie TypeScript', 'Buzo azul con logo TS', 45.00, 5, '/images/hoodie-ts.png', 10, NULL),
(4, 'Mouse Inalámbrico', 'Mouse ergonómico con conexión Bluetooth', 19.99, 6, '/images/mouse.png', 10, NULL),
(5, 'Teclado Mecánico', 'Teclado retroiluminado con switches azules', 79.50, 6, '/images/teclado.png', 10, NULL),
(6, 'Auriculares Bluetooth', 'Auriculares con cancelación de ruido', 120.00, 6, '/images/auriculares.png', 10, NULL),
(7, 'Botella Térmica', 'Botella de acero inoxidable 500ml', 18.00, 1, '/images/botella.png', 10, NULL),
(8, 'Mochila Urbana', 'Mochila resistente al agua con compartimento para notebook', 65.00, 1, '/images/mochila.png', 10, NULL),
(9, 'Lámpara de Escritorio LED', 'Lámpara ajustable con control táctil', 30.00, 3, '/images/lampara.png', 10, NULL),
(10, 'Silla Gamer', 'Silla ergonómica reclinable', 210.00, 3, '/images/silla.png', 10, NULL),
(11, 'Sudadera Node.js', 'Sudadera verde con logo Node.js', 40.00, 5, '/images/sudadera-node.png', 10, NULL),
(12, 'Zapatillas Running', 'Zapatillas deportivas transpirables', 75.00, 5, '/images/zapatillas.png', 10, NULL),
(13, 'Smartwatch', 'Reloj inteligente con monitoreo de salud', 150.00, 6, '/images/smartwatch.png', 10, NULL),
(14, 'Alfombra Decorativa', 'Alfombra suave 120x180cm', 55.00, 3, '/images/alfombra.png', 10, NULL),
(15, 'Cafetera Italiana', 'Cafetera de aluminio para 6 tazas', 35.00, 3, '/images/cafetera.png', 10, NULL),
(16, 'Gorra Dev', 'Gorra negra con bordado Code Life', 20.00, 1, '/images/gorra.png', 10, NULL),
(17, 'Monitor 27 4K', 'Monitor UHD con panel IPS', 320.00, 6, '/images/monitor.png', 10, NULL),
(18, 'Teclado Compacto', 'Teclado 60% mecánico RGB', 65.00, 6, '/images/teclado-compacto.png', 10, NULL),
(19, 'Camiseta Full Stack', 'Camiseta blanca con tipografía geek', 22.00, 5, '/images/camiseta-fullstack.png', 10, NULL),
(20, 'Set de Tazas CSS', 'Set de 3 tazas con diseño CSS3', 29.00, 1, '/images/tazas-css.png', 10, NULL),
(21, 'Libro Python Avanzado', 'Guía completa de programación avanzada en Python', 50.00, 4, '/images/libro-python.png', 10, 47.50),
(22, 'Placa Raspberry Pi 4', 'Mini computadora ideal para proyectos IoT', 95.00, 6, '/images/raspberry.png', 10, 86.50),
(23, 'Cámara Web Full HD', 'Cámara con micrófono integrado para streaming', 60.00, 6, '/images/camara.png', 10, 55.00),
(24, 'Agenda de Programador', 'Agenda 2025 con espacio para notas técnicas', 15.00, 1, '/images/agenda.png', 10, 14.25),
(25, 'Poster Retro Gaming', 'Poster decorativo con diseño de consolas clásicas', 20.00, 2, '/images/posters.png', 10, 18.50),
(26, 'Cargador Inalámbrico', 'Base de carga rápida Qi para smartphones', 40.00, 6, '/images/cargador.png', 10, 37.00),
(27, 'Cuadro Código Binario', 'Cuadro minimalista con arte en binario', 28.00, 2, '/images/cuadro.png', 10, 26.00),
(28, 'Router WiFi 6', 'Router de alto rendimiento con WiFi 6', 130.00, 6, '/images/router.png', 10, 120.00),
(29, 'Pack Stickers Geek', 'Set de 50 stickers de programación y tecnología', 10.00, 1, '/images/stickers.png', 10, 9.20),
(30, 'Mesa Ajustable Notebook', 'Mesa portátil regulable para laptop', 70.00, 3, '/images/mesa.png', 10, 64.50),
(31, 'Cámara Digital 4K', 'Cámara compacta con grabación 4K y estabilización óptica', 450.00, 6, '/images/CamaraDigital4k.png', 8, 425.00),
(32, 'Pantalón Cargo Tech', 'Pantalón cargo con múltiples bolsillos para gadgets', 55.00, 5, '/images/PantalonCargo_sin_fondo.png', 15, NULL),
(33, 'Estantería Modular', 'Estantería de madera con módulos intercambiables', 85.00, 3, '/images/EstanteriaModular_sin_fondo.png', 6, 78.00),
(34, 'Reloj Inteligente Fitness', 'Smartwatch con GPS y monitoreo de actividad física', 180.00, 6, '/images/RelojInteligente_sin_fondo.png', 12, NULL),
(35, 'Bufanda de Lana Premium', 'Bufanda tejida a mano con lana 100% natural', 35.00, 5, '/images/43422601_0_1_20220921152310_sin_fondo.png', 20, NULL),
(36, 'Kit de Herramientas Digitales', 'Set completo de herramientas para desarrolladores', 25.00, 1, '/images/KitHerramientasDigitales_sin_fondo.png', 25, NULL),
(37, 'Libro de Algoritmos', 'Guía completa de algoritmos y estructuras de datos', 65.00, 4, '/images/GuiaAlgoritmos.png', 10, 58.00),
(38, 'Lámpara de Pared LED', 'Lámpara de pared con luz regulable y sensor de movimiento', 45.00, 3, '/images/lampara.png', 18, NULL),
(39, 'Portátil Gaming 15.6', 'Laptop gaming con RTX 4060 y pantalla 144Hz', 1200.00, 6, '/images/PortatilGamer_sin_fondo.png', 5, 1100.00),
(40, 'Chaqueta Bomber Tech', 'Chaqueta bomber con forro térmico y bolsillos internos', 75.00, 5, '/images/chaquetaBomber_sin_fondo.png', 8, NULL),
(41, 'Organizador de Escritorio', 'Organizador modular con compartimentos para cables y accesorios', 32.00, 1, '/images/61e4cFFg6XL._AC_SL1001__sin_fondo.png', 22, NULL),
(42, 'Cuadro Minimalista Abstracto', 'Cuadro moderno con diseño abstracto en tonos neutros', 45.00, 2, '/images/CuadroMinimalista_sin_fondo.png', 14, NULL),
(43, 'Manual de Seguridad Cibernética', 'Guía práctica para proteger sistemas y datos', 42.00, 4, '/images/ManualSeguridadCibernetica.png', 16, NULL),
(44, 'Sofá Modular 3 Plazas', 'Sofá modular con chaise longue y tapizado premium', 650.00, 3, '/images/sillon3plazas_sin_fondo.png', 3, 580.00),
(45, 'Tablet Pro 12.9', 'Tablet profesional con lápiz óptico incluido', 800.00, 6, '/images/tabltpro_sin_fondo.png', 7, NULL),
(46, 'Zapatos Deportivos Urbanos', 'Zapatillas con tecnología de amortiguación avanzada', 95.00, 5, '/images/ZapatosDeportivosUrbanos_sin_fondo.png', 12, 85.00),
(47, 'Set de Cables Premium', 'Kit completo de cables USB-C, HDMI y Lightning', 28.00, 1, '/images/D_NQ_NP_859818-MLA79523608172_102024-O_sin_fondo.png', 30, NULL),
(48, 'Escultura Moderna', 'Escultura de metal con acabado satinado', 120.00, 2, '/images/Esculturamoderna_sin_fondo.png', 4, NULL),
(49, 'Guía de Machine Learning', 'Introducción práctica al machine learning con Python', 55.00, 4, '/images/GuiaMachineLearning_sin_fondo.png', 18, NULL),
(50, 'Cama King Size', 'Cama king size con cabecero tapizado y somier', 480.00, 3, '/images/cama_sin_fondo.png', 2, 430.00);

DELIMITER //

CREATE PROCEDURE sp_clean_expired_carts()
BEGIN
    DELETE FROM cart_sessions WHERE expires_at IS NOT NULL AND expires_at < NOW();
    SELECT ROW_COUNT() as carts_deleted, NOW() as cleaned_at;
END //

CREATE PROCEDURE sp_update_product_stock(IN p_product_id BIGINT, IN p_quantity INT, IN p_operation VARCHAR(10))
BEGIN
    DECLARE v_current_stock INT;
    DECLARE v_new_stock INT;
    SELECT stock INTO v_current_stock FROM products WHERE id = p_product_id FOR UPDATE;
    IF p_operation = 'subtract' THEN
        SET v_new_stock = v_current_stock - p_quantity;
    ELSE
        SET v_new_stock = v_current_stock + p_quantity;
    END IF;
    IF v_new_stock < 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Stock insuficiente';
    END IF;
    UPDATE products SET stock = v_new_stock, updated_at = NOW() WHERE id = p_product_id;
    SELECT p_product_id as product_id, v_current_stock as old_stock, v_new_stock as new_stock;
END //

CREATE TRIGGER trg_set_default_address BEFORE INSERT ON addresses
FOR EACH ROW
BEGIN
    IF NEW.is_default = TRUE THEN
        UPDATE addresses SET is_default = FALSE WHERE user_id = NEW.user_id AND address_type = NEW.address_type;
    END IF;
END //

CREATE TRIGGER trg_set_cart_expiration BEFORE INSERT ON cart_sessions
FOR EACH ROW
BEGIN
    IF NEW.expires_at IS NULL THEN
        SET NEW.expires_at = DATE_ADD(NOW(), INTERVAL 7 DAY);
    END IF;
END //

DELIMITER ;