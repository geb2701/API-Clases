# 🖼️ Sistema de Imágenes - Completo e Híbrido

## 📋 Cómo Funciona (Sistema Híbrido)

El sistema ahora soporta **3 tipos de imágenes**:

### 1️⃣ Imágenes Existentes (Base de Datos Original)
```
📂 public/images/camiseta-react.png
         ↓
🔍 getImageUrl("camiseta-react.png")
         ↓
✅ /images/camiseta-react.png
         ↓
🌐 Vite sirve desde public/
```

### 2️⃣ Imágenes Nuevas (Subidas por Admin)
```
📤 Admin sube imagen → POST /api/files/upload
         ↓
💾 Backend guarda: uploads/images/abc123-def456-producto.png
         ↓
🔍 getImageUrl("abc123-def456-producto.png")
         ↓
✅ http://localhost:8080/api/files/abc123-def456-producto.png
         ↓
🌐 Backend sirve desde uploads/
```

### 3️⃣ URLs de Internet
```
🔗 Admin ingresa: https://example.com/imagen.jpg
         ↓
🔍 getImageUrl("https://example.com/imagen.jpg")
         ↓
✅ https://example.com/imagen.jpg
         ↓
🌐 Se carga directamente
```

---

## 🧠 Lógica de Detección

### Función `getImageUrl()` Mejorada

```typescript
export const getImageUrl = (fileName: string): string => {
  // 1. ¿Es una URL completa de internet?
  if (fileName.startsWith("http://") || fileName.startsWith("https://")) {
    return fileName;  // Usar tal cual
  }
  
  // 2. ¿Ya tiene una ruta absoluta?
  if (fileName.startsWith("/images/") || fileName.startsWith("/api/")) {
    return fileName;  // Usar tal cual
  }
  
  // 3. ¿Tiene UUID? (imagen subida recientemente)
  const hasUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-/.test(fileName);
  
  if (hasUUID) {
    // Imagen nueva → usar backend
    return `http://localhost:8080/api/files/${fileName}`;
  }
  
  // 4. Imagen antigua → usar public/images
  return `/images/${fileName}`;
};
```

---

## 📊 Flujo Completo de Creación de Producto

### Opción A: Subir Archivo

```
1. Admin va a /gestionar/agregar
         ↓
2. Selecciona archivo local (imagen.jpg)
         ↓
3. Frontend → POST /api/files/upload
         ↓
4. Backend:
   - Genera UUID: abc123-def456-ghij789
   - Guarda: uploads/images/abc123-def456-imagen.jpg
   - Devuelve: { fileName: "abc123-def456-imagen.jpg" }
         ↓
5. Frontend guarda en BD: "abc123-def456-imagen.jpg"
         ↓
6. Al mostrar producto:
   - getImageUrl("abc123-def456-imagen.jpg")
   - Detecta UUID → http://localhost:8080/api/files/...
   - Backend sirve el archivo
         ↓
7. ✅ Imagen se ve correctamente
```

### Opción B: URL de Internet

```
1. Admin va a /gestionar/agregar
         ↓
2. En lugar de subir, ingresa URL:
   https://cdn.shopify.com/producto.jpg
         ↓
3. Frontend guarda en BD: "https://cdn.shopify.com/producto.jpg"
         ↓
4. Al mostrar producto:
   - getImageUrl("https://cdn.shopify.com/producto.jpg")
   - Detecta https:// → devuelve tal cual
         ↓
5. ✅ Imagen se carga desde internet
```

---

## 🗂️ Estructura de Directorios

```
API-Clases/
├── 📂 public/
│   └── images/                    ← Imágenes originales (50+)
│       ├── camiseta-react.png     ✅ Funcionan
│       ├── hoodie-ts.png          ✅ Funcionan
│       └── monitor.png            ✅ Funcionan
│
├── 📂 uploads/
│   └── images/                    ← Imágenes subidas por admin
│       ├── abc123-producto1.png   ✅ Funcionan vía backend
│       └── def456-producto2.jpg   ✅ Funcionan vía backend
│
└── 📂 EcommerceApi/
    └── src/.../controller/
        └── FileUploadController.java  ← Sirve archivos de uploads/
```

---

## 🎯 Casos de Uso

### Caso 1: Ver Productos Existentes
```sql
SELECT image FROM products WHERE id = 1;
-- Resultado: "camiseta-react.png"

Frontend:
getImageUrl("camiseta-react.png")
→ /images/camiseta-react.png
→ Vite sirve desde public/images/
✅ Funciona
```

### Caso 2: Admin Crea Producto con Imagen Nueva
```typescript
// 1. Subir imagen
const response = await uploadImage(file);
// response.fileName = "abc123-def456-nuevo-producto.png"

// 2. Crear producto
await createProduct({
  name: "Nuevo Producto",
  image: response.fileName,  // "abc123-def456-nuevo-producto.png"
  ...
});

// 3. Ver producto
getImageUrl("abc123-def456-nuevo-producto.png")
→ http://localhost:8080/api/files/abc123-def456-nuevo-producto.png
→ Backend sirve desde uploads/images/
✅ Funciona
```

### Caso 3: Admin Usa URL de Internet
```typescript
// Crear producto con URL externa
await createProduct({
  name: "Producto con Imagen Externa",
  image: "https://example.com/imagen.jpg",
  ...
});

// Ver producto
getImageUrl("https://example.com/imagen.jpg")
→ https://example.com/imagen.jpg
→ Se carga directamente
✅ Funciona
```

---

## 🔍 Cómo Detecta el Tipo de Imagen

### Por el Nombre del Archivo

| Ejemplo | Tipo | URL Final |
|---------|------|-----------|
| `camiseta-react.png` | Antigua | `/images/camiseta-react.png` |
| `abc123-def456-nuevo.png` | Nueva | `http://localhost:8080/api/files/...` |
| `https://cdn.com/img.jpg` | Internet | `https://cdn.com/img.jpg` |
| `/images/custom.png` | Ruta completa | `/images/custom.png` |
| `/api/files/file.png` | Backend | `/api/files/file.png` |

