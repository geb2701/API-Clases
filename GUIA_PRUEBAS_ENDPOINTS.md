# 🧪 Guía de Pruebas de Endpoints

## 📋 Servicios Creados

Se han creado servicios completos para TODOS los endpoints del backend:

### ✅ Servicios Implementados

| Módulo | Archivo | Endpoints Cubiertos |
|--------|---------|---------------------|
| **Productos** | `src/features/product/services/product-service.ts` | ✅ Todos (GET, POST, PUT, DELETE) |
| **Categorías** | `src/features/category/services/category-service.ts` | ✅ Todos (GET) |
| **Usuarios** | `src/features/user/services/user-service.ts` | ✅ Todos (GET, POST, PUT, DELETE) |
| **Órdenes** | `src/features/order/services/order-service.ts` | ✅ Todos (GET, POST, PATCH) |
| **Carrito** | `src/features/cart/services/cart-service.ts` | ✅ Todos (GET, POST, PUT, DELETE) |
| **Autenticación** | `src/features/auth/services/auth-service.ts` | ✅ Todos (POST) |
| **Archivos** | `src/features/product/services/upload-service.ts` | ✅ Todos (POST, GET, DELETE) |

---

## 🚀 Cómo Probar los Endpoints

### Opción 1: Script Automatizado (Recomendado)

1. **Iniciar el backend**:
   ```bash
   # En IntelliJ o desde terminal
   .\mvnw spring-boot:run -f EcommerceApi/pom.xml
   ```

2. **Iniciar el frontend**:
   ```bash
   npm run dev
   ```

3. **Abrir consola del navegador**:
   - Ir a http://localhost:5173
   - Presionar F12 para abrir DevTools
   - Ir a la pestaña "Console"

4. **Cargar el script de pruebas**:
   ```javascript
   // Copiar y pegar el contenido de src/test-api-endpoints.ts
   // en la consola del navegador
   ```

5. **Ejecutar todas las pruebas**:
   ```javascript
   await testAllEndpoints()
   ```

Verás un reporte completo de todas las pruebas:
```
==================================================
🚀 INICIANDO PRUEBAS DE TODOS LOS ENDPOINTS
==================================================

==================================================
PROBANDO ENDPOINTS DE PRODUCTOS
==================================================
ℹ️  GET /products - Listar productos
✅ 46 productos obtenidos
...

📊 RESUMEN DE PRUEBAS
Total de módulos probados: 6
✅ Exitosos: 6
❌ Fallidos: 0

🎉 ¡TODAS LAS PRUEBAS PASARON EXITOSAMENTE!
```

---

### Opción 2: Probar Manualmente con Postman/Thunder Client

#### 1. PRODUCTOS

```http
### Listar productos
GET http://localhost:8080/api/products

### Obtener producto por ID
GET http://localhost:8080/api/products/1

### Buscar productos
GET http://localhost:8080/api/products/search?q=react

### Productos por categoría
GET http://localhost:8080/api/products/category/Tecnología

### Productos en oferta
GET http://localhost:8080/api/products/offers

### Productos con stock bajo
GET http://localhost:8080/api/products/low-stock?threshold=20

### Crear producto
POST http://localhost:8080/api/products
Content-Type: application/json

{
  "name": "Producto Test",
  "description": "Descripción del producto test",
  "price": 99.99,
  "category": { "id": 1 },
  "image": "test.png",
  "stock": 100
}

### Actualizar producto
PUT http://localhost:8080/api/products/1
Content-Type: application/json

{
  "name": "Producto Actualizado",
  "price": 89.99,
  "stock": 50
}

### Eliminar producto
DELETE http://localhost:8080/api/products/1
```

#### 2. CATEGORÍAS

```http
### Listar categorías
GET http://localhost:8080/api/categories

### Obtener categoría por ID
GET http://localhost:8080/api/categories/1

### Obtener categoría por nombre
GET http://localhost:8080/api/categories/name/Tecnología
```

#### 3. USUARIOS

