# Sistema de Almacenamiento de Imágenes

## Descripción General

El sistema ahora guarda las imágenes de los productos en el servidor en lugar de usar URLs externas. Las imágenes se almacenan localmente y se sirven a través de endpoints del backend.

## Backend - Almacenamiento de Archivos

### 📁 Ubicación de las Imágenes

Las imágenes se guardan en: `uploads/images/` (configurable en `application.properties`)

### 🔧 Componentes del Backend

#### 1. FileStorageService (`src/main/java/com/ecommerce/service/FileStorageService.java`)

Servicio que maneja el almacenamiento de archivos:

**Funciones principales:**
- `storeFile(MultipartFile file)` - Guarda un archivo y devuelve el nombre único generado
- `loadFileAsResource(String fileName)` - Carga un archivo como Resource
- `deleteFile(String fileName)` - Elimina un archivo del servidor

**Características:**
- Genera nombres únicos usando UUID para evitar colisiones
- Valida nombres de archivo para evitar rutas no válidas
- Crea automáticamente el directorio si no existe

#### 2. FileUploadController (`src/main/java/com/ecommerce/controller/FileUploadController.java`)

Controlador REST para subir y servir imágenes:

**Endpoints:**

- **POST** `/api/files/upload`
  - Sube una imagen al servidor
  - Valida tipo de archivo (solo imágenes)
  - Valida tamaño (máximo 5MB)
  - Devuelve información del archivo subido (nombre, URL, tipo, tamaño)
  
  ```json
  Response:
  {
    "fileName": "uuid-generado.jpg",
    "fileUrl": "http://localhost:8080/api/files/uuid-generado.jpg",
    "fileType": "image/jpeg",
    "size": "1024576"
  }
  ```

- **GET** `/api/files/{fileName}`
  - Descarga o visualiza una imagen
  - Devuelve el archivo con el Content-Type correcto

- **DELETE** `/api/files/{fileName}`
  - Elimina una imagen del servidor

#### 3. Configuración (`src/main/resources/application.properties`)

```properties
# Configuración de subida de archivos
spring.servlet.multipart.enabled=true
spring.servlet.multipart.max-file-size=5MB
spring.servlet.multipart.max-request-size=5MB
file.upload-dir=uploads/images
```

## Frontend - Integración de Subida de Imágenes

### 🔧 Componentes del Frontend

#### 1. Upload Service (`src/features/product/services/upload-service.ts`)

Servicio para interactuar con los endpoints de imágenes:

**Funciones principales:**

```typescript
// Sube una imagen al servidor
uploadImage(file: File): Promise<UploadResponse>

// Elimina una imagen del servidor
deleteImage(fileName: string): Promise<void>

// Construye la URL completa de una imagen
getImageUrl(fileName: string): string
```

**Validaciones:**
- Tipo de archivo (solo imágenes)
- Tamaño máximo (5MB)

#### 2. Formularios Actualizados

**Add Product (`src/features/product/pages/add-product.tsx`)**
- Input tipo `file` con `accept="image/*"`
- Vista previa en tiempo real
- Subida automática al seleccionar archivo
- Validación de tipo y tamaño
- Botón para eliminar imagen seleccionada

**Edit Product (`src/features/product/pages/edit-product.tsx`)**
- Similar a Add Product
- Mantiene imagen original si no se selecciona una nueva
- Botón para restaurar imagen original

#### 3. Componentes que Muestran Imágenes

Todos estos componentes ahora usan `getImageUrl()` para construir las URLs:

- `ProductCard` - Tarjetas de productos
- `ProductDetailPage` - Página de detalle de producto
- `CartSidebar` - Sidebar del carrito
- `CheckoutPage` - Página de checkout
- `ManageProductsPage` - Administración de productos
- `HomePage` - Página principal

## 🚀 Flujo de Trabajo

### Agregar un Producto con Imagen

