# 🔍 Revisión Completa de Endpoints del Backend

## 📊 Resumen de Controladores Encontrados

1. ✅ **ProductController** - 14 endpoints
2. ✅ **CategoryController** - 7 endpoints
3. ✅ **OrderController** - 7 endpoints
4. ✅ **UserController** - 7 endpoints
5. ✅ **CartController** - 8 endpoints
6. ❌ **FileUploadController** - NO ENCONTRADO

**Total: 43 endpoints**

---

## 🚨 PROBLEMAS CRÍTICOS ENCONTRADOS

### 1. ❌ **FALTA `FileUploadController`**

**Problema:** El sistema necesita subir imágenes, pero NO existe el controlador de archivos.

**Impacto:** 
- Las imágenes de productos no se pueden subir
- El frontend llama a `/api/files/upload` pero el endpoint NO existe

**Solución Necesaria:**
```java
@RestController
@RequestMapping("/files")
public class FileUploadController {
    @PostMapping("/upload")
    public ResponseEntity<FileUploadResponse> uploadFile(...) { ... }
    
    @GetMapping("/{fileName}")
    public ResponseEntity<Resource> downloadFile(...) { ... }
    
    @DeleteMapping("/{fileName}")
    public ResponseEntity<Void> deleteFile(...) { ... }
}
```

---

### 2. ⚠️ **Manejo de Errores Genérico**

**Problema:** Todos los controladores devuelven `400 Bad Request` genérico sin mensaje.

**Ejemplos:**
```java
// ❌ ProductController
catch (Exception e) {
    return ResponseEntity.badRequest().build(); // Sin mensaje!
}

// ❌ CategoryController
catch (Exception e) {
    return ResponseEntity.badRequest().build(); // Sin mensaje!
}

// ❌ UserController
catch (RuntimeException e) {
    return ResponseEntity.badRequest().build(); // Sin mensaje!
}
```

**Impacto:**
- El frontend no sabe qué salió mal
- Dificulta el debugging
- Mala experiencia de usuario

**Solución Recomendada:**
```java
// ✅ Mejorado
catch (Exception e) {
    return ResponseEntity.badRequest()
        .body(new ErrorResponse(e.getMessage()));
}

// O mejor aún, usar @ExceptionHandler
@ExceptionHandler(ProductNotFoundException.class)
public ResponseEntity<ErrorResponse> handleProductNotFound(ProductNotFoundException e) {
    return ResponseEntity.status(404)
        .body(new ErrorResponse("Producto no encontrado: " + e.getMessage()));
}
```

---

### 3. ⚠️ **Endpoints Redundantes en `ProductController`**

**Problema:** Existen endpoints específicos que duplican funcionalidad.

#### Redundancia 1: Ordenamiento
```java
// ❌ Endpoints redundantes
GET /api/products/sort/name?direction=asc
GET /api/products/sort/price?direction=desc

// ✅ Ya existe esto (más flexible):
GET /api/products?sortBy=name&sortDir=asc
GET /api/products?sortBy=price&sortDir=desc
```

**Recomendación:** Eliminar `/sort/name` y `/sort/price`, usar solo el endpoint principal.

---

### 4. ⚠️ **Falta de Validación de Parámetros**

**Ejemplos:**

#### ProductController - `price-range`
```java
// ❌ Sin validación
@GetMapping("/price-range")
public ResponseEntity<Page<Product>> getProductsByPriceRange(
    @RequestParam BigDecimal minPrice,
    @RequestParam BigDecimal maxPrice, ...) {
    
    // ¿Qué pasa si minPrice > maxPrice?
    // ¿Qué pasa si son negativos?
}
```

**Solución:**
```java
// ✅ Con validación
if (minPrice.compareTo(maxPrice) > 0) {
    throw new IllegalArgumentException("minPrice debe ser <= maxPrice");
}
if (minPrice.compareTo(BigDecimal.ZERO) < 0) {
    throw new IllegalArgumentException("minPrice no puede ser negativo");
}
```

