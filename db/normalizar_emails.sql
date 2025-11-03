-- Script para normalizar todos los emails en la base de datos a lowercase
-- Esto resuelve problemas de comparación case-sensitive

-- Normalizar emails en la tabla users
UPDATE users 
SET email = LOWER(TRIM(email))
WHERE email IS NOT NULL;

-- Verificar usuarios duplicados (por si acaso hay emails duplicados con diferente case)
SELECT email, COUNT(*) as count
FROM users
GROUP BY LOWER(email)
HAVING COUNT(*) > 1;

-- Si hay duplicados, puedes desactivar los más antiguos (cambiar por tu lógica preferida)
-- UPDATE users u1
-- SET is_active = false
-- WHERE u1.id NOT IN (
--     SELECT MIN(u2.id)
--     FROM users u2
--     WHERE LOWER(u2.email) = LOWER(u1.email)
-- );