### Patrón UUID

```typescript
// Detecta UUID al inicio del nombre
const hasUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-/.test(fileName);

// Ejemplos:
"abc12345-1234-5678-9abc-def012345678-imagen.png"  → true  (nueva)
"camiseta-react.png"                                → false (antigua)
"producto-nuevo.jpg"                                → false (antigua)
```

---

## 🛠️ Configuración del Backend

### FileStorageService.java

```java
// Genera nombres únicos con UUID
public String storeFile(MultipartFile file) {
    String originalFilename = file.getOriginalFilename();
    String extension = originalFilename.substring(
        originalFilename.lastIndexOf(".")
    );
    
    // Nombre único: UUID + nombre original
    String fileName = UUID.randomUUID().toString() + 
                     "-" + originalFilename;
    
    // Guardar en: uploads/images/uuid-nombre.ext
    Path targetLocation = this.fileStorageLocation
        .resolve(fileName);
    
    Files.copy(file.getInputStream(), targetLocation);
    return fileName;
}
```

### FileUploadController.java

```java
// GET /api/files/{fileName}
@GetMapping("/{fileName:.+}")
public ResponseEntity<Resource> downloadFile(
    @PathVariable String fileName
) {
    Resource resource = fileStorageService
        .loadFileAsResource(fileName);
    
    return ResponseEntity.ok()
        .contentType(MediaType.parseMediaType(contentType))
        .body(resource);
}
```

---

## 📝 Modificar Componente de Admin (Opcional)

### Agregar Campo de URL

```typescript
// En add-product.tsx o edit-product.tsx

const [useUrl, setUseUrl] = useState(false);

return (
  <div>
    <Label>Imagen del Producto</Label>
    
    <div className="flex items-center gap-2 mb-2">
      <input
        type="checkbox"
        checked={useUrl}
        onChange={(e) => setUseUrl(e.target.checked)}
      />
      <span>Usar URL de internet en lugar de subir archivo</span>
    </div>
    
    {useUrl ? (
      // Campo de texto para URL
      <Input
        type="url"
        placeholder="https://example.com/imagen.jpg"
        value={imageUrl}
        onChange={(e) => {
          setImageUrl(e.target.value);
          setValue("image", e.target.value);
        }}
      />
    ) : (
      // Campo de archivo (actual)
      <Input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
      />
    )}
  </div>
);
```

---

## ✅ Ventajas del Sistema Híbrido

| Aspecto | Beneficio |
|---------|-----------|
| **Compatibilidad** | ✅ Productos existentes siguen funcionando |
| **Nuevas subidas** | ✅ Admin puede subir archivos |
| **URLs externas** | ✅ Admin puede usar CDNs |
| **Rendimiento** | ✅ Imágenes antiguas = zero latencia |
| **Flexibilidad** | ✅ 3 opciones disponibles |
| **Escalabilidad** | ✅ Puede migrar a CDN fácilmente |

---

## 🧪 Cómo Probar

### 1. Imágenes Existentes
```
✅ Ir a http://localhost:5173
✅ Ver catálogo de productos
✅ Todas las imágenes deberían verse
```

### 2. Subir Nueva Imagen
```
1. Ir a /gestionar/agregar
2. Seleccionar archivo local
3. Esperar a que suba
4. Crear producto
5. ✅ Ver producto con imagen nueva
```

### 3. Usar URL Externa
```
1. Ir a /gestionar/agregar
2. Modificar código para permitir URL (o usar directamente en BD)
3. Guardar: https://via.placeholder.com/400
4. ✅ Ver producto con imagen externa
```

### 4. Verificar en Consola
```javascript
// F12 → Console
import { getImageUrl } from './upload-service';

// Antigua
console.log(getImageUrl("camiseta-react.png"));
// → "/images/camiseta-react.png"

// Nueva
console.log(getImageUrl("abc123-def456-nuevo.png"));
// → "http://localhost:8080/api/files/abc123-def456-nuevo.png"

// Internet
console.log(getImageUrl("https://example.com/img.jpg"));
// → "https://example.com/img.jpg"
```

---

## 🚀 Para Producción

### 1. Usar CDN para Nuevas Imágenes

```typescript
export const getImageUrl = (fileName: string): string => {
  const hasUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-/.test(fileName);
  
  if (hasUUID) {
    // Usar CDN en producción
    return `https://cdn.mitienda.com/products/${fileName}`;
  }
  
  return `/images/${fileName}`;
};
```

### 2. Variables de Entorno

```typescript
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const CDN_URL = import.meta.env.VITE_CDN_URL || API_URL;

export const getImageUrl = (fileName: string): string => {
  const hasUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-/.test(fileName);
  
  if (hasUUID) {
    return `${CDN_URL}/api/files/${fileName}`;
  }
  
  return `/images/${fileName}`;
};
```

---

## 📊 Resumen

| Tipo | Ubicación | URL | Estado |
|------|-----------|-----|--------|
| **Antiguas** | `public/images/` | `/images/...` | ✅ Funcionando |
| **Nuevas** | `uploads/images/` | `http://localhost:8080/api/files/...` | ✅ Funcionando |
| **Internet** | CDN/Web | `https://...` | ✅ Soportado |

---

**Última actualización**: ${new Date().toLocaleDateString('es-ES')}

**Estado**: ✅ Sistema híbrido implementado y funcionando

