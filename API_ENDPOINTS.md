# 🚀 **ENDPOINTS DE LA API REST**

## 📋 **RESUMEN**
Esta API REST está construida con Spring Boot y proporciona todos los endpoints necesarios para las funcionalidades implementadas en el frontend.

**Base URL:** `http://localhost:3000/api`

---

## 🛍️ **PRODUCTOS**

### **Listar Productos**
- **GET** `/products`
- **Parámetros:**
  - `page` (default: 0) - Número de página
  - `size` (default: 12) - Tamaño de página
  - `sortBy` (default: "id") - Campo para ordenar
  - `sortDir` (default: "asc") - Dirección de ordenamiento

### **Obtener Producto por ID**
- **GET** `/products/{id}`

### **Productos por Categoría**
- **GET** `/products/category/{categoryName}`
- **Parámetros:** `page`, `size`, `sortBy`, `sortDir`

### **Buscar Productos**
- **GET** `/products/search?q={searchTerm}`
- **Parámetros:** `page`, `size`, `sortBy`, `sortDir`

### **Buscar en Categoría Específica**
- **GET** `/products/category/{categoryName}/search?q={searchTerm}`
- **Parámetros:** `page`, `size`, `sortBy`, `sortDir`

### **Productos con Descuento**
- **GET** `/products/offers`
- **Parámetros:** `page`, `size`

### **Productos por Rango de Precio**
- **GET** `/products/price-range?minPrice={min}&maxPrice={max}`
- **Parámetros:** `page`, `size`

### **Ordenar por Nombre**
- **GET** `/products/sort/name?direction={asc|desc}`
- **Parámetros:** `page`, `size`

### **Ordenar por Precio**
- **GET** `/products/sort/price?direction={asc|desc}`
- **Parámetros:** `page`, `size`

### **Crear Producto (Admin)**
- **POST** `/products`
- **Body:** JSON con datos del producto

### **Actualizar Producto (Admin)**
- **PUT** `/products/{id}`
- **Body:** JSON con datos actualizados

### **Eliminar Producto (Admin)**
- **DELETE** `/products/{id}`

### **Verificar Stock**
- **GET** `/products/{id}/stock`

### **Productos con Stock Bajo**
- **GET** `/products/low-stock?threshold={number}`

---

## 📂 **CATEGORÍAS**

### **Listar Categorías**
- **GET** `/categories`

### **Obtener Categoría por ID**
- **GET** `/categories/{id}`

### **Obtener Categoría por Nombre**
- **GET** `/categories/name/{name}`

### **Buscar Categorías**
- **GET** `/categories/search?q={searchTerm}`

### **Crear Categoría (Admin)**
- **POST** `/categories`
- **Body:** JSON con datos de la categoría

### **Actualizar Categoría (Admin)**
- **PUT** `/categories/{id}`
- **Body:** JSON con datos actualizados

### **Eliminar Categoría (Admin)**
- **DELETE** `/categories/{id}`

---

## 🛒 **CARRITO DE COMPRAS**

### **Obtener Items del Carrito**
- **GET** `/cart/{sessionId}`

### **Agregar al Carrito**
- **POST** `/cart/{sessionId}/add`
- **Parámetros:** `productId`, `quantity`, `userId` (opcional)

### **Actualizar Cantidad**
- **PUT** `/cart/{sessionId}/update`
- **Parámetros:** `productId`, `quantity`

### **Quitar del Carrito**
- **DELETE** `/cart/{sessionId}/remove`
- **Parámetros:** `productId`

### **Limpiar Carrito**
- **DELETE** `/cart/{sessionId}/clear`

### **Obtener Total del Carrito**
- **GET** `/cart/{sessionId}/total`

### **Obtener Cantidad de Items**
- **GET** `/cart/{sessionId}/count`

### **Validar Stock del Carrito**
- **GET** `/cart/{sessionId}/validate`

---

## 👤 **USUARIOS**

### **Listar Usuarios (Admin)**
- **GET** `/users`

### **Obtener Usuario por ID**
- **GET** `/users/{id}`

### **Obtener Usuario por Email**
- **GET** `/users/email/{email}`

### **Registrar Usuario**
- **POST** `/users/register`
- **Body:** JSON con datos del usuario

### **Login de Usuario**
- **POST** `/users/login`
- **Body:** JSON con email y password

### **Actualizar Usuario**
- **PUT** `/users/{id}`
- **Body:** JSON con datos actualizados

### **Eliminar Usuario (Admin)**
- **DELETE** `/users/{id}`

### **Verificar Email**
- **POST** `/users/check-email`
- **Body:** JSON con email

---

## 📦 **PEDIDOS**

### **Obtener Pedidos de Usuario**
- **GET** `/orders/user/{userId}`

### **Obtener Pedido por ID**
- **GET** `/orders/{orderId}`

### **Obtener Pedido por Número**
- **GET** `/orders/number/{orderNumber}`

### **Obtener Items de Pedido**
- **GET** `/orders/{orderId}/items`

### **Crear Pedido desde Carrito**
- **POST** `/orders/create-from-cart`
- **Body:** JSON con datos del pedido

### **Actualizar Estado del Pedido**
- **PUT** `/orders/{orderId}/status`
- **Body:** JSON con nuevo estado

### **Obtener Pedidos por Estado**
- **GET** `/orders/status/{status}`

---

## 🔧 **CONFIGURACIÓN**

### **CORS**
- Configurado para permitir requests desde `http://localhost:3000` y `http://localhost:5173`

### **Seguridad**
- Endpoints públicos: productos, categorías, carrito, registro, login
- Autenticación básica deshabilitada para desarrollo

### **Base de Datos**
- MySQL en puerto 3306
- Base de datos: `ecommerce_db`
- Usuario: `root` / Password: `root`

---

## 📝 **FORMATOS DE RESPUESTA**

### **Éxito**
```json
{
  "id": 1,
  "name": "Producto Ejemplo",
  "description": "Descripción del producto",
  "price": 25.50,
  "category": "Tecnología",
  "image": "/images/producto.png",
  "stock": 10,
  "discount": 20.00,
  "createdAt": "2024-01-01T00:00:00",
  "updatedAt": "2024-01-01T00:00:00"
}
```

### **Error**
```json
{
  "error": "Mensaje de error",
  "status": 400,
  "timestamp": "2024-01-01T00:00:00"
}
```

---

## 🚀 **INSTRUCCIONES DE USO**

1. **Ejecutar el script SQL** en MySQL para crear la base de datos
2. **Configurar las credenciales** en `application.properties`
3. **Ejecutar la aplicación** Spring Boot
4. **Probar endpoints** con Postman o integrar con el frontend

---

## ✅ **FUNCIONALIDADES IMPLEMENTADAS**

- ✅ **Autenticación básica** (login/register)
- ✅ **Gestión de productos** (CRUD completo)
- ✅ **Gestión de categorías** (CRUD completo)
- ✅ **Carrito de compras** (agregar, quitar, actualizar)
- ✅ **Gestión de pedidos** (crear, consultar, actualizar estado)
- ✅ **Búsqueda y filtrado** de productos
- ✅ **Paginación** en todas las listas
- ✅ **Validación de stock**
- ✅ **Cálculo de totales** con descuentos

---

## 🎯 **PRÓXIMOS PASOS**

1. **Integrar con el frontend** existente
2. **Implementar autenticación JWT**
3. **Agregar validaciones de seguridad**
4. **Implementar funcionalidades faltantes** (wishlist, reseñas, etc.)
