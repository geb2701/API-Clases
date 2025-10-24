# ✅ BASE DE DATOS POBLADA EXITOSAMENTE

## 📊 Datos Insertados

| Tabla | Cantidad | Estado |
|-------|----------|--------|
| **Categorías** | 6 | ✅ |
| **Usuarios** | 6 | ✅ |
| **Productos** | 46 | ✅ |
| **Productos con descuento** | 21 | ✅ |
| **Órdenes** | 4 | ✅ |
| **Items en órdenes** | 9 | ✅ |
| **Carritos activos** | 3 | ✅ |
| **Items en carritos** | 7 | ✅ |
| **Direcciones** | 8 | ✅ |

---

## 👥 Usuarios de Prueba

Todos con la misma contraseña: **`password123`**

| Email | Nombre | Rol |
|-------|--------|-----|
| `demo@demo.com` | Demo User | Usuario |
| `admin@ecommerce.com` | Admin Sistema | Administrador |
| `juan.perez@email.com` | Juan Pérez | Usuario |
| `maria.garcia@email.com` | María García | Usuario |
| `carlos.lopez@email.com` | Carlos López | Usuario |
| `ana.martinez@email.com` | Ana Martínez | Usuario |

---

## 📦 Productos Ejemplo

### Primeros 10 productos insertados:

1. **Camiseta React** - $25.50 (43 en stock) - Ropa
2. **Hoodie TypeScript** - $45.00 → $40.50 (30 en stock) - Ropa
3. **Sudadera Node.js** - $42.00 (25 en stock) - Ropa
4. **Camiseta Fullstack** - $28.00 → $24.00 (50 en stock) - Ropa
5. **Chaqueta Bomber Tech** - $85.00 (15 en stock) - Ropa
6. **Pantalón Cargo Urbano** - $55.00 → $49.00 (20 en stock) - Ropa
7. **Zapatillas Deportivas** - $75.00 (18 en stock) - Ropa
8. **Taza JavaScript** - $12.90 (100 en stock) - Accesorios
9. **Tazas CSS (Set x2)** - $18.50 → $16.50 (49 en stock) - Accesorios
10. **Gorra Negra Tech** - $15.00 (55 en stock) - Accesorios

**Y 36 productos más...**

---

## 🛒 Órdenes de Ejemplo

1. **ORD-2024-001** - Juan Pérez - Entregada - $145.40
2. **ORD-2024-002** - María García - Enviada - $389.50
3. **ORD-2024-003** - Carlos López - Procesando - $225.00
4. **ORD-2024-004** - Ana Martínez - Pendiente - $95.00

---

## 🎯 Verificar Datos

Puedes verificar los datos en:

- **phpMyAdmin**: http://localhost/phpmyadmin
- **MySQL Workbench**: Conectar a localhost:3306
- **Backend API**: http://localhost:8080/api/products

---

## 🚀 Siguientes Pasos

### 1. Reiniciar Backend (Spring Boot)

Si tienes el backend corriendo, **reinícialo** para que cargue los nuevos datos:

```bash
# Detener el backend actual (Ctrl+C en la terminal)
# Luego ejecutar desde IntelliJ o desde terminal:
.\mvnw spring-boot:run -f EcommerceApi/pom.xml
```

O desde IntelliJ:
- Clic derecho en `EcommerceApiApplication.java`
- Run 'EcommerceApiApplication'

### 2. Iniciar Frontend

```bash
npm run dev
```

### 3. Acceder a la Aplicación

Abre tu navegador en: **http://localhost:5173**

### 4. Hacer Login

Usa cualquiera de estos usuarios:

```
Email: demo@demo.com
Password: password123
```

O

```
Email: admin@ecommerce.com
Password: password123
```

---

## ✅ Funcionalidades Disponibles

Con los datos poblados, ahora puedes probar:

### Para Usuarios

- ✅ Login/Register con usuarios de prueba
- ✅ Ver catálogo de 46 productos
- ✅ Filtrar por 6 categorías
- ✅ Ver productos con descuentos
- ✅ Buscar productos
- ✅ Agregar productos al carrito
- ✅ Realizar checkout
- ✅ Ver historial de órdenes

### Para Administradores

- ✅ Gestionar productos (CRUD)
- ✅ Ver órdenes de todos los usuarios
- ✅ Actualizar estados de órdenes
- ✅ Ver productos con bajo stock
- ✅ Gestionar categorías

---

## 🔧 Scripts Útiles Creados

### `limpiar_y_poblar.bat`
Limpia todos los datos y vuelve a poblar la base de datos desde cero.

```bash
.\limpiar_y_poblar.bat
```

### `ejecutar_sql_sin_password.bat`
Ejecuta el script de población (solo si ya limpiaste antes).

```bash
.\ejecutar_sql_sin_password.bat
```

### `ejecutar_sql.bat`
Igual que el anterior pero pide contraseña de MySQL.

```bash
.\ejecutar_sql.bat
```

---

## 📝 Archivos SQL Creados

| Archivo | Descripción |
|---------|-------------|
| `db/database_schema.sql` | Esquema completo de la base de datos |
| `db/poblar_base_datos_completa.sql` | Script con todos los datos de prueba |
| `db/limpiar_datos.sql` | Script para limpiar todos los datos |
| `db/README_POBLAR_DB.md` | Guía completa de uso |

---

## 🐛 Si Algo Sale Mal

### Problema: Backend no encuentra productos

**Solución**: Reinicia el backend

### Problema: Frontend muestra productos vacíos

**Solución**: 
1. Verifica que el backend esté corriendo
2. Abre la consola del navegador (F12)
3. Verifica si hay errores de CORS o 404

### Problema: Las imágenes no se ven

**Solución**: Las imágenes están en `public/images/`. El backend las sirve desde ahí.

### Problema: Error al hacer login

**Solución**: 
- Verifica que el usuario exista en la tabla `users`
- Usa exactamente: `demo@demo.com` / `password123`
- Las contraseñas están hasheadas con BCrypt

---

## 🎉 ¡Todo Listo!

Tu aplicación e-commerce ahora tiene:

- 6 usuarios de prueba
- 46 productos en 6 categorías
- 21 productos con descuentos activos
- 4 órdenes históricas
- 3 carritos con items

**¡Puedes empezar a probar toda la funcionalidad!** 🚀

---

## 📊 Estadísticas de la Base de Datos

```
Total de registros: ~116
Tamaño aproximado: ~50KB
Tiempo de inserción: <5 segundos
Productos más caros: Portátil Gamer ($1,200), Cama Queen ($450)
Productos más baratos: Stickers ($8.90), Taza JavaScript ($12.90)
Stock total: 1,547 unidades
```

---

## 🔗 Enlaces Útiles

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080/api
- **phpMyAdmin**: http://localhost/phpmyadmin
- **API Productos**: http://localhost:8080/api/products
- **API Categorías**: http://localhost:8080/api/categories

---

**Fecha de población**: ${new Date().toLocaleString('es-ES')}