#### OrderController - `create-from-cart`
```java
// ❌ Sin validaciones
@PostMapping("/create-from-cart")
public ResponseEntity<Order> createOrderFromCart(@RequestBody CreateOrderRequest request) {
    // No valida si sessionId existe
    // No valida si userId es válido
    // No valida si el carrito está vacío
}
```

---

### 5. ⚠️ **CORS Duplicado en Cada Controlador**

**Problema:** Cada controlador tiene su propia configuración CORS.

```java
// ❌ Repetido en TODOS los controladores
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5173" })
```

**Problemas:**
- Si cambias el puerto, hay que actualizarlo en 5+ archivos
- Inconsistencias potenciales

**Solución Recomendada:**
```java
// ✅ Configuración global en SecurityConfig
@Configuration
public class SecurityConfig {
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of(
            "http://localhost:5173",
            "http://localhost:3000"
        ));
        configuration.setAllowedMethods(List.of("*"));
        configuration.setAllowedHeaders(List.of("*"));
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
```

Luego **eliminar** `@CrossOrigin` de TODOS los controladores.

---

### 6. ⚠️ **DTOs Internos en Controladores**

**Problema:** Los DTOs (Data Transfer Objects) están dentro de los controladores.

```java
// ❌ En OrderController
public static class CreateOrderRequest { ... }
public static class UpdateStatusRequest { ... }

// ❌ En UserController
public static class LoginRequest { ... }
public static class EmailCheckRequest { ... }
```

**Problemas:**
- Dificulta la reutilización
- Viola principio de responsabilidad única
- No se pueden validar con `@Valid` correctamente

**Solución:**
```
src/main/java/grupo7/ecommerceapi/
├── controller/
├── dto/
│   ├── request/
│   │   ├── CreateOrderRequest.java
│   │   ├── UpdateStatusRequest.java
│   │   ├── LoginRequest.java
│   │   └── EmailCheckRequest.java
│   └── response/
│       ├── OrderResponse.java
│       ├── UserResponse.java
│       └── ErrorResponse.java
```

---

### 7. ⚠️ **Exponer Contraseñas en Respuestas**

**PROBLEMA CRÍTICO DE SEGURIDAD:**

```java
// ❌ UserController
@PostMapping("/login")
public ResponseEntity<User> loginUser(...) {
    Optional<User> user = userService.login(...);
    return user.map(ResponseEntity::ok) // ¡Devuelve User con password!
}
```

**Impacto:**
- La contraseña (incluso hasheada) se envía al frontend
- Exposición de datos sensibles

**Solución:**
```java
// ✅ User entity
@JsonIgnore
private String password;

// O mejor, usar DTOs
public class UserResponse {
    private Long id;
    private String name;
    private String email;
    // Sin password!
}
```

---

### 8. ⚠️ **Respuestas HTTP Incorrectas**

#### Problema 1: Crear con `200 OK`
```java
// ❌ ProductController
@PostMapping
public ResponseEntity<Product> createProduct(...) {
    Product createdProduct = productService.createProduct(product);
    return ResponseEntity.ok(createdProduct); // Debería ser 201 Created
}
```

**Corrección:**
```java
// ✅ Correcto
return ResponseEntity.status(HttpStatus.CREATED)
    .body(createdProduct);
```

#### Problema 2: `400` cuando debería ser `409 Conflict`
```java
// ❌ CategoryController
if (categoryService.existsByName(category.getName())) {
    return ResponseEntity.badRequest().build(); // Debería ser 409
}
```

**Corrección:**
```java
// ✅ Correcto
return ResponseEntity.status(HttpStatus.CONFLICT)
    .body(new ErrorResponse("La categoría ya existe"));
```

---

### 9. ⚠️ **Falta de Paginación Consistente**

**Problema:** Algunos endpoints tienen paginación, otros no.

```java
// ❌ Sin paginación
@GetMapping("/low-stock")
public ResponseEntity<List<Product>> getLowStockProducts(...) {
    List<Product> products = ...
    return ResponseEntity.ok(products); // ¿Y si hay 10,000 productos?
}

// ✅ Con paginación
@GetMapping
public ResponseEntity<Page<Product>> getAllProducts(Pageable pageable) {
    ...
}
```

