# 🚀 **INSTRUCCIONES DE CONFIGURACIÓN**

## 📋 **PASOS PARA CONFIGURAR LA API**

### **1️⃣ CONFIGURAR MYSQL**

1. **Instalar MySQL** (si no está instalado)
2. **Crear la base de datos:**
   ```sql
   CREATE DATABASE ecommerce_db;
   ```
3. **Ejecutar el script SQL:**
   ```bash
   mysql -u root -p ecommerce_db < database_schema.sql
   ```

### **2️⃣ CONFIGURAR CREDENCIALES**

Editar `src/main/resources/application.properties`:
```properties
# Cambiar las credenciales según tu configuración
spring.datasource.username=root
spring.datasource.password=tu_password_aqui
```

### **3️⃣ COMPILAR Y EJECUTAR**

```bash
# Compilar el proyecto
mvn clean compile

# Ejecutar la aplicación
mvn spring-boot:run
```

### **4️⃣ VERIFICAR QUE FUNCIONA**

La API estará disponible en: `http://localhost:3000/api`

**Endpoint de prueba:**
```bash
curl http://localhost:3000/api/products
```

---

## 🧪 **PRUEBAS CON POSTMAN**

### **Colección de Pruebas Básicas:**

1. **GET** `http://localhost:3000/api/products` - Listar productos
2. **GET** `http://localhost:3000/api/categories` - Listar categorías
3. **POST** `http://localhost:3000/api/users/register` - Registrar usuario
4. **POST** `http://localhost:3000/api/users/login` - Login usuario
5. **POST** `http://localhost:3000/api/cart/session123/add?productId=1&quantity=2` - Agregar al carrito

---

## 🔗 **INTEGRACIÓN CON FRONTEND**

### **Cambiar la URL base en el frontend:**

En `src/lib/generic-ky-client.ts`:
```typescript
export const apiClient = ky.create({
	prefixUrl: "http://localhost:3000/api/", // Agregar /api/
	credentials: "include",
	timeout: 15000,
});
```

### **Actualizar servicios del frontend:**

Cambiar las URLs en los servicios para usar los endpoints reales:
- `productos.json` → `/products`
- Agregar autenticación real
- Implementar manejo de errores

---

## 🐛 **SOLUCIÓN DE PROBLEMAS**

### **Error de conexión a MySQL:**
- Verificar que MySQL esté ejecutándose
- Verificar credenciales en `application.properties`
- Verificar que la base de datos existe

### **Error de CORS:**
- Verificar que las URLs del frontend estén en la configuración CORS
- Verificar que el frontend esté ejecutándose en el puerto correcto

### **Error de compilación:**
- Verificar que Java 17 esté instalado
- Verificar que Maven esté configurado correctamente

---

## 📊 **ESTRUCTURA DEL PROYECTO**

```
src/main/java/com/ecommerce/
├── config/          # Configuraciones (CORS, Security)
├── controller/      # Controladores REST
├── entity/          # Entidades JPA
├── repository/      # Repositorios
├── service/         # Servicios de negocio
└── EcommerceApiApplication.java

src/main/resources/
└── application.properties

database_schema.sql  # Script de base de datos
pom.xml             # Dependencias Maven
```

---

## 🎯 **PRÓXIMOS PASOS**

1. **Probar todos los endpoints** con Postman
2. **Integrar con el frontend** existente
3. **Implementar autenticación JWT**
4. **Agregar validaciones de seguridad**
5. **Implementar funcionalidades faltantes**

---

## ✅ **VERIFICACIÓN FINAL**

La API está lista cuando:
- ✅ MySQL está configurado y ejecutándose
- ✅ La base de datos está creada con datos de prueba
- ✅ La aplicación Spring Boot inicia sin errores
- ✅ Los endpoints responden correctamente
- ✅ CORS está configurado para el frontend
