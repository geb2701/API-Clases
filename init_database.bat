@echo off
echo Inicializando base de datos ecommerce_db...
echo.

REM Intentar conectar a MySQL usando la ruta de XAMPP
"C:\xampp\mysql\bin\mysql.exe" -u root -e "source database_schema.sql"

if %errorlevel% neq 0 (
    echo.
    echo Error: No se pudo conectar a MySQL.
    echo Asegurate de que XAMPP esté ejecutándose y MySQL esté activo.
    echo.
    echo Alternativa: Ejecuta el archivo database_schema.sql manualmente en phpMyAdmin
    echo 1. Abre http://localhost/phpmyadmin
    echo 2. Selecciona "Importar"
    echo 3. Selecciona el archivo database_schema.sql
    echo 4. Haz clic en "Ejecutar"
    pause
) else (
    echo.
    echo Base de datos inicializada correctamente!
    echo Los productos de ejemplo han sido insertados.
    pause
)
