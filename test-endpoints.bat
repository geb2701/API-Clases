@echo off
echo ===================================
echo PROBAR ENDPOINTS DE LA API
echo ===================================
echo.
echo Este script probara todos los endpoints
echo de la API usando curl
echo.
echo Asegurate de que el backend este corriendo en:
echo http://localhost:8080
echo.
pause

echo.
echo [1/7] Probando PRODUCTOS...
curl -s http://localhost:8080/api/products?page=0^&size=5 > nul
if %ERRORLEVEL% EQU 0 (
    echo OK - Productos endpoint funciona
) else (
    echo ERROR - No se pudo conectar al endpoint de productos
)

echo.
echo [2/7] Probando CATEGORIAS...
curl -s http://localhost:8080/api/categories > nul
if %ERRORLEVEL% EQU 0 (
    echo OK - Categorias endpoint funciona
) else (
    echo ERROR - No se pudo conectar al endpoint de categorias
)

echo.
echo [3/7] Probando USUARIOS...
curl -s http://localhost:8080/api/users > nul
if %ERRORLEVEL% EQU 0 (
    echo OK - Usuarios endpoint funciona
) else (
    echo ERROR - No se pudo conectar al endpoint de usuarios
)

echo.
echo [4/7] Probando ORDENES...
curl -s http://localhost:8080/api/orders > nul
if %ERRORLEVEL% EQU 0 (
    echo OK - Ordenes endpoint funciona
) else (
    echo ERROR - No se pudo conectar al endpoint de ordenes
)

echo.
echo [5/7] Probando CARRITO...
curl -s http://localhost:8080/api/cart/test-session-123 > nul
if %ERRORLEVEL% EQU 0 (
    echo OK - Carrito endpoint funciona
) else (
    echo ERROR - No se pudo conectar al endpoint de carrito
)

echo.
echo [6/7] Probando ARCHIVOS...
curl -s http://localhost:8080/api/files/camiseta-react.png > nul
if %ERRORLEVEL% EQU 0 (
    echo OK - Archivos endpoint funciona
) else (
    echo WARN - No se pudo obtener el archivo (puede que no exista)
)

echo.
echo [7/7] Probando AUTENTICACION...
curl -s -X POST http://localhost:8080/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"demo@demo.com\",\"password\":\"password123\"}" > nul
if %ERRORLEVEL% EQU 0 (
    echo OK - Autenticacion endpoint funciona
) else (
    echo ERROR - No se pudo conectar al endpoint de autenticacion
)

echo.
echo ===================================
echo PRUEBAS COMPLETADAS
echo ===================================
echo.
echo Para pruebas mas detalladas, abre:
echo http://localhost:5173
echo.
echo Y ejecuta en la consola (F12):
echo await testAllEndpoints()
echo.
pause

