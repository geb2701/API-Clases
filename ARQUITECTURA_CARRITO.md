# 🛒 Arquitectura del Carrito de Compras

## 📋 Decisión de Diseño

El carrito de compras está implementado **100% en el frontend** usando **localStorage**.

---

## ✅ Implementación Actual

### Frontend (React + Zustand)

```typescript
// src/context/cart-context.tsx
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity) => { /* ... */ },
      removeItem: (productId) => { /* ... */ },
      updateQuantity: (productId, quantity) => { /* ... */ },
      clearCart: () => { /* ... */ },
      // ... más funciones
    }),
    {
      name: "cart-store",  // ← Guarda en localStorage
      partialize: (state) => ({ items: state.items }),
    }
  )
);
```

### Persistencia

- **Almacenamiento**: `localStorage` del navegador
- **Key**: `cart-store`
- **Formato**: JSON serializado
- **Ciclo de vida**: Persiste hasta que el usuario limpie el navegador

---

## 🎯 Ventajas de Esta Implementación

### ✅ Rendimiento
- Sin latencia de red
- Operaciones instantáneas
- No satura el servidor

### ✅ Simplicidad
- No requiere autenticación para usar el carrito
- No necesita sincronización con backend
- Menos código que mantener

### ✅ Experiencia de Usuario
- Funciona offline
- El carrito persiste entre sesiones del navegador
- No se pierde si el servidor cae

### ✅ Escalabilidad
- Zero carga en el servidor para operaciones de carrito
- Sin consultas a base de datos
- Soporta millones de usuarios sin impacto

---

## ⚠️ Limitaciones

### ❌ No Sincroniza Entre Dispositivos
Si un usuario agrega productos desde su computadora y luego abre la tienda desde su celular, no verá esos productos.

**Solución**: Es el comportamiento esperado. Al hacer checkout, se crea la orden en la BD.

### ❌ Se Pierde si Limpian el Navegador
Si el usuario borra los datos del navegador, pierde el carrito.

**Solución**: Es aceptable. Educar al usuario o implementar un recordatorio antes del checkout.

### ❌ No Hay Carritos Abandonados en BD
No puedes analizar carritos abandonados para remarketing.

**Solución**: Si es crítico para el negocio, considera implementar un sistema híbrido (ver abajo).

---

## 🔄 Flujo del Carrito

### 1. Agregar Producto

```
Usuario hace clic en "Agregar al carrito"
         ↓
Frontend valida stock disponible
         ↓
Se agrega/actualiza en el estado de Zustand
         ↓
Zustand persiste automáticamente en localStorage
         ↓
UI se actualiza mostrando el nuevo item
```

### 2. Ver Carrito

```
Usuario abre el carrito
         ↓
Zustand lee desde localStorage (si existe)
         ↓
Muestra items con precios actualizados
         ↓
Valida stock actual desde productos
```

### 3. Checkout

```
Usuario hace clic en "Pagar"
         ↓
Valida stock actual llamando al backend
         ↓
Crea la orden en la base de datos
         ↓
Backend reduce el stock de productos
         ↓
Frontend limpia el carrito (localStorage)
```

---

## 🗄️ ¿Qué Hay en la Base de Datos?

### ✅ SI se guardan:
- **Órdenes completadas** (`orders` table)
- **Items de órdenes** (`order_items` table)
- **Productos** con stock actualizado
- **Usuarios** y sus datos

### ❌ NO se guardan:
- **Carritos activos** (están en localStorage)
- **Items temporales del carrito**
- **Sesiones de carrito**

---

## 📊 Comparación: localStorage vs Base de Datos

