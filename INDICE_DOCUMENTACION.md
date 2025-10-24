# 📚 Índice de Documentación del Proyecto

## 🚀 Inicio Rápido

| Documento | Descripción |
|-----------|-------------|
| **[COMO_PROBAR_ENDPOINTS.md](COMO_PROBAR_ENDPOINTS.md)** | ⭐ **EMPIEZA AQUÍ** - Guía rápida para probar todos los endpoints |
| **[README.md](README.md)** | Información general del proyecto |

---

## 📦 Base de Datos

| Documento | Descripción |
|-----------|-------------|
| **[RESUMEN_POBLADO_BD.md](RESUMEN_POBLADO_BD.md)** | Resumen de datos insertados en la BD |
| **[db/README_POBLAR_DB.md](db/README_POBLAR_DB.md)** | Guía completa para poblar la base de datos |
| **[db/database_schema.sql](db/database_schema.sql)** | Esquema completo de la base de datos |
| **[db/poblar_base_datos_completa.sql](db/poblar_base_datos_completa.sql)** | Script SQL con todos los datos de prueba |
| **[db/limpiar_datos.sql](db/limpiar_datos.sql)** | Script para limpiar la base de datos |

---

## 🧪 Testing y Pruebas

| Documento | Descripción |
|-----------|-------------|
| **[GUIA_PRUEBAS_ENDPOINTS.md](GUIA_PRUEBAS_ENDPOINTS.md)** | Guía detallada para probar cada endpoint |
| **[src/test-api-endpoints.ts](src/test-api-endpoints.ts)** | Script de pruebas automatizadas |
| **[test-endpoints.bat](test-endpoints.bat)** | Script batch para pruebas rápidas |

---

## 🔧 Correcciones y Configuración

| Documento | Descripción |
|-----------|-------------|
| **[CORRECCIONES_APLICADAS.md](CORRECCIONES_APLICADAS.md)** | Últimas correcciones críticas aplicadas |
| **[CONFIGURACION_FINAL.md](CONFIGURACION_FINAL.md)** | Configuración final del sistema |

---

## 📁 Servicios Frontend (TypeScript)

### Por Módulo

| Módulo | Archivo | Endpoints |
|--------|---------|-----------|
| **Productos** | [product-service.ts](src/features/product/services/product-service.ts) | 10 endpoints |
| **Categorías** | [category-service.ts](src/features/category/services/category-service.ts) | 3 endpoints |
| **Usuarios** | [user-service.ts](src/features/user/services/user-service.ts) | 7 endpoints |
| **Órdenes** | [order-service.ts](src/features/order/services/order-service.ts) | 5 endpoints |
| **Carrito** | [cart-service.ts](src/features/cart/services/cart-service.ts) | 8 endpoints |
| **Autenticación** | [auth-service.ts](src/features/auth/services/auth-service.ts) | 3 endpoints |
| **Archivos** | [upload-service.ts](src/features/product/services/upload-service.ts) | 3 endpoints |

**Total: 39 endpoints cubiertos** ✅

---

## 🔨 Scripts Útiles

### Base de Datos

| Script | Descripción |
|--------|-------------|
| `limpiar_y_poblar.bat` | Limpia y puebla la BD desde cero |
| `ejecutar_sql_sin_password.bat` | Ejecuta scripts SQL sin contraseña |
| `ejecutar_sql.bat` | Ejecuta scripts SQL con contraseña |

### Testing

| Script | Descripción |
|--------|-------------|
| `test-endpoints.bat` | Prueba rápida de todos los endpoints |

---

## 📊 Estructura del Proyecto

```
API-Clases/
├── 📂 db/                          # Scripts de base de datos
│   ├── database_schema.sql         # Esquema completo
│   ├── poblar_base_datos_completa.sql
│   ├── limpiar_datos.sql
│   └── README_POBLAR_DB.md
│
├── 📂 EcommerceApi/                # Backend (Spring Boot)
│   └── src/main/java/grupo7/ecommerceapi/
│       ├── controller/             # 6 controladores REST
│       ├── service/                # Capa de servicios
│       ├── repository/             # Repositorios JPA
│       ├── entity/                 # Entidades JPA
│       ├── exception/              # Excepciones personalizadas
│       ├── dto/                    # Data Transfer Objects
│       └── config/                 # Configuraciones
│
├── 📂 src/                         # Frontend (React + TypeScript)
│   ├── features/
│   │   ├── product/services/       # Servicios de productos
│   │   ├── category/services/      # Servicios de categorías
│   │   ├── user/services/          # Servicios de usuarios
│   │   ├── order/services/         # Servicios de órdenes
│   │   ├── cart/services/          # Servicios de carrito
│   │   └── auth/services/          # Servicios de autenticación
│   │
│   ├── components/                 # Componentes React
│   ├── context/                    # Context API
│   ├── hooks/                      # Custom hooks
│   ├── layouts/                    # Layouts
│   ├── routes/                     # Rutas
│   └── test-api-endpoints.ts      # Script de pruebas
│
└── 📂 public/                      # Archivos públicos
    └── images/                     # Imágenes de productos
```

