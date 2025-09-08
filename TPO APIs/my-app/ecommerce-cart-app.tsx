import React, { useState, useEffect, useContext, createContext, useCallback, useMemo } from 'react';
import { ShoppingCart, Plus, Minus, Package, Loader2 } from 'lucide-react';

/**
 * ROL: Ingeniero Frontend Senior especializado en React
 * OBJETIVO: Crear un sistema de e-commerce modular con carrito de compras utilizando hooks modernos y Context API
 * CONTEXTO: Aplicación SPA que gestiona productos y carrito con estado global compartido
 * EJEMPLOS: Implementar useState para UI, useEffect para APIs, useContext para estado global, useCallback/useMemo para optimización
 */

// ===== TIPOS Y CONSTANTES =====
const API_DELAY = 1000;
const CURRENCY_FORMATTER = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'USD'
});

// ===== CONTEXT Y PROVIDER =====
const CartContext = createContext(null);

const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Optimización: useCallback para evitar re-renders innecesarios
  const addToCart = useCallback((product) => {
    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => item.id === product.id);
      
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1
        };
        return updated;
      }
      
      return [...prev, { ...product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCartItems(prev => 
      prev.reduce((acc, item) => {
        if (item.id === productId) {
          if (item.quantity > 1) {
            acc.push({ ...item, quantity: item.quantity - 1 });
          }
          // Si quantity === 1, no lo agregamos (se elimina)
        } else {
          acc.push(item);
        }
        return acc;
      }, [])
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  // Memoización de valores calculados
  const cartSummary = useMemo(() => {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    return {
      totalItems,
      totalPrice,
      formattedTotal: CURRENCY_FORMATTER.format(totalPrice),
      isEmpty: cartItems.length === 0
    };
  }, [cartItems]);

  const contextValue = useMemo(() => ({
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    ...cartSummary
  }), [cartItems, addToCart, removeFromCart, clearCart, cartSummary]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

// ===== CUSTOM HOOKS =====
const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider');
  }
  return context;
};

// Hook para manejo de productos con mejores prácticas
const useProducts = () => {
  const [state, setState] = useState({
    products: [],
    loading: true,
    error: null
  });

  const fetchProducts = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      // Simulación de API mejorada
      await new Promise(resolve => setTimeout(resolve, API_DELAY));
      
      const products = [
        {
          id: 1,
          name: "iPhone 15 Pro",
          price: 1199.99,
          image: "📱",
          description: "El smartphone más avanzado con chip A17 Pro",
          category: "smartphones"
        },
        {
          id: 2,
          name: "MacBook Pro M3",
          price: 2399.99,
          image: "💻",
          description: "Rendimiento profesional con chip M3",
          category: "laptops"
        },
        {
          id: 3,
          name: "AirPods Pro 2",
          price: 249.99,
          image: "🎧",
          description: "Audio espacial y cancelación activa de ruido",
          category: "audio"
        },
        {
          id: 4,
          name: "iPad Air M2",
          price: 599.99,
          image: "📋",
          description: "Versatilidad y potencia en formato tablet",
          category: "tablets"
        },
        {
          id: 5,
          name: "Apple Watch Ultra 2",
          price: 799.99,
          image: "⌚",
          description: "El smartwatch más resistente y preciso",
          category: "wearables"
        },
        {
          id: 6,
          name: "Canon EOS R6 Mark II",
          price: 2499.99,
          image: "📷",
          description: "Cámara mirrorless profesional",
          category: "cameras"
        }
      ];

      setState({ products, loading: false, error: null });
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: 'Error al cargar productos. Intenta nuevamente.' 
      }));
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { ...state, refetch: fetchProducts };
};

// ===== COMPONENTES OPTIMIZADOS =====
const ProductCard = React.memo(({ product }) => {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = useCallback(async () => {
    setIsAdding(true);
    // Simulación de feedback visual
    await new Promise(resolve => setTimeout(resolve, 200));
    addToCart(product);
    setIsAdding(false);
  }, [product, addToCart]);

  return (
    <article className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group">
      <div className="p-6">
        <div className="text-center mb-4">
          <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-200">
            {product.image}
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-2xl font-bold text-blue-600">
              {CURRENCY_FORMATTER.format(product.price)}
            </span>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {product.category}
            </span>
          </div>
        </div>
        
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 font-medium shadow-sm hover:shadow-md disabled:cursor-not-allowed"
        >
          {isAdding ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Plus size={20} />
          )}
          {isAdding ? 'Agregando...' : 'Agregar al Carrito'}
        </button>
      </div>
    </article>
  );
});

