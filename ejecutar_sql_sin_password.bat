@echo off
echo ===================================
echo EJECUTAR SCRIPT SQL - SIN PASSWORD
echo ===================================
echo.
echo NOTA: Este script asume que MySQL no tiene contraseña
echo Si tienes contraseña, usa ejecutar_sql.bat
echo.
pause

echo.
echo Ejecutando script...
echo.

C:\xampp\mysql\bin\mysql.exe -u root < db\poblar_base_datos_completa.sql

echo.
echo ===================================
if %ERRORLEVEL% EQU 0 (
    echo EXITO: Script ejecutado correctamente
    echo Base de datos poblada!
    echo.
    echo Puedes verificar en:
    echo - http://localhost/phpmyadmin
    echo - MySQL Workbench
) else (
    echo ERROR: Hubo un problema al ejecutar el script
    echo Codigo de error: %ERRORLEVEL%
    echo.
    echo Posibles causas:
    echo 1. MySQL no esta corriendo (Inicia XAMPP)
    echo 2. La base de datos no existe
    echo 3. Hay un error en el script SQL
)
echo ===================================
echo.
pause