1. Usuario selecciona un archivo en el input de tipo `file`
2. Frontend valida tipo y tamaño del archivo
3. Crea vista previa temporal usando `URL.createObjectURL()`
4. Sube inmediatamente la imagen al servidor via `uploadImage()`
5. Backend guarda la imagen con nombre único
6. Backend responde con el nombre del archivo
7. Frontend guarda el nombre en el campo `image` del formulario
8. Al enviar el formulario, se guarda solo el nombre del archivo en la BD

### Mostrar una Imagen

1. Backend devuelve el producto con el campo `image` (ej: "uuid-123.jpg")
2. Frontend usa `getImageUrl()` para construir la URL completa
3. Si el valor ya es una URL completa, la devuelve tal cual (compatibilidad con URLs externas)
4. Si es un nombre de archivo, construye: `http://localhost:8080/api/files/uuid-123.jpg`

### Editar un Producto

1. Carga el producto existente
2. Muestra la imagen actual usando `getImageUrl()`
3. Si el usuario selecciona una nueva imagen:
   - Sube la nueva imagen
   - Actualiza la vista previa
   - Al guardar, actualiza el campo `image` con el nuevo nombre
4. Si no selecciona nueva imagen, mantiene el valor original

## 🔒 Validaciones

### Backend
- ✅ Solo archivos de tipo imagen (`image/*`)
- ✅ Tamaño máximo: 5MB
- ✅ Nombres de archivo seguros (sin `..` en el path)
- ✅ Generación de nombres únicos (UUID)

### Frontend
- ✅ Validación de tipo de archivo
- ✅ Validación de tamaño (5MB)
- ✅ Mensajes de error claros
- ✅ Feedback visual durante la carga

## 📝 Notas Importantes

1. **Compatibilidad con URLs externas**: El sistema sigue siendo compatible con URLs externas. Si el campo `image` contiene una URL completa (`http://` o `https://`), se usa tal cual.

2. **Nombres únicos**: Cada imagen se guarda con un UUID único para evitar confliciones y sobrescrituras.

3. **Carga inmediata**: Las imágenes se suben inmediatamente al seleccionarlas, no al enviar el formulario. Esto mejora la experiencia del usuario.

4. **Vista previa**: Se muestra una vista previa inmediata usando `URL.createObjectURL()` mientras se sube la imagen.

5. **Directorio uploads**: El directorio `uploads/images/` se crea automáticamente si no existe.

6. **CORS**: Asegúrate de que el backend tenga CORS configurado correctamente para permitir las peticiones desde el frontend.

## 🐛 Solución de Problemas

### Error: "Solo se permiten archivos de imagen"
- Asegúrate de seleccionar un archivo de imagen (JPG, PNG, GIF, etc.)

### Error: "El archivo no debe superar los 5MB"
- Reduce el tamaño de la imagen o comprímela

### Error: "No se pudo almacenar el archivo"
- Verifica que el directorio `uploads/images/` tenga permisos de escritura
- Verifica que haya espacio en disco

### Las imágenes no se muestran
- Verifica que el backend esté corriendo en `http://localhost:8080`
- Verifica que el endpoint `/api/files/{fileName}` esté funcionando
- Verifica que el archivo exista en el directorio `uploads/images/`

## 🔄 Migración de Datos Existentes

Si tienes productos con URLs externas en la base de datos, el sistema seguirá funcionando. La función `getImageUrl()` detecta automáticamente si es una URL completa y la devuelve tal cual.

Para migrar gradualmente:
1. Descarga las imágenes externas
2. Súbelas usando el formulario de edición de productos
3. El sistema reemplazará la URL por el nombre del archivo local

## 🎯 Próximas Mejoras

Posibles mejoras futuras:
- [ ] Compresión automática de imágenes
- [ ] Múltiples imágenes por producto (galería)
- [ ] Edición de imágenes (recorte, rotación)
- [ ] Almacenamiento en la nube (AWS S3, Cloudinary)
- [ ] Optimización de imágenes (WebP, diferentes resoluciones)
- [ ] Limpieza automática de imágenes no utilizadas