**Recomendación:** Todos los endpoints que devuelven listas deberían soportar paginación.

---

### 10. ⚠️ **Falta AuthController**

**Problema:** La autenticación está en `UserController` mezclada con gestión de usuarios.

```java
// ❌ En UserController
@PostMapping("/register")
@PostMapping("/login")
```

**Recomendación:** Separar en `AuthController`:
```
/api/auth/register
/api/auth/login
/api/auth/logout
/api/auth/refresh
```

Y dejar en `UserController` solo:
```
/api/users          (GET, gestión)
/api/users/{id}     (GET, PUT, DELETE)
```

---

## 📋 LISTA COMPLETA DE ENDPOINTS

### ProductController (14 endpoints)

| Método | Endpoint | Estado | Notas |
|--------|----------|--------|-------|
| GET | `/products` | ✅ | Principal, con paginación |
| GET | `/products/{id}` | ✅ | OK |
| GET | `/products/category/{categoryName}` | ✅ | OK |
| GET | `/products/search?q=...` | ✅ | OK |
| GET | `/products/category/{cat}/search?q=...` | ✅ | OK |
| GET | `/products/offers` | ✅ | OK |
| GET | `/products/price-range?min&max` | ⚠️ | Falta validación |
| GET | `/products/sort/name` | ❌ | **REDUNDANTE** |
| GET | `/products/sort/price` | ❌ | **REDUNDANTE** |
| POST | `/products` | ⚠️ | Devuelve 200 en vez de 201 |
| PUT | `/products/{id}` | ✅ | OK |
| DELETE | `/products/{id}` | ✅ | Soft delete OK |
| GET | `/products/{id}/stock` | ✅ | OK |
| GET | `/products/low-stock?threshold` | ⚠️ | Sin paginación |

### CategoryController (7 endpoints)

| Método | Endpoint | Estado | Notas |
|--------|----------|--------|-------|
| GET | `/categories` | ✅ | OK |
| GET | `/categories/{id}` | ✅ | OK |
| GET | `/categories/name/{name}` | ✅ | OK |
| GET | `/categories/search?q=...` | ✅ | OK |
| POST | `/categories` | ⚠️ | Devuelve 400 en vez de 409 |
| PUT | `/categories/{id}` | ✅ | OK |
| DELETE | `/categories/{id}` | ✅ | Soft delete OK |

### OrderController (7 endpoints)

| Método | Endpoint | Estado | Notas |
|--------|----------|--------|-------|
| GET | `/orders/user/{userId}` | ✅ | OK |
| GET | `/orders/{orderId}` | ✅ | OK |
| GET | `/orders/number/{orderNumber}` | ✅ | OK |
| GET | `/orders/{orderId}/items` | ✅ | OK |
| POST | `/orders/create-from-cart` | ⚠️ | Falta validación |
| PUT | `/orders/{orderId}/status` | ✅ | OK |
| GET | `/orders/status/{status}` | ✅ | OK |

### UserController (7 endpoints)

| Método | Endpoint | Estado | Notas |
|--------|----------|--------|-------|
| GET | `/users` | ⚠️ | Debería ser solo Admin |
| GET | `/users/{id}` | ⚠️ | Sin control de acceso |
| GET | `/users/email/{email}` | ⚠️ | Expone datos sensibles |
| POST | `/users/register` | ⚠️ | Debería estar en `/auth` |
| POST | `/users/login` | 🚨 | **EXPONE PASSWORD** |
| PUT | `/users/{id}` | ⚠️ | Sin validación de permisos |
| DELETE | `/users/{id}` | ⚠️ | Debería ser solo Admin |
| POST | `/users/check-email` | ✅ | OK |

### CartController (8 endpoints)

