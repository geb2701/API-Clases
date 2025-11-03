-- =====================================================
-- Script para agregar el campo role a la tabla users
-- Ejecutar en la base de datos existente
-- =====================================================

USE ecommerce_db;

-- Agregar columna role si no existe
-- Nota: MySQL 8.0 no soporta IF NOT EXISTS en ALTER TABLE, usamos procedimiento alternativo
SET @exist := (SELECT COUNT(*) FROM information_schema.columns 
               WHERE table_schema = 'ecommerce_db' 
               AND table_name = 'users' 
               AND column_name = 'role');

SET @sqlstmt := IF(@exist = 0, 
                   'ALTER TABLE users ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT ''USER'' AFTER is_active',
                   'SELECT ''Columna role ya existe'' AS mensaje');

PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Crear índice para mejorar búsquedas por rol (solo si no existe)
SET @exist_idx := (SELECT COUNT(*) FROM information_schema.statistics 
                   WHERE table_schema = 'ecommerce_db' 
                   AND table_name = 'users' 
                   AND index_name = 'idx_role');

SET @sqlstmt_idx := IF(@exist_idx = 0, 
                       'CREATE INDEX idx_role ON users(role)',
                       'SELECT ''Índice idx_role ya existe'' AS mensaje');

PREPARE stmt_idx FROM @sqlstmt_idx;
EXECUTE stmt_idx;
DEALLOCATE PREPARE stmt_idx;

-- Actualizar usuarios existentes a rol USER (por si acaso)
UPDATE users SET role = 'USER' WHERE role IS NULL OR role = '';

-- Verificar datos
SELECT id, name, email, role FROM users LIMIT 10;

