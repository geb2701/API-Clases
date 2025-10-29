# 🐳 Guía Completa de Docker

## 📋 Tabla de Contenidos
- [Arquitectura](#arquitectura)
- [Instalación de Docker](#instalación-de-docker)
- [Configuración](#configuración)
- [Comandos Principales](#comandos-principales)
- [Desarrollo Local](#desarrollo-local)
- [Producción](#producción)
- [Troubleshooting](#troubleshooting)

---

## 🏗️ Arquitectura

El proyecto está dividido en tres servicios principales:

### 1. MySQL (Base de Datos)
- **Imagen**: `mysql:8.0`
- **Puerto**: 3306
- **Volumen**: Datos persistentes en `mysql_data`
- **Inicialización**: Scripts SQL automáticos al primer arranque

### 2. Backend (Spring Boot)
- **Build**: Multi-stage con Maven
- **Puerto**: 8080
- **Dependencias**: MySQL
- **Health Check**: Endpoint `/api/health`

### 3. Frontend (React + Vite)
- **Build**: Multi-stage con Node.js + Nginx
- **Puerto**: 80
- **Servidor**: Nginx optimizado con compresión y cache

### Red
Todos los servicios se comunican a través de la red `ecommerce-network`.

---

## 📥 Instalación de Docker

### Windows
1. Descargar [Docker Desktop](https://www.docker.com/products/docker-desktop)
2. Ejecutar el instalador
3. Reiniciar el sistema
4. Verificar instalación:
```bash
docker --version
docker-compose --version
```

### Linux (Ubuntu/Debian)
```bash
# Actualizar paquetes
sudo apt update

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Añadir usuario al grupo docker
sudo usermod -aG docker $USER

# Instalar Docker Compose
sudo apt install docker-compose

# Verificar
docker --version
docker-compose --version
```

### macOS
1. Descargar [Docker Desktop para Mac](https://www.docker.com/products/docker-desktop)
2. Instalar la aplicación
3. Verificar instalación en terminal

---

## ⚙️ Configuración

### Variables de Entorno

Copiar el archivo de ejemplo:
```bash
cp .env.example .env
```

Editar `.env` si necesitas cambiar credenciales:
```env
MYSQL_ROOT_PASSWORD=tu_password
MYSQL_DATABASE=ecommerce_db
MYSQL_USER=tu_usuario
MYSQL_PASSWORD=tu_password
```

### Puertos

Asegúrate de que estos puertos estén disponibles:
- `80`: Frontend
- `3306`: MySQL
- `8080`: Backend

Para verificar:
```bash
# Windows (PowerShell)
netstat -ano | findstr :80
netstat -ano | findstr :3306
netstat -ano | findstr :8080

# Linux/Mac
netstat -tuln | grep 80
netstat -tuln | grep 3306
netstat -tuln | grep 8080
```

---

## 🚀 Comandos Principales

### Iniciar Todo el Sistema

```bash
# Primera vez (construir imágenes)
docker-compose up -d --build

# Ejecuciones posteriores
docker-compose up -d
```

### Ver Logs

```bash
# Todos los servicios (modo seguimiento)
docker-compose logs -f

# Un servicio específico
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql

# Últimas 100 líneas
docker-compose logs --tail=100

# Sin seguimiento
docker-compose logs
```

### Estado de los Contenedores

```bash
# Ver estado
docker-compose ps

# Recursos utilizados
docker stats
```

### Reiniciar Servicios

```bash
# Reiniciar todos
docker-compose restart

# Reiniciar uno
docker-compose restart backend
docker-compose restart frontend
docker-compose restart mysql
```

### Detener Servicios

```bash
# Detener (conserva datos)
docker-compose stop

# Detener y eliminar contenedores (conserva volúmenes)
docker-compose down

# Detener y eliminar TODO (incluyendo datos de BD)
docker-compose down -v
```

### Reconstruir Imágenes

```bash
# Después de cambios en el código
docker-compose up -d --build

# Reconstruir sin cache
docker-compose build --no-cache
docker-compose up -d
```

### Acceder a Contenedores

```bash
# Shell en el backend
docker-compose exec backend sh

# Shell en MySQL
docker-compose exec mysql bash

# Cliente MySQL directo
docker-compose exec mysql mysql -u ecommerce_user -pecommerce_pass ecommerce_db

# Shell en frontend (Nginx)
docker-compose exec frontend sh
```

---

## 💻 Desarrollo Local

Para desarrollo, es recomendable usar `docker-compose.dev.yml` que solo levanta MySQL:

```bash
# Iniciar solo MySQL
docker-compose -f docker-compose.dev.yml up -d

# Backend: ejecutar desde IntelliJ IDEA
# Frontend: ejecutar con 'pnpm dev'
```

Esto te permite:
- ✅ Hot reload en backend (IntelliJ)
- ✅ Hot reload en frontend (Vite)
- ✅ Debugging directo
- ✅ Menor uso de recursos

### Configuración Backend en Desarrollo

En `EcommerceApi/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/ecommerce_db
spring.datasource.username=ecommerce_user
spring.datasource.password=ecommerce_pass
```

---

## 🌐 Producción

### Build Optimizado

```bash
# Construir para producción
docker-compose build --no-cache

# Iniciar
docker-compose up -d
```

### Configuración Nginx (ya incluida)

El archivo `nginx.conf` incluye:
- ✅ Compresión gzip
- ✅ Cache de assets estáticos
- ✅ Manejo de SPA (rutas de React Router)
- ✅ Headers de seguridad

### Backups de Base de Datos

```bash
# Crear backup
docker-compose exec mysql mysqldump -u ecommerce_user -pecommerce_pass ecommerce_db > backup.sql

# Restaurar backup
docker-compose exec -T mysql mysql -u ecommerce_user -pecommerce_pass ecommerce_db < backup.sql
```

### Monitoreo

```bash
# Logs en tiempo real
docker-compose logs -f

# Estadísticas de recursos
docker stats

# Health checks
curl http://localhost:8080/api/health
```

---

## 🐛 Troubleshooting

### Error: "Port already in use"

```bash
# Ver qué está usando el puerto
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :8080
kill -9 <PID>

# O cambiar el puerto en docker-compose.yml
```

### Error: "Cannot connect to MySQL"

```bash
# Verificar que MySQL esté healthy
docker-compose ps

# Ver logs de MySQL
docker-compose logs mysql

# Reiniciar MySQL
docker-compose restart mysql
```

### Backend no inicia

```bash
# Ver logs detallados
docker-compose logs backend

# Verificar conectividad con MySQL
docker-compose exec backend ping mysql

# Reconstruir
docker-compose up -d --build backend
```

### Frontend muestra página en blanco

```bash
# Ver logs de Nginx
docker-compose logs frontend

# Verificar que los archivos estén en el contenedor
docker-compose exec frontend ls -la /usr/share/nginx/html

# Reconstruir frontend
docker-compose up -d --build frontend
```

### Base de datos no se inicializa

```bash
# Eliminar volumen y recrear
docker-compose down -v
docker-compose up -d
```

### Limpiar todo y empezar de cero

```bash
# Detener y eliminar TODO
docker-compose down -v

# Eliminar imágenes del proyecto
docker rmi ecommerce-backend ecommerce-frontend

# Limpiar sistema Docker
docker system prune -a

# Volver a construir
docker-compose up -d --build
```

### Verificar conectividad entre servicios

```bash
# Desde backend a MySQL
docker-compose exec backend ping mysql

# Desde frontend a backend
docker-compose exec frontend wget -O- http://backend:8080/api/health
```

### Ver configuración de red

```bash
# Listar redes
docker network ls

# Inspeccionar red del proyecto
docker network inspect api-clases_ecommerce-network
```

---

## 📊 Comandos Útiles Adicionales

### Limpieza de Docker

```bash
# Eliminar contenedores parados
docker container prune

# Eliminar imágenes sin usar
docker image prune

# Eliminar volúmenes sin usar
docker volume prune

# Eliminar todo lo no usado
docker system prune -a --volumes
```

### Inspeccionar

```bash
# Ver configuración de un contenedor
docker inspect <container_name>

# Ver logs de construcción
docker-compose build --progress=plain

# Ver configuración del compose
docker-compose config
```

### Copiar archivos

```bash
# Del host al contenedor
docker cp archivo.txt ecommerce-backend:/app/

# Del contenedor al host
docker cp ecommerce-backend:/app/logs.txt ./
```

---

## 🔗 Referencias

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Spring Boot Docker](https://spring.io/guides/gs/spring-boot-docker/)
- [Nginx Docker](https://hub.docker.com/_/nginx)
- [MySQL Docker](https://hub.docker.com/_/mysql)

---

## 📞 Soporte

Si tienes problemas:
1. Consulta esta documentación
2. Revisa los logs: `docker-compose logs -f`
3. Verifica el estado: `docker-compose ps`
4. Consulta la documentación oficial de Docker