| Método | Endpoint | Estado | Notas |
|--------|----------|--------|-------|
| GET | `/cart/{sessionId}` | ✅ | OK |
| POST | `/cart/{sessionId}/add` | ✅ | OK |
| PUT | `/cart/{sessionId}/update` | ✅ | OK |
| DELETE | `/cart/{sessionId}/remove` | ✅ | OK |
| DELETE | `/cart/{sessionId}/clear` | ✅ | OK |
| GET | `/cart/{sessionId}/total` | ✅ | OK |
| GET | `/cart/{sessionId}/count` | ✅ | OK |
| GET | `/cart/{sessionId}/validate` | ✅ | OK |

### FileUploadController ❌ **FALTA CREAR**

| Método | Endpoint | Estado | Notas |
|--------|----------|--------|-------|
| POST | `/files/upload` | ❌ | **NO EXISTE** |
| GET | `/files/{fileName}` | ❌ | **NO EXISTE** |
| DELETE | `/files/{fileName}` | ❌ | **NO EXISTE** |

---

## 🎯 PRIORIDADES DE CORRECCIÓN

### 🚨 CRÍTICO (Arreglar YA)

1. ❌ **Crear `FileUploadController`** - Sin esto, no se pueden subir imágenes
2. 🚨 **Agregar `@JsonIgnore` a User.password** - Seguridad crítica
3. ⚠️ **Separar autenticación en `AuthController`**

### ⚠️ IMPORTANTE (Arreglar pronto)

4. ⚠️ **Mejorar manejo de errores** - Devolver mensajes útiles
5. ⚠️ **Eliminar endpoints redundantes** (`/sort/name`, `/sort/price`)
6. ⚠️ **Mover DTOs a paquete separado**
7. ⚠️ **Centralizar configuración CORS**

### 💡 MEJORA (Cuando se pueda)

8. 💡 Validaciones de parámetros
9. 💡 Códigos HTTP correctos (201 para crear, 409 para conflictos)
10. 💡 Paginación en todos los endpoints de listas
11. 💡 Control de acceso/autorización

---

## 📁 Estructura Recomendada

```
EcommerceApi/src/main/java/grupo7/ecommerceapi/
├── controller/
│   ├── AuthController.java         ← NUEVO (separar de User)
│   ├── CartController.java         ← OK
│   ├── CategoryController.java     ← Mejorar errores
│   ├── FileUploadController.java   ← ❌ CREAR
│   ├── OrderController.java        ← OK
│   ├── ProductController.java      ← Eliminar redundantes
│   └── UserController.java         ← Mover auth a AuthController
├── dto/
│   ├── request/                    ← NUEVO
│   │   ├── CreateOrderRequest.java
│   │   ├── LoginRequest.java
│   │   └── ...
│   └── response/                   ← NUEVO
│       ├── UserResponse.java
│       ├── ErrorResponse.java
│       └── ...
├── entity/
├── repository/
├── service/
├── config/
│   └── GlobalExceptionHandler.java ← NUEVO
└── exception/                      ← NUEVO
    ├── ProductNotFoundException.java
    ├── CategoryAlreadyExistsException.java
    └── ...
```

---

## ✅ ENDPOINTS QUE ESTÁN BIEN

- ✅ CartController - Bien diseñado
- ✅ Paginación en ProductController (endpoint principal)
- ✅ Soft deletes en Product y Category
- ✅ Búsqueda con query params
- ✅ OrderController estructura general

---

## 📊 RESUMEN FINAL

| Categoría | Cantidad |
|-----------|----------|
| ✅ Endpoints OK | 28 |
| ⚠️ Endpoints con issues menores | 12 |
| 🚨 Endpoints con issues críticos | 3 |
| ❌ Endpoints faltantes | 3 |
| **TOTAL** | **46** |

---

## 🚀 PRÓXIMOS PASOS

1. ❌ **Crear FileUploadController** (crítico)
2. 🚨 **Ocultar password en respuestas** (seguridad)
3. ⚠️ **Crear GlobalExceptionHandler** (mejor UX)
4. ⚠️ **Separar AuthController** (mejor organización)
5. 💡 **Eliminar endpoints redundantes** (limpieza)

---

¿Quieres que implemente alguna de estas correcciones? Recomiendo empezar por las **CRÍTICAS** 🚨

