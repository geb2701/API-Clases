# 🖼️ Sistema de Imágenes

## 📋 Cómo Funcionan las Imágenes

### Ubicación de las Imágenes

```
API-Clases/
├── public/
│   └── images/                    ← Imágenes de productos
│       ├── camiseta-react.png
│       ├── hoodie-ts.png
│       ├── monitor.png
│       └── ... (50+ imágenes)
│
└── uploads/
    └── images/                    ← Imágenes subidas por usuarios (vacío por ahora)
```

### 🔄 Flujo de Carga de Imágenes

#### Para Productos Existentes (Base de Datos)

```
1. Producto en BD tiene: "camiseta-react.png"
         ↓
2. Frontend llama: getImageUrl("camiseta-react.png")
         ↓
3. Devuelve: "/images/camiseta-react.png"
         ↓
4. Vite sirve desde: public/images/camiseta-react.png
         ↓
5. Imagen se muestra correctamente ✅
```

#### Para Nuevas Imágenes (Subidas por Admin)

```
1. Admin sube imagen desde formulario
         ↓
2. POST /api/files/upload
         ↓
3. Backend guarda en: uploads/images/uuid-nombre.png
         ↓
4. Backend devuelve: { fileName: "uuid-nombre.png" }
         ↓
5. Frontend guarda en BD: "uuid-nombre.png"
         ↓
6. getImageUrl("uuid-nombre.png") devuelve "/images/uuid-nombre.png"
         ↓
7. PROBLEMA: Archivo no está en public/images/ ❌
```

### ⚠️ Limitación Actual

**Las imágenes subidas por el admin NO se verán** porque:
- Se guardan en `uploads/images/`
- Pero el frontend las busca en `public/images/` (servido por Vite)

---

## ✅ Solución Implementada

### Función `getImageUrl()`

```typescript
// src/features/product/services/upload-service.ts

export const getImageUrl = (fileName: string): string => {
  // 1. Si es URL completa (http://... o https://...)
  if (fileName.startsWith("http://") || fileName.startsWith("https://")) {
    return fileName;
  }
  
  // 2. Si ya tiene ruta (/images/ o /api/)
  if (fileName.startsWith("/images/") || fileName.startsWith("/api/")) {
    return fileName;
  }
  
  // 3. Para nombres simples, usar carpeta public/images
  return `/images/${fileName}`;
};
```

### Cómo Funciona Vite

Vite sirve automáticamente los archivos de `public/` en la raíz:

```
public/images/camiseta-react.png
         ↓
http://localhost:5173/images/camiseta-react.png
```

---

## 🔧 Soluciones para Imágenes Subidas

### Opción 1: Copiar a Public (Desarrollo)

```bash
# Copiar imágenes subidas a public para que Vite las sirva
cp -r uploads/images/* public/images/
```

**Ventajas:**
- ✅ Simple
- ✅ Funciona en desarrollo

**Desventajas:**
- ❌ Hay que copiarlas manualmente
- ❌ No funciona en producción

### Opción 2: Servir Uploads desde Backend (Recomendado)

Modificar `getImageUrl()` para detectar imágenes nuevas:

```typescript
export const getImageUrl = (fileName: string): string => {
  // Si empieza con UUID (nuevo formato), usar backend
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-/;
  if (uuidPattern.test(fileName)) {
    return `http://localhost:8080/api/files/${fileName}`;
  }
  
  // Imágenes antiguas, usar public/images
  return `/images/${fileName}`;
};
```

### Opción 3: Proxy en Vite (Más Complejo)

Configurar Vite para proxy de `/uploads/`:

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/uploads': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  }
})
```

---

## 📊 Estado Actual

### ✅ Funcionando
- Imágenes de productos en `public/images/` (50+ imágenes)
- Todos los productos de la BD usan estas imágenes
- Sistema de visualización funciona correctamente

### ⚠️ Pendiente
- Sistema de subida de imágenes por admin
- Servir imágenes de `uploads/images/` desde el backend

---

## 🧪 Cómo Probar

### 1. Ver Productos Existentes

```
1. npm run dev
2. Ir a http://localhost:5173
3. Ver catálogo de productos
4. ✅ Todas las imágenes deberían verse
```

### 2. Subir Nueva Imagen (Admin)

```
1. Ir a /gestionar/agregar
2. Seleccionar imagen
3. Crear producto
4. ⚠️ La imagen NO se verá (problema conocido)
```

### 3. Verificar en el Navegador

```
F12 → Network → Filtrar por "Img"
```

**Imágenes correctas:**
```
✅ http://localhost:5173/images/camiseta-react.png (200 OK)
✅ http://localhost:5173/images/monitor.png (200 OK)
```

**Imágenes con problema:**
```
❌ http://localhost:5173/images/abc123-nueva.png (404 Not Found)
```

---

## 🚀 Próximos Pasos (Opcional)

### Para Habilitar Subida de Imágenes

1. **Implementar Opción 2** (Recomendado):
   ```typescript
   // Modificar getImageUrl() para detectar UUIDs
   // y usar el backend para esas imágenes
   ```

2. **Actualizar componentes de admin**:
   - Ya funcionan con `uploadImage()`
   - Solo falta ajustar `getImageUrl()`

3. **Probar flujo completo**:
   - Subir imagen
   - Crear producto
   - Ver producto con imagen nueva

---

## 📝 Resumen

| Aspecto | Estado | Descripción |
|---------|--------|-------------|
| **Imágenes existentes** | ✅ | Funcionan desde `public/images/` |
| **Ver productos** | ✅ | Todas las imágenes visibles |
| **Subir imágenes** | ⚠️ | Backend guarda, pero frontend no las ve |
| **Backend endpoint** | ✅ | GET /api/files/{fileName} funciona |
| **Frontend carga** | ✅ | Usa Vite para servir desde public/ |

---

## 🔍 Debug

### Si las imágenes siguen rotas:

1. **Verificar ruta en BD:**
   ```sql
   SELECT id, name, image FROM products LIMIT 5;
   ```

2. **Verificar archivo existe:**
   ```bash
   ls public/images/camiseta-react.png
   ```

3. **Verificar en navegador:**
   ```
   F12 → Console → Buscar errores 404
   F12 → Network → Ver qué URLs se están solicitando
   ```

4. **Verificar getImageUrl():**
   ```typescript
   console.log(getImageUrl("camiseta-react.png"));
   // Debería mostrar: "/images/camiseta-react.png"
   ```

---

**Última actualización**: ${new Date().toLocaleDateString('es-ES')}

**Estado**: ✅ Imágenes de productos funcionando

