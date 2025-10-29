@echo off
echo ====================================
echo    Store TPO - Inicio con Docker
echo ====================================
echo.

REM Verificar si Docker está instalado
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker no está instalado o no está en el PATH
    echo Por favor instala Docker Desktop desde: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

echo [OK] Docker está instalado
echo.

REM Verificar si Docker está corriendo
docker ps >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker no está corriendo
    echo Por favor inicia Docker Desktop e intenta nuevamente
    pause
    exit /b 1
)

echo [OK] Docker está corriendo
echo.

echo Iniciando servicios...
echo.

docker-compose up -d --build

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Hubo un problema al iniciar los servicios
    echo Ejecuta 'docker-compose logs' para ver más detalles
    pause
    exit /b 1
)

echo.
echo ====================================
echo    Servicios iniciados correctamente
echo ====================================
echo.
echo - Frontend:  http://localhost
echo - Backend:   http://localhost:8080/api
echo - MySQL:     localhost:3306
echo.
echo Para ver los logs:  docker-compose logs -f
echo Para detener:       docker-compose down
echo.
echo Abriendo frontend en el navegador...
timeout /t 3 /nobreak >nul
start http://localhost

pause