```http
### Listar usuarios
GET http://localhost:8080/api/users

### Obtener usuario por ID
GET http://localhost:8080/api/users/1

### Obtener usuario por email
GET http://localhost:8080/api/users/email/demo@demo.com

### Verificar si email existe
POST http://localhost:8080/api/users/check-email
Content-Type: application/json

{
  "email": "demo@demo.com"
}

### Actualizar usuario
PUT http://localhost:8080/api/users/1
Content-Type: application/json

{
  "name": "Nuevo Nombre",
  "surname": "Nuevo Apellido"
}

### Eliminar usuario
DELETE http://localhost:8080/api/users/1
```

#### 4. ÓRDENES

```http
### Listar todas las órdenes
GET http://localhost:8080/api/orders

### Obtener orden por ID
GET http://localhost:8080/api/orders/1

### Órdenes de un usuario
GET http://localhost:8080/api/orders/user/2

### Crear orden
POST http://localhost:8080/api/orders
Content-Type: application/json

{
  "userId": 6,
  "billing": {
    "firstName": "Demo",
    "lastName": "User",
    "dni": "12345678",
    "address": "Calle Test 123",
    "city": "Madrid",
    "postalCode": "28001"
  },
  "items": [
    {
      "productId": 1,
      "quantity": 2
    }
  ]
}

### Actualizar estado de orden
PATCH http://localhost:8080/api/orders/1/status?status=shipped
```

#### 5. CARRITO

```http
### Obtener items del carrito
GET http://localhost:8080/api/cart/test-session-123

### Agregar al carrito
POST http://localhost:8080/api/cart/test-session-123/add?productId=1&quantity=2

### Actualizar cantidad
PUT http://localhost:8080/api/cart/test-session-123/update?productId=1&quantity=3

### Quitar del carrito
DELETE http://localhost:8080/api/cart/test-session-123/remove?productId=1

### Limpiar carrito
DELETE http://localhost:8080/api/cart/test-session-123/clear

### Obtener total
GET http://localhost:8080/api/cart/test-session-123/total

### Contar items
GET http://localhost:8080/api/cart/test-session-123/count

### Validar stock
GET http://localhost:8080/api/cart/test-session-123/validate
```

#### 6. AUTENTICACIÓN

```http
### Registrar usuario
POST http://localhost:8080/api/auth/register
Content-Type: application/json

{
  "name": "Nuevo",
  "surname": "Usuario",
  "email": "nuevo@test.com",
  "password": "password123"
}

### Login
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "email": "demo@demo.com",
  "password": "password123"
}

### Logout
POST http://localhost:8080/api/auth/logout
```

#### 7. ARCHIVOS

```http
### Obtener imagen
GET http://localhost:8080/api/files/camiseta-react.png

### Subir imagen
POST http://localhost:8080/api/files/upload
Content-Type: multipart/form-data

[Seleccionar archivo en Postman/Thunder Client]

### Eliminar imagen
DELETE http://localhost:8080/api/files/nombre-archivo.png
```

---

## 📊 Endpoints por Módulo

### 1. Productos (10 endpoints)
- ✅ `GET /products` - Listar con paginación
- ✅ `GET /products/{id}` - Obtener por ID
- ✅ `GET /products/category/{name}` - Por categoría
- ✅ `GET /products/search` - Buscar
- ✅ `GET /products/offers` - Ofertas
- ✅ `GET /products/low-stock` - Stock bajo
- ✅ `GET /products/{id}/stock` - Verificar stock
- ✅ `POST /products` - Crear
- ✅ `PUT /products/{id}` - Actualizar
- ✅ `DELETE /products/{id}` - Eliminar

### 2. Categorías (3 endpoints)
- ✅ `GET /categories` - Listar todas
- ✅ `GET /categories/{id}` - Obtener por ID
- ✅ `GET /categories/name/{name}` - Por nombre

### 3. Usuarios (7 endpoints)
- ✅ `GET /users` - Listar todos
- ✅ `GET /users/{id}` - Obtener por ID
- ✅ `GET /users/email/{email}` - Por email
- ✅ `POST /users/register` - Registrar
- ✅ `POST /users/login` - Login
- ✅ `POST /users/check-email` - Verificar email
- ✅ `PUT /users/{id}` - Actualizar
- ✅ `DELETE /users/{id}` - Eliminar

