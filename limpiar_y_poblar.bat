@echo off
echo ===================================
echo LIMPIAR Y POBLAR BASE DE DATOS
echo ===================================
echo.
echo Este script hara lo siguiente:
echo 1. Limpiar todos los datos existentes
echo 2. Poblar con datos de prueba nuevos
echo.
echo ADVERTENCIA: Se eliminaran TODOS los datos actuales
echo.
pause

echo.
echo [1/2] Limpiando datos existentes...
C:\xampp\mysql\bin\mysql.exe -u root < db\limpiar_datos.sql

if %ERRORLEVEL% EQU 0 (
    echo OK - Datos limpiados
    
    echo.
    echo [2/2] Poblando con datos nuevos...
    C:\xampp\mysql\bin\mysql.exe -u root < db\poblar_base_datos_completa.sql
    
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo ===================================
        echo EXITO: Base de datos poblada!
        echo ===================================
        echo.
        echo Datos insertados:
        echo - 6 Categorias
        echo - 6 Usuarios
        echo - 55+ Productos
        echo - 4 Ordenes de ejemplo
        echo - 3 Carritos activos
        echo.
        echo Usuarios de prueba:
        echo - demo@demo.com / password123
        echo - admin@ecommerce.com / password123
        echo - juan.perez@email.com / password123
        echo.
        echo Puedes verificar en:
        echo http://localhost/phpmyadmin
    ) else (
        echo.
        echo ERROR al poblar datos
    )
) else (
    echo.
    echo ERROR al limpiar datos
)

echo.
echo ===================================
pause

