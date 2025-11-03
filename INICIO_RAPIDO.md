# 🚀 Inicio Rápido - Store TPO

## 📦 Lo que necesitas

1. **Docker Desktop** instalado y corriendo
   - Windows/Mac: [Descargar aquí](https://www.docker.com/products/docker-desktop)
   - Linux: [Instrucciones de instalación](https://docs.docker.com/engine/install/)

## ⚡ Iniciar el proyecto (3 pasos)

### 1️⃣ Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd API-Clases
```

### 2️⃣ Iniciar todo con un comando

**Windows:**
```bash
start.bat
```

**Linux/Mac:**
```bash
chmod +x start.sh
./start.sh
```

**O manualmente:**
```bash
docker-compose up -d --build
```

### 3️⃣ ¡Listo! 🎉

El navegador se abrirá automáticamente en http://localhost

Si no, accede manualmente a:
- **Frontend**: http://localhost
- **Backend API**: http://localhost:8080/api
- **Base de datos**: localhost:3306

## 🛑 Detener el proyecto

**Windows:**
```bash
stop.bat
```

**Linux/Mac:**
```bash
./stop.sh
```

**O manualmente:**
```bash
docker-compose down
```

## 📊 Ver qué está pasando

```bash
# Ver logs de todos los servicios
docker-compose logs -f

# Ver solo el backend
docker-compose logs -f backend

# Ver solo el frontend
docker-compose logs -f frontend

# Ver estado
docker-compose ps
```

## 🔧 Solución rápida de problemas

### ❌ "Port already in use"
Algo está usando los puertos. Detén otros servicios o cambia los puertos en `docker-compose.yml`

```bash
# Ver qué usa el puerto 8080 (Windows)
netstat -ano | findstr :8080

# Ver qué usa el puerto 8080 (Linux/Mac)
lsof -i :8080
```

### ❌ "Docker daemon not running"
Inicia Docker Desktop y espera a que esté completamente iniciado.

### ❌ Página en blanco o errores 500
```bash
# Ver logs para diagnosticar
docker-compose logs -f

# Reconstruir todo desde cero
docker-compose down -v
docker-compose up -d --build
```

### ❌ Base de datos no tiene datos
```bash
# Resetear base de datos
docker-compose down -v
docker-compose up -d
```

### ❌ Caracteres especiales rotos (ñ, á, é, etc.)
```bash
# Acceder a MySQL
docker-compose exec mysql mysql -u ecommerce_user -pecommerce_pass ecommerce_db

# Dentro de MySQL, ejecutar:
source /docker-entrypoint-initdb.d/db/fix_categories_charset.sql

# O ejecutar manualmente:
mysql -h localhost -P 3306 -u ecommerce_user -pecommerce_pass ecommerce_db < db/fix_categories_charset.sql
```

## 📚 Documentación completa

- **[README.md](./README.md)** - Documentación general del proyecto
- **[DOCKER.md](./DOCKER.md)** - Guía completa de Docker
- **[db/README_POBLAR_DB.md](./db/README_POBLAR_DB.md)** - Información sobre la base de datos

## 💡 Consejos

### Desarrollo con hot-reload

Si vas a desarrollar, usa solo MySQL en Docker:

```bash
# Iniciar solo MySQL
docker-compose -f docker-compose.dev.yml up -d

# Ejecutar backend desde IntelliJ IDEA
# Ejecutar frontend con: pnpm dev
```

### Limpiar todo

Si quieres empezar de cero:

```bash
# Detener y eliminar todo (datos, contenedores, volúmenes)
docker-compose down -v

# Limpiar imágenes del proyecto
docker rmi api-clases-backend api-clases-frontend

# Volver a construir
docker-compose up -d --build
```

### Acceder a la base de datos

```bash
# Cliente MySQL en línea de comandos
docker-compose exec mysql mysql -u ecommerce_user -pecommerce_pass ecommerce_db

# O usa cualquier cliente MySQL apuntando a:
# Host: localhost
# Puerto: 3306
# Usuario: ecommerce_user
# Password: ecommerce_pass
# Base de datos: ecommerce_db
```

## 🆘 ¿Necesitas ayuda?

1. Revisa los logs: `docker-compose logs -f`
2. Verifica el estado: `docker-compose ps`
3. Consulta [DOCKER.md](./DOCKER.md) para troubleshooting detallado
4. Resetea todo: `docker-compose down -v && docker-compose up -d --build`

---

**¡Ahora a desarrollar! 🎨**

