# 📦 Script de Población de Base de Datos

## 📊 Contenido del Script

El archivo `poblar_base_datos_completa.sql` contiene datos de prueba completos para todo el sistema:

### Datos Incluidos

| Categoría | Cantidad | Detalles |
|-----------|----------|----------|
| 👥 **Usuarios** | 6 | Admin, Juan, María, Carlos, Ana, Demo |
| 📁 **Categorías** | 6 | Accesorios, Decoración, Hogar, Libros, Ropa, Tecnología |
| 📦 **Productos** | 55+ | Distribuidos en todas las categorías |
| 🛒 **Carritos** | 3 | 1 anónimo + 2 de usuarios |
| 📦 **Órdenes** | 4 | Con diferentes estados |
| 📋 **Items** | 12+ | Items en órdenes completadas |
| 📍 **Direcciones** | 8 | 4 de facturación + 4 de envío |

---

## 🚀 Cómo Ejecutar el Script

### Opción 1: Desde Terminal (MySQL CLI)

```bash
# Navegar al directorio del proyecto
cd C:\Users\Gustavo\Documents\GitHub\API-Clases

# Ejecutar el script
mysql -u root -p < db/poblar_base_datos_completa.sql

# Ingresa tu contraseña cuando se solicite
```

### Opción 2: MySQL Workbench

1. Abrir **MySQL Workbench**
2. Conectar a tu servidor local
3. **File** → **Open SQL Script**
4. Seleccionar `db/poblar_base_datos_completa.sql`
5. Hacer clic en el rayo ⚡ para ejecutar

### Opción 3: phpMyAdmin

1. Abrir **phpMyAdmin**
2. Seleccionar la base de datos `ecommerce_db`
3. Ir a la pestaña **Importar**
4. Seleccionar el archivo `poblar_base_datos_completa.sql`
5. Hacer clic en **Continuar**

### Opción 4: DBeaver / DataGrip

1. Abrir el IDE
2. Conectar a tu base de datos
3. Abrir el archivo SQL
4. Ejecutar el script (Ctrl+Enter o botón ejecutar)

---

## 📋 Datos de Prueba Incluidos

### 👥 Usuarios

| Email | Contraseña | Nombre |
|-------|------------|--------|
| admin@ecommerce.com | password123 | Admin Sistema |
| juan.perez@email.com | password123 | Juan Pérez |
| maria.garcia@email.com | password123 | María García |
| carlos.lopez@email.com | password123 | Carlos López |
| ana.martinez@email.com | password123 | Ana Martínez |
| demo@demo.com | password123 | Demo User |

> **Nota:** Todas las contraseñas están hasheadas con BCrypt.

### 📦 Productos Destacados

#### 👕 Ropa (7 productos)
- Camiseta React - $25.50
- Hoodie TypeScript - $45.00 (🔥 Descuento: $40.50)
- Sudadera Node.js - $42.00
- Camiseta Fullstack - $28.00 (🔥 Descuento: $24.00)
- Y más...

#### 💻 Tecnología (14 productos)
- Monitor 24" Full HD - $250.00 (🔥 Descuento: $225.00)
- Teclado Mecánico RGB - $89.99
- Mouse Gaming - $45.00
- Auriculares Bluetooth - $75.00 (🔥 Descuento: $65.00)
- Portátil Gamer - $1,200.00
- Y más...

#### 📚 Libros (4 productos)
- Libro: Python Avanzado - $50.00 (🔥 Descuento: $47.50)
- Guía: Algoritmos - $55.00
- Libro: Machine Learning - $65.00 (🔥 Descuento: $58.00)
- Manual: Seguridad Cibernética - $48.00

#### 🏠 Hogar (9 productos)
- Lámpara LED Escritorio - $35.00
- Silla Ergonómica - $180.00 (🔥 Descuento: $165.00)
- Mesa Escritorio Gaming - $220.00
- Cama Queen Size - $450.00
- Y más...

#### 🎨 Accesorios (8 productos)
- Taza JavaScript - $12.90
- Gorra Negra Tech - $15.00
- Mochila Resistente 20L - $55.00
- Pack Stickers Tech - $8.90 (🔥 Descuento: $6.90)
- Y más...

#### 🎭 Decoración (4 productos)
- Cuadro Decorativo Tech - $28.00
- Set Posters Vintage - $22.00 (🔥 Descuento: $19.00)
- Cuadro Minimalista - $45.00
- Escultura Moderna - $75.00 (🔥 Descuento: $68.00)

### 📦 Órdenes de Ejemplo

| Nº Orden | Usuario | Estado | Total | Fecha |
|----------|---------|--------|-------|-------|
| ORD-2024-001 | Juan Pérez | ✅ Entregada | $145.40 | Hace 15 días |
| ORD-2024-002 | María García | 📦 Enviada | $389.50 | Hace 7 días |
| ORD-2024-003 | Carlos López | ⏳ Procesando | $225.00 | Hace 2 días |
| ORD-2024-004 | Ana Martínez | 🕐 Pendiente | $95.00 | Hoy |