---

## 🎯 Flujo de Trabajo Recomendado

### 1️⃣ Configuración Inicial (Solo una vez)

1. ✅ Ejecutar `limpiar_y_poblar.bat` para poblar la base de datos
2. ✅ Verificar datos en phpMyAdmin (http://localhost/phpmyadmin)

### 2️⃣ Desarrollo Diario

1. **Iniciar Backend**:
   - IntelliJ → Run `EcommerceApiApplication.java`
   - O: `.\mvnw spring-boot:run -f EcommerceApi/pom.xml`

2. **Iniciar Frontend**:
   ```bash
   npm run dev
   ```

3. **Probar Endpoints** (opcional):
   - Abrir http://localhost:5173
   - F12 → Consola
   - Ejecutar: `await testAllEndpoints()`

### 3️⃣ Testing

1. Ver **[COMO_PROBAR_ENDPOINTS.md](COMO_PROBAR_ENDPOINTS.md)**
2. Usar **[test-api-endpoints.ts](src/test-api-endpoints.ts)** en la consola
3. O usar Postman con ejemplos de **[GUIA_PRUEBAS_ENDPOINTS.md](GUIA_PRUEBAS_ENDPOINTS.md)**

---

## 🔗 Enlaces Útiles

| Recurso | URL |
|---------|-----|
| **Frontend** | http://localhost:5173 |
| **Backend API** | http://localhost:8080/api |
| **phpMyAdmin** | http://localhost/phpmyadmin |
| **Productos** | http://localhost:8080/api/products |
| **Categorías** | http://localhost:8080/api/categories |
| **Usuarios** | http://localhost:8080/api/users |

---

## 👥 Usuarios de Prueba

```
Email: demo@demo.com
Password: password123

Email: admin@ecommerce.com
Password: password123

Email: juan.perez@email.com
Password: password123
```

---

## 📈 Estadísticas del Proyecto

```
Backend:
  - 6 Controladores REST
  - 39 Endpoints
  - 10 Entidades JPA
  - 10 Repositorios
  - 8 Servicios

Frontend:
  - 7 Servicios TypeScript
  - 39 Endpoints integrados
  - 100% de cobertura

Base de Datos:
  - 10 Tablas
  - 6 Categorías
  - 6 Usuarios
  - 46 Productos
  - 4 Órdenes de ejemplo
  - 3 Carritos activos

Total: ~116 registros de prueba
```

---

## 🐛 Solución de Problemas

Ver documentos específicos:
- **Backend no inicia**: [CONFIGURACION_FINAL.md](CONFIGURACION_FINAL.md)
- **Errores de endpoints**: [CORRECCIONES_APLICADAS.md](CORRECCIONES_APLICADAS.md)
- **Base de datos vacía**: [db/README_POBLAR_DB.md](db/README_POBLAR_DB.md)
- **Pruebas fallan**: [COMO_PROBAR_ENDPOINTS.md](COMO_PROBAR_ENDPOINTS.md)

---

## 📝 Últimas Actualizaciones

1. ✅ **Servicios completos creados** (39 endpoints)
2. ✅ **Base de datos poblada** (116 registros)
3. ✅ **Script de pruebas automatizado**
4. ✅ **Correcciones críticas aplicadas**
5. ✅ **Documentación completa**

---

## 🎉 Estado del Proyecto

```
✅ Backend: 100% funcional
✅ Frontend: 100% funcional
✅ Base de Datos: Poblada
✅ Servicios: 100% implementados
✅ Documentación: Completa
✅ Pruebas: Automatizadas

🚀 PROYECTO LISTO PARA DESARROLLO
```

---

## 🔍 Búsqueda Rápida

### ¿Necesitas...?

- **¿Cómo probar endpoints?** → [COMO_PROBAR_ENDPOINTS.md](COMO_PROBAR_ENDPOINTS.md)
- **¿Poblar la base de datos?** → [db/README_POBLAR_DB.md](db/README_POBLAR_DB.md)
- **¿Ver endpoints disponibles?** → [GUIA_PRUEBAS_ENDPOINTS.md](GUIA_PRUEBAS_ENDPOINTS.md)
- **¿Usuarios de prueba?** → [RESUMEN_POBLADO_BD.md](RESUMEN_POBLADO_BD.md)
- **¿Configuración final?** → [CONFIGURACION_FINAL.md](CONFIGURACION_FINAL.md)
- **¿Correcciones aplicadas?** → [CORRECCIONES_APLICADAS.md](CORRECCIONES_APLICADAS.md)

---

**Última actualización**: ${new Date().toLocaleDateString('es-ES')}

**¡Todo listo para empezar a desarrollar!** 🚀

