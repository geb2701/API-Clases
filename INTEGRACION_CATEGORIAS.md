# 📦 Integración de Categorías desde Backend

## 🎯 Objetivo

Cambiar el frontend para obtener las categorías dinámicamente desde el backend en lugar de usar un array hardcodeado.

---

## ✅ Lo Que Se Hizo

### 1. Backend (Ya existía)

El backend ya tenía un `CategoryController` con el endpoint:

```
GET /api/categories
```

**Respuesta:**
```json
[
  {
    "id": 1,
    "name": "Tecnología",
    "description": "Productos tecnológicos",
    "isActive": true
  },
  {
    "id": 2,
    "name": "Ropa",
    "description": "Ropa y accesorios",
    "isActive": true
  }
]
```

---

### 2. Frontend - Nuevos Archivos Creados

#### ✅ `src/features/category/services/category-service.ts`

Servicio para interactuar con el endpoint de categorías:

```typescript
import { apiClient } from "@/lib/generic-ky-client";
import type { Category } from "@/types/product";

/**
 * Obtener todas las categorías activas
 */
export const getCategories = async (): Promise<Category[]> => {
  try {
    const categories = await apiClient.get("categories").json<Category[]>();
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("No se pudieron cargar las categorías");
  }
};

// Más funciones: getCategoryById, getCategoryByName, searchCategories
```

#### ✅ `src/features/category/hooks/use-categories.ts`

Hook personalizado con React Query para manejar el estado de las categorías:

```typescript
import { queryOptions } from "@tanstack/react-query";
import { getCategories } from "../services/category-service";

const queryKey = ["categories"];

export const useCategories = () => {
  const all = () => {
    return queryOptions({
      queryKey: queryKey,
      queryFn: async () => getCategories(),
      staleTime: 1000 * 60 * 10, // 10 minutos (las categorías cambian poco)
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    });
  };

  return {
    queryOptions: {
      all,
      queryKey,
    },
    invalidateKeys: {
      all: queryKey,
    },
  };
};
```

---

### 3. Frontend - Archivos Actualizados

#### ✅ `src/features/product/pages/add-product.tsx`

**Antes ❌:**
```typescript
const categories = [
  "Accesorios",
  "Decoración",
  "Hogar",
  "Libros",
  "Ropa",
  "Tecnología"
];

export default function AddProduct() {
  // ...
}
```

**Después ✅:**
```typescript
import { useCategories } from "@/features/category/hooks/use-categories";
import { useSuspenseQuery } from "@tanstack/react-query";

export default function AddProduct() {
  const categoriesApi = useCategories();
  const categoriesData = useSuspenseQuery(categoriesApi.queryOptions.all()).data;
  const categories = categoriesData.map((cat) => cat.name).sort();
  
  // Ahora 'categories' es un array de strings desde el backend
  // ["Accesorios", "Ropa", "Tecnología", ...]
}
```

#### ✅ `src/features/product/pages/edit-product.tsx`

Mismo cambio que en `add-product.tsx`:

```typescript
import { useCategories } from "@/features/category/hooks/use-categories";

export default function EditProduct() {
  const categoriesApi = useCategories();
  const categoriesData = useSuspenseQuery(categoriesApi.queryOptions.all()).data;
  const categories = categoriesData.map((cat) => cat.name).sort();
  
  // ...
}
```

---

## 📊 Comparación

### Antes ❌

```typescript
// Hardcodeado en el frontend
const categories = [
  "Accesorios",
  "Decoración",
  "Hogar",
  "Libros",
  "Ropa",
  "Tecnología"
];
```

**Problemas:**
- ❌ Si agregas una categoría en el backend, no aparece en el frontend
- ❌ Duplicación de datos
- ❌ Inconsistencia entre frontend y backend

### Después ✅

```typescript
// Obtenido dinámicamente desde el backend
const categoriesData = useSuspenseQuery(categoriesApi.queryOptions.all()).data;
const categories = categoriesData.map((cat) => cat.name).sort();
```

**Beneficios:**
- ✅ Las categorías se sincronizan automáticamente con el backend
- ✅ Single source of truth (backend)
- ✅ Caché de 10 minutos con React Query
- ✅ Si agregas/editas una categoría en la BD, aparece automáticamente en el frontend

---

## 🚀 Cómo Funciona

### 1. Usuario abre "Agregar Producto"

```
Frontend → GET /api/categories → Backend → MySQL
```

### 2. React Query cachea las categorías

Las próximas veces que se abra el formulario, **no hace otra petición** (durante 10 minutos).

### 3. El select muestra las categorías

```tsx
<Select>
  {categories.map((category) => (
    <SelectItem key={category} value={category}>
      {category}
    </SelectItem>
  ))}
</Select>
```

---

## 🎯 Endpoints Disponibles

El backend tiene estos endpoints de categorías:

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/categories` | Listar todas las categorías activas |
| `GET` | `/api/categories/{id}` | Obtener categoría por ID |
| `GET` | `/api/categories/name/{name}` | Obtener categoría por nombre |
| `GET` | `/api/categories/search?q=...` | Buscar categorías |
| `POST` | `/api/categories` | Crear categoría (Admin) |
| `PUT` | `/api/categories/{id}` | Actualizar categoría (Admin) |
| `DELETE` | `/api/categories/{id}` | Eliminar categoría (Admin) |

---

## 💡 Próximos Pasos (Opcional)

Si quieres administrar categorías desde el frontend, podrías crear:

1. ✅ **Página de gestión de categorías**
   - Listar categorías
   - Crear nueva categoría
   - Editar categoría
   - Eliminar categoría

2. ✅ **Formularios de categoría**
   - Validación con Zod
   - Integración con el backend

3. ✅ **Permisos**
   - Solo administradores pueden gestionar categorías

---

## 📁 Estructura de Archivos

```
src/
├── features/
│   ├── category/
│   │   ├── services/
│   │   │   └── category-service.ts  ← ✅ Nuevo
│   │   └── hooks/
│   │       └── use-categories.ts     ← ✅ Nuevo
│   └── product/
│       └── pages/
│           ├── add-product.tsx       ← ✅ Actualizado
│           └── edit-product.tsx      ← ✅ Actualizado
└── types/
    └── product.ts                     ← ✅ Ya tenía interface Category
```

---

## ✅ Verificación

### 1. Backend corriendo
```bash
# El backend debe estar corriendo en http://localhost:8080
```

### 2. Probar endpoint manualmente
```bash
# En el navegador:
http://localhost:8080/api/categories

# Deberías ver un JSON con las categorías
```

### 3. Abrir formulario de agregar producto
```
http://localhost:5173/gestionar/agregar
```

**El select de categorías debería mostrar las categorías del backend!** 🎉

---

## 🎉 Resultado Final

- ✅ Categorías obtenidas dinámicamente desde `/api/categories`
- ✅ Caché de 10 minutos con React Query
- ✅ Sincronización automática entre frontend y backend
- ✅ Código más limpio y mantenible
- ✅ Single source of truth (backend)

---

**¡Las categorías ahora vienen del backend!** 🚀