### 🛒 Carritos Activos

1. **Carrito Anónimo** (cart-anonymous-001)
   - Hoodie TypeScript
   - Teclado Mecánico

2. **Carrito de Juan** (cart-user-2)
   - Monitor 24"
   - Mouse Gaming
   - Auriculares Bluetooth

3. **Carrito Demo** (cart-user-6)
   - 2x Camiseta React
   - Taza JavaScript

---

## ✅ Verificación Post-Ejecución

El script incluye consultas de verificación al final que mostrarán:

1. **Resumen de datos insertados** por tabla
2. **Productos por categoría**
3. **Últimos 10 productos**
4. **Órdenes recientes**

Deberías ver un output similar a:

```
=== RESUMEN DE DATOS INSERTADOS ===
Categorías: 6
Usuarios: 6
Productos: 55
Productos Activos: 55
Productos con Descuento: 15
...

¡Base de datos poblada exitosamente!
```

---

## 🔄 Reiniciar Datos

Si quieres limpiar y volver a poblar la base de datos:

```sql
-- 1. Ejecutar primero (limpiar)
DROP DATABASE IF EXISTS ecommerce_db;

-- 2. Ejecutar el esquema
SOURCE db/database_schema.sql;

-- 3. Ejecutar el script de población
SOURCE db/poblar_base_datos_completa.sql;
```

O desde terminal:

```bash
mysql -u root -p -e "DROP DATABASE IF EXISTS ecommerce_db;"
mysql -u root -p < db/database_schema.sql
mysql -u root -p < db/poblar_base_datos_completa.sql
```

---

## 🎯 Datos para Pruebas

### Login en el Frontend

Puedes usar cualquiera de estos usuarios:

```
Email: demo@demo.com
Password: password123

Email: juan.perez@email.com
Password: password123

Email: admin@ecommerce.com
Password: password123
```

### IDs Útiles para Testing

```
Categorías:
1 = Accesorios
2 = Decoración
3 = Hogar
4 = Libros
5 = Ropa
6 = Tecnología

Productos destacados:
1 = Camiseta React
2 = Hoodie TypeScript (con descuento)
19 = Monitor 24" (con descuento)
20 = Teclado Mecánico
27 = Raspberry Pi (con descuento)
```

---

## ⚠️ Notas Importantes

1. **Contraseñas:** Todas las contraseñas están hasheadas con BCrypt con el hash de "password123"
   
2. **Imágenes:** Los productos tienen nombres de imágenes que coinciden con las que están en `public/images/`

3. **Stock:** Todos los productos tienen stock inicial de 5-200 unidades

4. **Descuentos:** ~15 productos tienen descuentos aplicados (campo `discount`)

5. **Foreign Keys:** El script desactiva temporalmente las restricciones de claves foráneas para facilitar la inserción

6. **Timestamps:** Se usan fechas relativas (`NOW()`, `DATE_SUB()`) para que las órdenes tengan fechas realistas

---

## 📊 Estadísticas

```
Total de Datos:
- 6 Categorías
- 6 Usuarios
- 55 Productos
- 15 Productos con descuento
- 4 Órdenes (diferentes estados)
- 12 Items en órdenes
- 3 Carritos activos
- 7 Items en carritos
- 8 Direcciones

Total aproximado: 116 registros
```

---

## 🐛 Solución de Problemas

### Error: "Table doesn't exist"
```bash
# Ejecutar primero el esquema
mysql -u root -p < db/database_schema.sql

# Luego el script de población
mysql -u root -p < db/poblar_base_datos_completa.sql
```

### Error: "Duplicate entry"
```bash
# Limpiar la base de datos primero
mysql -u root -p -e "DROP DATABASE ecommerce_db; CREATE DATABASE ecommerce_db;"

# Volver a crear el esquema y poblar
mysql -u root -p < db/database_schema.sql
mysql -u root -p < db/poblar_base_datos_completa.sql
```

### Error: "Access denied"
```bash
# Verificar usuario y contraseña
mysql -u root -p

# O usar tu usuario específico
mysql -u tu_usuario -p < db/poblar_base_datos_completa.sql
```

---

## 🎉 ¡Listo!

Después de ejecutar el script, tu base de datos estará completamente poblada y lista para:

✅ Probar el frontend con datos reales
✅ Testar los endpoints de la API
✅ Realizar pruebas de órdenes
✅ Probar el sistema de carrito
✅ Verificar la autenticación
✅ Testar búsquedas y filtros

**¡Ahora puedes iniciar el backend y frontend y todo debería funcionar perfectamente!** 🚀

