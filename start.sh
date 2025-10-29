#!/bin/bash

echo "===================================="
echo "   Store TPO - Inicio con Docker"
echo "===================================="
echo ""

# Verificar si Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "[ERROR] Docker no está instalado"
    echo "Por favor instala Docker desde: https://docs.docker.com/get-docker/"
    exit 1
fi

echo "[OK] Docker está instalado"
echo ""

# Verificar si Docker está corriendo
if ! docker ps &> /dev/null; then
    echo "[ERROR] Docker no está corriendo"
    echo "Por favor inicia Docker e intenta nuevamente"
    exit 1
fi

echo "[OK] Docker está corriendo"
echo ""

echo "Iniciando servicios..."
echo ""

docker-compose up -d --build

if [ $? -ne 0 ]; then
    echo ""
    echo "[ERROR] Hubo un problema al iniciar los servicios"
    echo "Ejecuta 'docker-compose logs' para ver más detalles"
    exit 1
fi

echo ""
echo "===================================="
echo "   Servicios iniciados correctamente"
echo "===================================="
echo ""
echo "- Frontend:  http://localhost"
echo "- Backend:   http://localhost:8080/api"
echo "- MySQL:     localhost:3306"
echo ""
echo "Para ver los logs:  docker-compose logs -f"
echo "Para detener:       docker-compose down"
echo ""

# Abrir en navegador (intenta con diferentes comandos según el OS)
if command -v xdg-open &> /dev/null; then
    echo "Abriendo frontend en el navegador..."
    sleep 3
    xdg-open http://localhost
elif command -v open &> /dev/null; then
    echo "Abriendo frontend en el navegador..."
    sleep 3
    open http://localhost
fi

echo ""
echo "Presiona Ctrl+C cuando quieras detener los logs"
docker-compose logs -f
