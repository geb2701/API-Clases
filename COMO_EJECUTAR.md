# 🚀 Cómo Ejecutar tu Proyecto Integrado

## ✅ Backend y Frontend Están INTEGRADOS

Tu frontend React está conectado al backend Spring Boot que acabo de crear.

---

## 📋 Pre-requisitos

1. ✅ **Java 17** (ya lo tienes instalado en IntelliJ)
2. ✅ **MySQL** corriendo
3. ✅ **Node.js** para el frontend

---

## 🗄️ Paso 1: Configurar la Base de Datos

### Crear la base de datos:
```sql
CREATE DATABASE ecommerce_db;
```

O desde PowerShell:
```powershell
mysql -u root -p -e "CREATE DATABASE ecommerce_db;"
```

### Configurar contraseña (si es necesaria):
Edita `src/main/resources/application.properties`:
```properties
spring.datasource.password=TU_PASSWORD
```

---

## ▶️ Paso 2: Ejecutar el Backend

### Desde IntelliJ IDEA:

1. **Abre IntelliJ**
2. **File → Open** → Selecciona tu proyecto
3. Espera a que descargue dependencias (2-3 min)
4. Busca: `src/main/java/com/ecommerce/EcommerceApiApplication.java`
5. **Click derecho → Run**

✅ Deberías ver en la consola:
```
Tomcat started on port(s): 8080 (http) with context path '/api'
```

### Verificar que funciona:
```powershell
curl http://localhost:8080/api/products
```

Respuesta esperada:
```json
{
  "content": [],
  "totalElements": 0,
  "totalPages": 0,
  "size": 12,
  "number": 0
}
```

---

## 🎨 Paso 3: Ejecutar el Frontend

En una nueva terminal:
```powershell
npm run dev
# o
pnpm dev
```

Abre: http://localhost:5173

---

## 🎯 Verificación Completa

### Test 1: Ver productos (vacío por ahora)
1. Abre http://localhost:5173
2. Deberías ver la página home (vacía)
3. DevTools → Network: verás `GET http://localhost:8080/api/products` (Status 200)

### Test 2: Crear un producto
Usa Postman o curl:
```powershell
curl -X POST http://localhost:8080/api/products `
  -H "Content-Type: application/json" `
  -d '{
    "name": "Camiseta React",
    "description": "Camiseta cómoda con logo React",
    "price": 25.50,
    "category": "Ropa",
    "image": "/images/camiseta-react.png",
    "stock": 10
  }'
```

### Test 3: Ver el producto en el frontend
1. Recarga http://localhost:5173
2. ¡Deberías ver el producto!

---

## ⚠️ IMPORTANTE: Autenticación

Tu frontend actual usa **autenticación MOCK** (no conectada al backend).

**Estado actual**:
- ✅ Productos: Funcionan con el backend
- ⚠️ Login/Registro: Son MOCK (localStorage)
- ✅ Carrito: Local (localStorage) como querías

Si quieres conectar también la autenticación al backend, avísame.

---

## 🐛 Solución de Problemas

### Error: "Port 8080 already in use"
Cambia el puerto en `application.properties`:
```properties
server.port=3000
```
Y en el frontend (`src/lib/generic-ky-client.ts`):
```typescript
prefixUrl: "http://localhost:3000/api/"
```

### Error: "Access denied for user"
Verifica la contraseña de MySQL en `application.properties`

### Frontend muestra error de CORS
Verifica que el backend esté corriendo en puerto 8080

### No aparecen productos
Usa el script SQL o crea productos manualmente (ver Test 2 arriba)

---

## 📊 Estructura del Proyecto

```
Backend (Java):
src/main/java/com/ecommerce/
├── EcommerceApiApplication.java    ← Clase principal
├── controller/
│   └── ProductController.java      ← Endpoints REST
├── entity/
│   └── Product.java                ← Modelo de datos
├── repository/
│   └── ProductRepository.java      ← Acceso a DB
├── service/
│   └── ProductService.java         ← Lógica de negocio
└── config/
    └── SecurityConfig.java         ← Seguridad (deshabilitada)

Frontend (React):
src/
├── features/product/
│   ├── services/product-service.ts  ← Llama al backend
│   └── pages/...                    ← UI
└── lib/
    └── generic-ky-client.ts         ← Cliente HTTP
```

---

## 🎊 ¡Todo Listo!

Tienes:
- ✅ Backend Spring Boot en puerto 8080
- ✅ Frontend React conectado
- ✅ Paginación funcionando
- ✅ CRUD de productos
- ✅ Base de datos MySQL

**Próximo paso**: Crear algunos productos y empezar a desarrollar!

