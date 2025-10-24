# 🧪 Cómo Probar los Endpoints

## ⚡ Pasos Rápidos

### 1️⃣ Iniciar el Backend

**En IntelliJ IDEA:**
1. Abre el proyecto
2. Navega a: `EcommerceApi/src/main/java/grupo7/ecommerceapi/EcommerceApiApplication.java`
3. Clic derecho → **Run 'EcommerceApiApplication'**
4. Espera a ver: `Started EcommerceApiApplication in X seconds`

**Desde Terminal (alternativa):**
```bash
.\mvnw spring-boot:run -f EcommerceApi/pom.xml
```

### 2️⃣ Iniciar el Frontend

```bash
npm run dev
```

### 3️⃣ Probar los Endpoints

#### Opción A: Script Automatizado en el Navegador (Recomendado)

1. Abre el navegador en: **http://localhost:5173**
2. Presiona **F12** para abrir la consola
3. Copia y pega el contenido de **`src/test-api-endpoints.ts`** en la consola
4. Ejecuta:
   ```javascript
   await testAllEndpoints()
   ```

Verás un reporte completo:
```
🚀 INICIANDO PRUEBAS DE TODOS LOS ENDPOINTS
==================================================
✅ 46 productos obtenidos
✅ 6 categorías obtenidas
✅ 6 usuarios obtenidos
✅ 4 órdenes obtenidas
...
📊 RESUMEN: 6/6 módulos exitosos
🎉 ¡TODAS LAS PRUEBAS PASARON!
```

#### Opción B: Script Batch (Windows)

```bash
.\test-endpoints.bat
```

#### Opción C: Manualmente con Postman/Thunder Client

Ver ejemplos en: **`GUIA_PRUEBAS_ENDPOINTS.md`**

---

## 📊 Endpoints Disponibles

### Productos (10)
```
GET    /api/products
GET    /api/products/{id}
GET    /api/products/category/{name}
GET    /api/products/search?q=...
GET    /api/products/offers
GET    /api/products/low-stock
GET    /api/products/{id}/stock
POST   /api/products
PUT    /api/products/{id}
DELETE /api/products/{id}
```

### Categorías (3)
```
GET /api/categories
GET /api/categories/{id}
GET /api/categories/name/{name}
```

### Usuarios (7)
```
GET    /api/users
GET    /api/users/{id}
GET    /api/users/email/{email}
POST   /api/users/register
POST   /api/users/login
POST   /api/users/check-email
PUT    /api/users/{id}
DELETE /api/users/{id}
```

### Órdenes (5)
```
GET   /api/orders
GET   /api/orders/{id}
GET   /api/orders/user/{userId}
POST  /api/orders
PATCH /api/orders/{id}/status
```

### Carrito (8)
```
GET    /api/cart/{sessionId}
GET    /api/cart/{sessionId}/total
GET    /api/cart/{sessionId}/count
GET    /api/cart/{sessionId}/validate
POST   /api/cart/{sessionId}/add
PUT    /api/cart/{sessionId}/update
DELETE /api/cart/{sessionId}/remove
DELETE /api/cart/{sessionId}/clear
```

### Autenticación (3)
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
```

### Archivos (3)
```
POST   /api/files/upload
GET    /api/files/{fileName}
DELETE /api/files/{fileName}
```

---

## 🎯 Prueba Rápida (curl)

```bash
# Productos
curl http://localhost:8080/api/products

# Categorías
curl http://localhost:8080/api/categories

# Usuarios
curl http://localhost:8080/api/users

# Órdenes
curl http://localhost:8080/api/orders

# Carrito
curl http://localhost:8080/api/cart/test-123

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@demo.com","password":"password123"}'
```

---

## ✅ Verificación Rápida

Abre en tu navegador:

- http://localhost:8080/api/products
- http://localhost:8080/api/categories
- http://localhost:8080/api/users

Si ves JSON, ¡todo funciona! ✨

---

## 🐛 Solución de Problemas

### "Este sitio no se puede alcanzar"
❌ **Problema**: Backend no está corriendo
✅ **Solución**: Inicia el backend en IntelliJ

### "404 Not Found"
❌ **Problema**: URL incorrecta
✅ **Solución**: Verifica que la URL sea `http://localhost:8080/api/...`

### "Empty array []"
❌ **Problema**: Base de datos vacía
✅ **Solución**: Ejecuta `.\limpiar_y_poblar.bat`

---

## 📝 Datos de Prueba

```
Usuario: demo@demo.com
Password: password123

Producto ID: 1 (Camiseta React)
Categoría ID: 1 (Accesorios)
Orden ID: 1
```

---

## 🚀 ¡Listo para Probar!

1. ✅ Backend corriendo en http://localhost:8080
2. ✅ Frontend corriendo en http://localhost:5173
3. ✅ Base de datos poblada con datos de prueba
4. ✅ Servicios TypeScript creados
5. ✅ Script de pruebas listo

**¡Ahora ejecuta el script de pruebas y verifica que todo funcione!** 🎉

