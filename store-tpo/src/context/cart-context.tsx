import { createContext, useContext, type ReactNode } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/types/product";
import { CartItemClass } from "@/types/cart";

interface CartState {
  items: CartItemClass[];
  isOpen: boolean;
  
  // Acciones del carrito
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  
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
            // Si el producto ya existe, incrementar la cantidad
            const updatedItems = state.items.map((item) =>
              item.product.id === product.id
                ? new CartItemClass(item.product, item.quantity + quantity)
                : item
            );
            return { items: updatedItems };
          } else {
            // Si es un producto nuevo, agregarlo al carrito
            const newItem = new CartItemClass(product, quantity);
            return { items: [...state.items, newItem] };
          }
        });
      },

      removeItem: (productId: number) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      updateQuantity: (productId: number, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId
              ? new CartItemClass(item.product, quantity)
              : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
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
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.total, 0);
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