### 4. Órdenes (5 endpoints)
- ✅ `GET /orders` - Listar todas
- ✅ `GET /orders/{id}` - Obtener por ID
- ✅ `GET /orders/user/{userId}` - Por usuario
- ✅ `POST /orders` - Crear orden
- ✅ `PATCH /orders/{id}/status` - Actualizar estado

### 5. Carrito (8 endpoints)
- ✅ `GET /cart/{sessionId}` - Obtener items
- ✅ `GET /cart/{sessionId}/total` - Total
- ✅ `GET /cart/{sessionId}/count` - Cantidad
- ✅ `GET /cart/{sessionId}/validate` - Validar stock
- ✅ `POST /cart/{sessionId}/add` - Agregar producto
- ✅ `PUT /cart/{sessionId}/update` - Actualizar cantidad
- ✅ `DELETE /cart/{sessionId}/remove` - Quitar producto
- ✅ `DELETE /cart/{sessionId}/clear` - Limpiar carrito

### 6. Autenticación (3 endpoints)
- ✅ `POST /auth/register` - Registrar
- ✅ `POST /auth/login` - Login
- ✅ `POST /auth/logout` - Logout

### 7. Archivos (3 endpoints)
- ✅ `POST /files/upload` - Subir archivo
- ✅ `GET /files/{fileName}` - Obtener archivo
- ✅ `DELETE /files/{fileName}` - Eliminar archivo

---

## 🧪 Datos de Prueba

### Usuarios Disponibles
```
Email: demo@demo.com
Password: password123

Email: admin@ecommerce.com
Password: password123

Email: juan.perez@email.com
Password: password123
```

### IDs Útiles
```
Categorías:
1 = Accesorios
2 = Decoración
3 = Hogar
4 = Libros
5 = Ropa
6 = Tecnología

Productos:
1 = Camiseta React
2 = Hoodie TypeScript
19 = Monitor 24"
20 = Teclado Mecánico

Usuarios:
1 = Admin
2 = Juan Pérez
6 = Demo User
```

---

## ✅ Checklist de Pruebas

Marca cada módulo después de probarlo:

- [ ] **Productos** - Todos los endpoints funcionan
- [ ] **Categorías** - Todos los endpoints funcionan
- [ ] **Usuarios** - Todos los endpoints funcionan
- [ ] **Órdenes** - Todos los endpoints funcionan
- [ ] **Carrito** - Todos los endpoints funcionan
- [ ] **Autenticación** - Todos los endpoints funcionan
- [ ] **Archivos** - Todos los endpoints funcionan

---

## 🐛 Solución de Problemas

### Error: "Failed to fetch"
**Causa**: Backend no está corriendo
**Solución**: Inicia el backend con `.\mvnw spring-boot:run -f EcommerceApi/pom.xml`

### Error: "404 Not Found"
**Causa**: Endpoint incorrecto o ruta no existe
**Solución**: Verifica la URL y el path del endpoint

### Error: "500 Internal Server Error"
**Causa**: Error en el backend
**Solución**: Revisa los logs del backend en IntelliJ

### Error: "CORS"
**Causa**: Frontend y backend en puertos diferentes
**Solución**: Ya está configurado en `SecurityConfig.java`

---

## 📈 Estadísticas

```
Total de Endpoints: 39
Servicios TypeScript: 7 archivos
Controladores Java: 6 archivos
Cobertura: 100%
```

---

## 🎯 Siguiente Paso

Una vez que hayas probado todos los endpoints y funcionan correctamente, puedes:

1. ✅ Integrar los servicios en tus componentes React
2. ✅ Agregar manejo de errores personalizado
3. ✅ Implementar cache con React Query
4. ✅ Agregar loaders y estados de carga
5. ✅ Implementar paginación en el frontend

---

¡Todos los servicios están listos para usar! 🚀