ProductCard.displayName = 'ProductCard';

const LoadingSpinner = () => (
  <div className="flex flex-col justify-center items-center h-64">
    <Loader2 className="animate-spin h-12 w-12 text-blue-500 mb-4" />
    <p className="text-gray-600 font-medium">Cargando productos...</p>
  </div>
);

const ErrorMessage = ({ message, onRetry }) => (
  <div className="text-center py-12">
    <Package size={48} className="mx-auto mb-4 text-red-400" />
    <p className="text-red-600 mb-4 font-medium">{message}</p>
    <button
      onClick={onRetry}
      className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors"
    >
      Reintentar
    </button>
  </div>
);

const ProductGrid = () => {
  const { products, loading, error, refetch } = useProducts();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  return (
    <section>
      <header className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Productos Destacados</h2>
        <p className="text-gray-600">Descubre nuestra selección premium de tecnología</p>
      </header>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

const CartItem = React.memo(({ item }) => {
  const { addToCart, removeFromCart } = useCart();

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <span className="text-2xl flex-shrink-0">{item.image}</span>
        <div className="min-w-0 flex-1">
          <h4 className="font-medium text-gray-900 truncate">{item.name}</h4>
          <p className="text-sm text-gray-600">{CURRENCY_FORMATTER.format(item.price)}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3 ml-4">
        <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
          <button
            onClick={() => removeFromCart(item.id)}
            className="bg-white hover:bg-red-50 text-red-600 p-1 rounded shadow-sm transition-colors"
            aria-label="Disminuir cantidad"
          >
            <Minus size={14} />
          </button>
          <span className="px-3 py-1 font-medium text-sm min-w-[2rem] text-center">
            {item.quantity}
          </span>
          <button
            onClick={() => addToCart(item)}
            className="bg-white hover:bg-blue-50 text-blue-600 p-1 rounded shadow-sm transition-colors"
            aria-label="Aumentar cantidad"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>
    </div>
  );
});

CartItem.displayName = 'CartItem';

const CartDropdown = ({ isOpen, onClose }) => {
  const { cartItems, formattedTotal, isEmpty, clearCart } = useCart();

  // Cerrar con Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 top-full mt-2 w-96 max-w-[90vw] bg-white rounded-xl shadow-xl border z-50 max-h-[80vh] flex flex-col">
        <header className="p-4 border-b bg-gray-50 rounded-t-xl">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Mi Carrito</h3>
            {!isEmpty && (
              <button
                onClick={clearCart}
                className="text-xs text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-full transition-colors"
              >
                Vaciar
              </button>
            )}
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto">
          {isEmpty ? (
            <div className="p-8 text-center">
              <ShoppingCart size={48} className="mx-auto mb-3 text-gray-300" />
              <p className="text-gray-500 font-medium">Tu carrito está vacío</p>
              <p className="text-sm text-gray-400 mt-1">¡Agrega algunos productos!</p>
            </div>
          ) : (
            <div>
              {cartItems.map(item => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {!isEmpty && (
          <footer className="p-4 border-t bg-gradient-to-r from-gray-50 to-white rounded-b-xl">
            <div className="flex justify-between items-center mb-3">
              <span className="font-semibold text-gray-900">Total:</span>
              <span className="text-xl font-bold text-blue-600">{formattedTotal}</span>
            </div>
            <button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md">
              Finalizar Compra
            </button>
          </footer>
        )}
      </div>
    </>
  );
};

const CartButton = () => {
  const { totalItems } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  const toggleCart = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const closeCart = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <div className="relative">
      <button
        onClick={toggleCart}
        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2 px-4 rounded-lg flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md relative"
        aria-label={`Carrito con ${totalItems} items`}
      >
        <ShoppingCart size={20} />
        <span className="font-medium">Carrito</span>
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-lg animate-pulse">
            {totalItems}
          </span>
        )}
      </button>

      <CartDropdown isOpen={isOpen} onClose={closeCart} />
    </div>
  );
};

// ===== COMPONENTE PRINCIPAL =====
const EcommerceApp = () => {
  return (
    <CartProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  TechStore Pro
                </h1>
                <p className="text-sm text-gray-600">Tecnología de vanguardia</p>
              </div>
              <CartButton />
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          <ProductGrid />
        </main>

        <footer className="bg-white border-t border-gray-200 mt-16">
          <div className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-600">
            <p>&copy; 2024 TechStore Pro. Desarrollado con React y las mejores prácticas.</p>
          </div>
        </footer>
      </div>
    </CartProvider>
  );
};

export default EcommerceApp;