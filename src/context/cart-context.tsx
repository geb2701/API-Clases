import { createContext, useContext, type ReactNode } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";
import { Product } from "@/types/product";
import { CartItemClass } from "@/types/cart";
import { fromObject } from "@/lib/utils";

interface CartState {
  items: CartItemClass[];
  isOpen: boolean;

  // Acciones del carrito
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: (silent?: boolean) => void;
  getProducts: () => CartItemClass[];

  // Acciones de UI
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;

  // Getters computados
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getFormattedTotal: () => string;
  getItemQuantity: (productId: number) => number;
}

const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product: Product, quantity: number = 1) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product.id === product.id
          );

          if (existingItem) {
            // Si el producto ya existe, verificar stock disponible
            const newQuantity = existingItem.quantity + quantity;

            if (newQuantity > product.stock) {
              // Notificación de error por exceder stock
              toast.error("Stock insuficiente", {
                description: `${product.name} - Stock disponible: ${product.stock}, Cantidad solicitada: ${newQuantity}`,
                duration: 4000,
              });
              return state; // No hacer cambios si excede el stock
            }

            // Si no excede el stock, incrementar la cantidad
            const updatedItems = state.items.map((item) =>
              item.product.id === product.id
                ? new CartItemClass(item.product, newQuantity)
                : item
            );

            // Notificación para producto existente
            toast.success("Cantidad actualizada", {
              description: `${product.name} - Cantidad: ${newQuantity}`,
              duration: 3000,
            });

            return { items: updatedItems };
          } else {
            // Si es un producto nuevo, verificar stock disponible
            if (quantity > product.stock) {
              // Notificación de error por exceder stock
              toast.error("Stock insuficiente", {
                description: `${product.name} - Stock disponible: ${product.stock}, Cantidad solicitada: ${quantity}`,
                duration: 4000,
              });
              return state; // No hacer cambios si excede el stock
            }

            // Si no excede el stock, agregarlo al carrito
            const newItem = new CartItemClass(product, quantity);

            // Notificación para producto nuevo
            toast.success("Producto agregado al carrito", {
              description: `${product.name} - Cantidad: ${quantity}`,
              duration: 3000,
            });

            return { items: [...state.items, newItem] };
          }
        });
      },

      removeItem: (productId: number) => {
        set((state) => {
          const itemToRemove = state.items.find((item) => item.product.id === productId);

          // Notificación para producto eliminado
          if (itemToRemove) {
            toast.error("Producto eliminado del carrito", {
              description: `${itemToRemove.product.name}`,
              duration: 3000,
            });
          }

          return {
            items: state.items.filter((item) => item.product.id !== productId),
          };
        });
      },

      updateQuantity: (productId: number, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set((state) => {
          const itemToUpdate = state.items.find((item) => item.product.id === productId);

          if (!itemToUpdate) {
            return state; // No hacer cambios si no se encuentra el item
          }

          // Verificar si la nueva cantidad excede el stock
          if (quantity > itemToUpdate.product.stock) {
            // Notificación de error por exceder stock
            toast.error("Stock insuficiente", {
              description: `${itemToUpdate.product.name} - Stock disponible: ${itemToUpdate.product.stock}, Cantidad solicitada: ${quantity}`,
              duration: 4000,
            });
            return state; // No hacer cambios si excede el stock
          }

          // Notificación para cantidad actualizada
          toast.info("Cantidad actualizada", {
            description: `${itemToUpdate.product.name} - Nueva cantidad: ${quantity}`,
            duration: 3000,
          });

          return {
            items: state.items.map((item) =>
              item.product.id === productId
                ? new CartItemClass(item.product, quantity)
                : item
            ),
          };
        });
      },

      clearCart: (silent: boolean = false) => {
        set((state) => {
          const itemCount = state.items.length;

          // Notificación para carrito vaciado (solo si no es silencioso)
          if (itemCount > 0 && !silent) {
            toast.warning("Carrito vaciado", {
              description: `Se eliminaron ${itemCount} producto${itemCount > 1 ? 's' : ''} del carrito`,
              duration: 3000,
            });
          }

          return { items: [] };
        });
      },

      getProducts: () => {
        return get().items.map(item => {
          const product = fromObject<Product>(Product, item.product);
          return new CartItemClass(product, item.quantity);
        });
      },

      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }));
      },

      openCart: () => {
        set({ isOpen: true });
      },

      closeCart: () => {
        set({ isOpen: false });
      },

      getTotalItems: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((acc, item) => {
          const unitPrice = item.product.discount ?? item.product.price;
          return acc + unitPrice * item.quantity;
        }, 0);
      },

      getFormattedTotal: () => {
        const total = get().getTotalPrice();
        return `$${total.toFixed(2)}`;
      },

      getItemQuantity: (productId: number) => {
        const item = get().items.find((item) => item.product.id === productId);
        return item ? item.quantity : 0;
      },
    }),
    {
      name: "cart-store",
      partialize: (state) => ({ items: state.items }),
    }
  )
);

const CartContext = createContext<CartState | undefined>(undefined);

// Proveedor del contexto
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const cartStore = useCartStore();

  return (
    <CartContext.Provider value={cartStore}>
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext debe usarse dentro de un CartProvider");
  }
  return context;
};
