-- Agregar columna user_id a la tabla products para rastrear quién creó cada producto
-- Este script es seguro ejecutarlo múltiples veces (idempotente)

-- Verificar si la columna ya existe antes de agregarla
SET @dbname = DATABASE();
SET @tablename = "products";
SET @columnname = "user_id";
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (TABLE_SCHEMA = @dbname)
      AND (TABLE_NAME = @tablename)
      AND (COLUMN_NAME = @columnname)
  ) > 0,
  "SELECT 'Column user_id already exists in products table.' AS message;",
  CONCAT("ALTER TABLE ", @tablename, " ADD COLUMN ", @columnname, " BIGINT NULL, ADD INDEX idx_user_id (user_id), ADD FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;")
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