| Aspecto | localStorage (Actual) | Base de Datos |
|---------|----------------------|---------------|
| **Velocidad** | ⚡⚡⚡ Instantáneo | ⚡⚡ Red + DB |
| **Sincronización** | ❌ Solo local | ✅ Multi-dispositivo |
| **Offline** | ✅ Funciona | ❌ Requiere conexión |
| **Carga servidor** | ✅ Cero | ❌ Alta |
| **Persiste siempre** | ❌ Solo en navegador | ✅ Siempre |
| **Complejidad** | ✅ Simple | ❌ Compleja |
| **Escalabilidad** | ✅ Infinita | ⚠️ Limitada |
| **Carritos abandonados** | ❌ No trackeable | ✅ Analizable |

---

## 🔐 Consideraciones de Seguridad

### ✅ Lo que está protegido:

- **Checkout**: Requiere validación de stock en el backend
- **Creación de orden**: Pasa por validaciones del backend
- **Precios**: Siempre se toman del backend al crear la orden
- **Stock**: Se verifica en tiempo real antes de confirmar

### ⚠️ Lo que el usuario puede modificar:

- **Items en localStorage**: Un usuario técnico puede editar el localStorage
  - **Pero no importa**: Los precios y stock se validan en el backend al hacer checkout
  - **La orden final siempre usa datos del servidor**, no del localStorage

---

## 💡 Migraciones Futuras (Si Es Necesario)

### Opción 1: Sistema Híbrido

```typescript
// Para usuarios anónimos: localStorage
// Para usuarios logueados: Base de datos + sincronización

const useCartStore = create((set, get) => ({
  // ...
  syncWithBackend: async (userId) => {
    if (userId) {
      // Sincronizar carrito local con BD
      const localItems = get().items;
      await api.syncCart(userId, localItems);
    }
  }
}));
```

### Opción 2: Migración al Login

```typescript
// Al hacer login, migrar carrito local → BD
const login = async (credentials) => {
  const user = await authService.login(credentials);
  
  // Migrar carrito anónimo a carrito del usuario
  const localCart = cartStore.items;
  if (localCart.length > 0) {
    await cartService.mergeCart(user.id, localCart);
  }
};
```

---

## 🧪 Testing

### Prueba 1: Persistencia
```
1. Agrega productos al carrito
2. Cierra el navegador
3. Abre de nuevo la tienda
✅ El carrito debe seguir con los mismos productos
```

### Prueba 2: Límite de Stock
```
1. Agrega 10 unidades de un producto con stock 5
2. Intenta agregarlo
✅ Debe mostrar error "Stock insuficiente"
```

### Prueba 3: Validación en Checkout
```
1. Agrega producto con stock 10
2. Otro usuario compra 8 unidades
3. Tu intentas comprar 5 unidades
✅ El backend debe rechazar (solo quedan 2)
```

---

## 📝 Archivos Relevantes

### Frontend
```
src/
├── context/
│   └── cart-context.tsx          ← Implementación completa
├── types/
│   └── cart.ts                   ← Tipos TypeScript
└── layouts/
    └── cart-sidebar.tsx          ← UI del carrito
```

### Backend (Solo para checkout)
```
EcommerceApi/
└── src/main/java/.../
    ├── controller/
    │   └── OrderController.java  ← Recibe órdenes del carrito
    └── service/
        └── OrderService.java     ← Valida stock y crea orden
```

---

## 🚀 Conclusión

La implementación actual con **localStorage** es:

- ✅ **Simple y efectiva**
- ✅ **Rápida y escalable**
- ✅ **Apropiada para la mayoría de e-commerce**
- ✅ **Validada en el backend al hacer checkout**

**No necesitas base de datos para el carrito** a menos que:
- Requieras sincronización multi-dispositivo
- Necesites analizar carritos abandonados
- Tengas usuarios corporativos que comparten carritos

---

## 📚 Referencias

- **Zustand Docs**: https://github.com/pmndrs/zustand
- **Persist Middleware**: https://github.com/pmndrs/zustand#persist-middleware
- **localStorage API**: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage

---

**Fecha**: ${new Date().toLocaleDateString('es-ES')}

**Estado**: ✅ Implementado y Funcionando

