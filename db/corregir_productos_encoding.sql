-- =====================================================
-- SCRIPT PARA CORREGIR ENCODING DE PRODUCTOS
-- Este script corrige los caracteres corruptos usando UNHEX
-- =====================================================

USE ecommerce_db;
SET NAMES utf8mb4;

-- Deshabilitar foreign keys temporalmente
SET FOREIGN_KEY_CHECKS = 0;

-- Asegurar que las columnas estén en utf8mb4
ALTER TABLE products MODIFY name VARCHAR(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL;
ALTER TABLE products MODIFY description TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL;

-- Corregir descripción del producto 1 (Camiseta React) que tiene "cómodo"
UPDATE products 
SET description = UNHEX('43616D6973657461203130302520616C676F64C3B36E20636F6E206C6F676F2052656163742E20446973C3B1656F206D696E696D616C6973746120792063C3B36D6F646F2070617261206465736172726F6C6C61646F7265732E'), -- 'Camiseta 100% algodón con logo React. Diseño minimalista y cómodo para desarrolladores.'
    updated_at = NOW()
WHERE id = 1;

-- Corregir producto 85 (Mouse Gaming Óptico)
UPDATE products 
SET name = UNHEX('4D6F7573652047616D696E6720C393707469636F'), -- 'Mouse Gaming Óptico'
    description = UNHEX('4D6F75736520C393707469636F2067616D696E6720636F6E203720626F746F6E65732070726F6772616D61626C657320792044504920616A75737461626C652068617374612031323030302E'), -- 'Mouse óptico gaming con 7 botones programables y DPI ajustable hasta 12000.'
    updated_at = NOW()
WHERE id = 85;

-- Corregir producto 87 (Webcam HD 1080p) - tiene "Cámara"
UPDATE products 
SET description = UNHEX('43C3A16D617261207765622046756C6C20484420313038307020636F6E206D6963C3B3726F666F6E6F20696E636F72706F7261646F2E20496465616C20706172612073747265616D696E672E'), -- 'Cámara web Full HD 1080p con micrófono incorporado. Ideal para streaming.'
    updated_at = NOW()
WHERE id = 87;

-- Corregir producto 92 (Cámara Digital 4K)
UPDATE products 
SET name = UNHEX('43C3A16D617261204469676974616C20344B'), -- 'Cámara Digital 4K'
    description = UNHEX('43C3A16D617261206469676974616C2070726F666573696F6E616C20636F6E2067726162616369C3B36E20344B2079206573746162696C697A616369C3B36E20C39370746963612E'), -- 'Cámara digital profesional con grabación 4K y estabilización óptica.'
    updated_at = NOW()
WHERE id = 92;

-- Corregir producto 83 (Teclado Mecánico RGB)
UPDATE products 
SET name = UNHEX('5465636C61646F204D65C3A16E69636F20524742'), -- 'Teclado Mecánico RGB'
    description = UNHEX('5465636C61646F206D65C3A16E69636F20636F6E20696C756D696E616369C3B36E2052474220706572736F6E616C697A61626C652E20537769746368657320617A756C65732E'), -- 'Teclado mecánico con iluminación RGB personalizable. Switches azules.'
    updated_at = NOW()
WHERE id = 83;

-- Corregir producto 99 (Libro: Python Avanzado) - tiene "programación" y "prácticos"
UPDATE products 
SET description = UNHEX('4775C3AD6120636F6D706C6574612064652070726F6772616D616369C3B36E206176616E7A61646120656E20507974686F6E2E203530302070C3A167696E617320636F6E20656A656D706C6F73207072C3A1637469636F732E'), -- 'Guía completa de programación avanzada en Python. 500 páginas con ejemplos prácticos.'
    updated_at = NOW()
WHERE id = 99;

-- Corregir producto 106 (Lámpara LED Escritorio)
UPDATE products 
SET name = UNHEX('4CC3A16D70617261204C4544204573637269746F72696F'), -- 'Lámpara LED Escritorio'
    description = UNHEX('4CC3A16D70617261204C454420726567756C61626C6520636F6E2070756572746F205553422E204C757A2063C3A16C69646120792066C3AD6120616A75737461626C652E'), -- 'Lámpara LED regulable con puerto USB. Luz cálida y fría ajustable.'
    updated_at = NOW()
WHERE id = 106;

-- Corregir producto 112 (Lámpara de Pared LED)
UPDATE products 
SET name = UNHEX('4CC3A16D70617261206465205061726564204C4544'), -- 'Lámpara de Pared LED'
    description = UNHEX('4CC3A16D70617261206465207061726564206D6F6465726E6120636F6E206C757A204C454420726567756C61626C652E'), -- 'Lámpara de pared moderna con luz LED regulable.'
    updated_at = NOW()
WHERE id = 112;

-- Corregir producto 63 (Sudadera Node.js) - tiene "día"
UPDATE products 
SET description = UNHEX('5375616465726120766572646520636F6E20646973C3B1656F2064656C206C6F676F204E6F64652E6A732E205065726665637461207061726120656C2064C3AD6120612064C3AD612E'), -- 'Sudadera verde con diseño del logo Node.js. Perfecta para el día a día.'
    updated_at = NOW()
WHERE id = 63;

-- Corregir producto 67 (Zapatillas Deportivas) - tiene "día" y "cómodas"
UPDATE products 
SET description = UNHEX('5A61706174696C6C6173206465706F72746976617320757262616E61732E2043C3B36D6F646173207061726120656C2064C3AD6120612064C3AD612E'), -- 'Zapatillas deportivas urbanas. Cómodas para el día a día.'
    updated_at = NOW()
WHERE id = 67;

-- Corregir producto 61 (Chaqueta Bomber Tech) - tiene "cómoda"
UPDATE products 
SET description = UNHEX('436861717565746120626F6D62657220636F6E20657374696C6F20746563682E20526573697374656E746520616C20616775612079206D75792063C3B36D6F64612E'), -- 'Chaqueta bomber con estilo tech. Resistente al agua y muy cómoda.'
    updated_at = NOW()
WHERE id = 61;

-- Corregir producto 73 (Gorra Negra Tech) - tiene "algodón"
UPDATE products 
SET description = UNHEX('476F72726120616A75737461626C6520636F6E20626F726461646F20746563682E203130302520616C676F64C3B36E2E'), -- 'Gorra ajustable con bordado tech. 100% algodón.'
    updated_at = NOW()
WHERE id = 73;

-- Rehabilitar foreign keys
SET FOREIGN_KEY_CHECKS = 1;

-- Verificar el resultado
SELECT '=== PRODUCTOS CORREGIDOS ===' as estado;
SELECT id, name, LEFT(description, 60) as descripcion_corta 
FROM products 
WHERE id IN (1, 61, 63, 67, 73, 83, 85, 87, 92, 99, 106, 112)
ORDER BY id;

SELECT 'Productos corregidos exitosamente!' as Resultado;
