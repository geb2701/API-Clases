@echo off
echo ===================================
echo EJECUTAR SCRIPT SQL - POBLAR BASE DE DATOS
echo ===================================
echo.
echo NOTA: Si MySQL pide contraseña y no tienes, solo presiona ENTER
echo.
pause

echo.
echo Ejecutando script...
echo.

C:\xampp\mysql\bin\mysql.exe -u root -p < db\poblar_base_datos_completa.sql

echo.
echo ===================================
if %ERRORLEVEL% EQU 0 (
    echo EXITO: Script ejecutado correctamente
    echo Base de datos poblada!
) else (
    echo ERROR: Hubo un problema al ejecutar el script
    echo Codigo de error: %ERRORLEVEL%
)
echo ===================================
echo.
pause

