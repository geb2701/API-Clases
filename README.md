# 🛍️ E-Commerce Full Stack

> Sistema completo de e-commerce con React + TypeScript (Frontend) y Spring Boot (Backend)

---

## 📂 Estructura del Proyecto

```
API-Clases/
├── EcommerceApi/              ← BACKEND (Spring Boot + MySQL)
│   ├── src/main/
│   │   ├── java/grupo7/ecommerceapi/
│   │   └── resources/application.properties
│   ├── pom.xml
│   └── mvnw.cmd
│
├── src/                       ← FRONTEND (React + TypeScript)
│   ├── features/              (Módulos por funcionalidad)
│   ├── components/            (Componentes reutilizables)
│   ├── context/               (Estado global)
│   └── lib/                   (Utilidades)
│
├── public/                    (Assets estáticos)
├── package.json              (Dependencias frontend)
└── vite.config.ts            (Configuración Vite)
```

---

## 🚀 Inicio Rápido

### 1. Base de Datos

```sql
CREATE DATABASE ecommerce_db;
```

O ejecuta el script: `init_database.bat`

### 2. Backend

**Opción A - IntelliJ (Recomendado):**
1. Abre el proyecto en IntelliJ IDEA
2. Navega a: `EcommerceApi/src/main/java/grupo7/ecommerceapi/EcommerceApiApplication.java`
3. Click derecho → Run
4. Espera: `Started EcommerceApiApplication`

**Opción B - Terminal:**
```bash
cd EcommerceApi
./mvnw.cmd spring-boot:run
```

### 3. Frontend

```bash
npm install
npm run dev
```

### 4. Abrir Aplicación

- Frontend: http://localhost:5173
- Backend API: http://localhost:8080/api

---

## 🛠️ Tecnologías

### Frontend
- React 18+
- TypeScript
- Vite
- TanStack Router & Query
- Zustand (State)
- Tailwind CSS
- Shadcn/UI

### Backend
- Java 17+
- Spring Boot 3.5
- Spring Data JPA
- Spring Security
- MySQL 8.0
- Maven

---

## 📚 Documentación

- **[COMO_EJECUTAR.md](COMO_EJECUTAR.md)** - Guía detallada de instalación
- **[CONFIGURACION_FINAL.md](CONFIGURACION_FINAL.md)** - Configuración del sistema
- **[database_schema.sql](database_schema.sql)** - Schema de base de datos
- **[poblar_productos.sql](poblar_productos.sql)** - Datos de ejemplo

---

## ✨ Funcionalidades

- ✅ Catálogo de productos con búsqueda y filtros
- ✅ Carrito de compras (localStorage)
- ✅ Checkout completo
- ✅ Gestión de órdenes
- ✅ Autenticación de usuarios
- ✅ Panel de administración
- ✅ CRUD de productos
- ✅ Upload de imágenes
- ✅ Responsive design

---

## 📡 API Endpoints

### Productos
```
GET    /api/products
POST   /api/products
PUT    /api/products/{id}
DELETE /api/products/{id}
```

### Usuarios
```
POST   /api/users/register
POST   /api/users/login
```

### Órdenes
```
POST   /api/orders/create-from-cart
GET    /api/orders
```

Ver más en: [CONFIGURACION_FINAL.md](CONFIGURACION_FINAL.md)

---

## 🔧 Configuración

### Backend - application.properties

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/ecommerce_db
spring.datasource.username=root
spring.datasource.password=

server.port=8080
server.servlet.context-path=/api
```

### Frontend - .env (opcional)

```env
VITE_API_URL=http://localhost:8080/api
```

---

## 📝 Scripts Disponibles

### Frontend
```bash
npm run dev          # Desarrollo
npm run build        # Producción
npm run preview      # Preview build
```

### Backend
```bash
./mvnw spring-boot:run    # Ejecutar
./mvnw test              # Tests
./mvnw clean install     # Build
```

---

## 🐛 Troubleshooting

### Error 403 en API
- Verifica que el backend esté corriendo
- Revisa la configuración CORS en `SecurityConfig.java`

### Error de Base de Datos
- Asegúrate que MySQL esté corriendo
- Verifica credenciales en `application.properties`

### Puerto ocupado
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

---

## 👥 Desarrollado por

Grupo 7 - Proyecto E-Commerce

---

## 📄 Licencia

Este proyecto es de uso educativo.
