-- =====================================================
-- MODELO DE BASE DE DATOS PARA E-COMMERCE
-- Basado en funcionalidades implementadas del frontend
-- =====================================================

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS ecommerce_db;
USE ecommerce_db;

-- =====================================================
-- TABLA: USERS (Usuarios)
-- =====================================================
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
    INDEX idx_name (name, surname)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLA: CATEGORIES (Categorías de productos)
-- =====================================================
CREATE TABLE categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLA: PRODUCTS (Productos)
-- =====================================================
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
    FULLTEXT idx_search (name, description)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLA: CART_SESSIONS (Sesiones de carrito)
-- =====================================================
CREATE TABLE cart_sessions (
    id VARCHAR(255) PRIMARY KEY, -- Session ID o User ID
    user_id BIGINT NULL, -- NULL para usuarios no logueados
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLA: CART_ITEMS (Items del carrito)
-- =====================================================
CREATE TABLE cart_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cart_session_id VARCHAR(255) NOT NULL,
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

-- =====================================================
-- TABLA: ORDERS (Pedidos)
-- =====================================================
CREATE TABLE orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    total_amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_user (user_id),
    INDEX idx_order_number (order_number),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLA: ORDER_ITEMS (Items de pedidos)
-- =====================================================
CREATE TABLE order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
    INDEX idx_order (order_id),
    INDEX idx_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLA: BILLING_ADDRESSES (Direcciones de facturación)
-- =====================================================
CREATE TABLE billing_addresses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    order_id BIGINT NULL, -- NULL para direcciones guardadas del usuario
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    dni VARCHAR(20) NOT NULL,
    address VARCHAR(200) NOT NULL,
    city VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_order (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLA: SHIPPING_ADDRESSES (Direcciones de envío)
-- =====================================================
CREATE TABLE shipping_addresses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    order_id BIGINT NULL, -- NULL para direcciones guardadas del usuario
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    address VARCHAR(200) NOT NULL,
    city VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_order (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLA: PAYMENT_INFO (Información de pago)
-- =====================================================
CREATE TABLE payment_info (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    card_number_encrypted VARCHAR(255) NOT NULL, -- Número de tarjeta encriptado
    expiry_date VARCHAR(10) NOT NULL, -- MM/AA
    cvv_encrypted VARCHAR(255) NOT NULL, -- CVV encriptado
    cardholder_name VARCHAR(100) NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'credit_card',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    INDEX idx_order (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- INSERTAR DATOS INICIALES
-- =====================================================

-- Insertar categorías
INSERT INTO categories (name, description) VALUES
('Accesorios', 'Accesorios y complementos varios'),
('Decoración', 'Artículos decorativos para el hogar'),
('Hogar', 'Productos para el hogar y muebles'),
('Libros', 'Libros y material educativo'),
('Ropa', 'Ropa y textiles'),
('Tecnología', 'Productos tecnológicos y electrónicos');

-- Insertar usuario demo
INSERT INTO users (name, surname, email, password) VALUES
('Demo', 'User', 'demo@demo.com', '$2a$10$demo.hash.for.testing.purposes.only');

-- Insertar algunos productos de ejemplo (basados en productos.json)
INSERT INTO products (name, description, price, category_id, image, stock, discount) VALUES
('Camiseta React', 'Camiseta cómoda con logo React', 25.50, 5, '/images/camiseta-react.png', 10, NULL),
('Taza Javascript', 'Taza blanca con logo JS', 12.90, 1, '/images/taza-js.png', 10, NULL),
('Hoodie TypeScript', 'Buzo azul con logo TS', 45.00, 5, '/images/hoodie-ts.png', 10, NULL),
('Mouse Inalámbrico', 'Mouse ergonómico con conexión Bluetooth', 19.99, 6, '/images/mouse.png', 10, NULL),
('Teclado Mecánico', 'Teclado retroiluminado con switches azules', 79.50, 6, '/images/teclado.png', 10, NULL),
('Auriculares Bluetooth', 'Auriculares con cancelación de ruido', 120.00, 6, '/images/auriculares.png', 10, NULL),
('Libro Python Avanzado', 'Guía completa de programación avanzada en Python', 50.00, 4, '/images/libro-python.png', 10, 47.50),
('Placa Raspberry Pi 4', 'Mini computadora ideal para proyectos IoT', 95.00, 6, '/images/raspberry.png', 10, 86.50);

-- =====================================================
-- VISTAS ÚTILES
-- =====================================================

-- Vista para productos con información de categoría
CREATE VIEW products_with_category AS
SELECT 
    p.id,
    p.name,
    p.description,
    p.price,
    p.category_id,
    c.name as category_name,
    p.image,
    p.stock,
    p.discount,
    p.is_active,
    p.created_at,
    p.updated_at,
    CASE 
        WHEN p.discount IS NOT NULL AND p.discount < p.price THEN p.discount
        ELSE p.price
    END as actual_price,
    CASE 
        WHEN p.discount IS NOT NULL AND p.discount < p.price THEN TRUE
        ELSE FALSE
    END as has_discount
FROM products p
JOIN categories c ON p.category_id = c.id
WHERE p.is_active = TRUE;

-- Vista para carrito con información completa
CREATE VIEW cart_with_details AS
SELECT 
    ci.id,
    ci.cart_session_id,
    ci.product_id,
    p.name as product_name,
    p.price,
    p.discount,
    p.image,
    p.stock,
    ci.quantity,
    CASE 
        WHEN p.discount IS NOT NULL AND p.discount < p.price THEN p.discount
        ELSE p.price
    END as unit_price,
    ci.quantity * CASE 
        WHEN p.discount IS NOT NULL AND p.discount < p.price THEN p.discount
        ELSE p.price
    END as total_price,
    ci.created_at,
    ci.updated_at
FROM cart_items ci
JOIN products p ON ci.product_id = p.id
WHERE p.is_active = TRUE;

-- =====================================================
-- PROCEDIMIENTOS ALMACENADOS ÚTILES
-- =====================================================

-- Procedimiento para limpiar carritos antiguos (más de 30 días)
DELIMITER //
CREATE PROCEDURE CleanOldCarts()
BEGIN
    DELETE FROM cart_sessions 
    WHERE user_id IS NULL 
    AND created_at < DATE_SUB(NOW(), INTERVAL 30 DAY);
END //
DELIMITER ;

-- Procedimiento para actualizar stock después de una venta
DELIMITER //
CREATE PROCEDURE UpdateProductStock(IN product_id BIGINT, IN quantity_sold INT)
BEGIN
    UPDATE products 
    SET stock = stock - quantity_sold 
    WHERE id = product_id AND stock >= quantity_sold;
    
    SELECT ROW_COUNT() as rows_affected;
END //
DELIMITER ;

-- =====================================================
-- TRIGGERS PARA AUDITORÍA
-- =====================================================

-- Trigger para actualizar stock automáticamente al crear order_items
DELIMITER //
CREATE TRIGGER update_stock_on_order_item_insert
AFTER INSERT ON order_items
FOR EACH ROW
BEGIN
    UPDATE products 
    SET stock = stock - NEW.quantity 
    WHERE id = NEW.product_id;
END //
DELIMITER ;

-- =====================================================
-- ÍNDICES ADICIONALES PARA OPTIMIZACIÓN
-- =====================================================

-- Índices compuestos para consultas frecuentes
CREATE INDEX idx_products_category_active ON products(category_id, is_active);
CREATE INDEX idx_products_price_active ON products(price, is_active);
CREATE INDEX idx_orders_user_created ON orders(user_id, created_at);
CREATE INDEX idx_cart_items_session_product ON cart_items(cart_session_id, product_id);

-- =====================================================
-- COMENTARIOS FINALES
-- =====================================================

/*
ESTRUCTURA DEL MODELO:

1. USERS: Gestión de usuarios con autenticación básica
2. CATEGORIES: Categorías de productos
3. PRODUCTS: Catálogo de productos con descuentos
4. CART_SESSIONS: Sesiones de carrito (usuarios logueados y anónimos)
5. CART_ITEMS: Items en el carrito
6. ORDERS: Pedidos realizados
7. ORDER_ITEMS: Items de cada pedido
8. BILLING_ADDRESSES: Direcciones de facturación
9. SHIPPING_ADDRESSES: Direcciones de envío
10. PAYMENT_INFO: Información de pago (encriptada)

RELACIONES PRINCIPALES:
- Products -> Categories (N:1)
- Cart_Sessions -> Users (N:1, opcional)
- Cart_Items -> Cart_Sessions (N:1)
- Cart_Items -> Products (N:1)
- Orders -> Users (N:1)
- Order_Items -> Orders (N:1)
- Order_Items -> Products (N:1)
- Billing_Addresses -> Users (N:1)
- Billing_Addresses -> Orders (N:1, opcional)
- Shipping_Addresses -> Users (N:1)
- Shipping_Addresses -> Orders (N:1, opcional)
- Payment_Info -> Orders (1:1)

FUNCIONALIDADES CUBIERTAS:
✅ Login/Register básico
✅ Gestión de productos (CRUD)
✅ Carrito de compras
✅ Checkout completo
✅ Gestión de pedidos
✅ Búsqueda y filtrado de productos
✅ Categorías de productos
*/
