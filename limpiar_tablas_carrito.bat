@echo off
echo ===================================
echo ELIMINAR TABLAS DE CARRITO EN BD
echo ===================================
echo.
echo Este script eliminara las tablas:
echo - cart_items
echo - cart_sessions
echo.
echo El carrito ahora funciona solo con localStorage
echo.
pause

echo.
echo Ejecutando script SQL...
C:\xampp\mysql\bin\mysql.exe -u root < db\limpiar_tablas_carrito.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ===================================
    echo EXITO: Tablas eliminadas
    echo ===================================
    echo.
    echo El carrito ahora usa localStorage
    echo No requiere base de datos
) else (
    echo.
    echo ERROR: No se pudieron eliminar las tablas
    echo Codigo de error: %ERRORLEVEL%
)

echo.
pause

