-- =====================================================
-- Script para agregar el campo role a la tabla users
-- Ejecutar en la base de datos existente
-- =====================================================

USE ecommerce_db;

-- Agregar columna role si no existe
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS role VARCHAR(20) NOT NULL DEFAULT 'USER' AFTER is_active;

-- Crear índice para mejorar búsquedas por rol
CREATE INDEX IF NOT EXISTS idx_role ON users(role);

-- Actualizar usuarios existentes a rol USER (por si acaso)
UPDATE users SET role = 'USER' WHERE role IS NULL OR role = '';

-- Verificar datos
SELECT id, name, email, role FROM users LIMIT 10;

