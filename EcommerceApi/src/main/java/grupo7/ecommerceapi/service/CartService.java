package grupo7.ecommerceapi.service;

import grupo7.ecommerceapi.entity.CartItem;
import grupo7.ecommerceapi.entity.CartSession;
import grupo7.ecommerceapi.entity.Product;
import grupo7.ecommerceapi.entity.User;
import grupo7.ecommerceapi.repository.CartItemRepository;
import grupo7.ecommerceapi.repository.CartSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class CartService {

    private final CartSessionRepository cartSessionRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductService productService;

    public CartSession getOrCreateCartSession(String sessionId, Long userId) {
        return cartSessionRepository.findById(sessionId)
                .orElseGet(() -> {
                    CartSession cartSession = new CartSession();
                    cartSession.setId(sessionId);
                    if (userId != null) {
                        // Si hay userId, buscar si ya existe una sesión para ese usuario
                        Optional<CartSession> existingSession = cartSessionRepository.findByUserId(userId);
                        if (existingSession.isPresent()) {
                            return existingSession.get();
                        }
                        // Crear nueva sesión para usuario logueado
                        cartSession.setUser(new User());
                        cartSession.getUser().setId(userId);
                    }
                    return cartSessionRepository.save(cartSession);
                });
    }

    public List<CartItem> getCartItems(String sessionId) {
        return cartItemRepository.findByCartSessionId(sessionId);
    }

    public CartItem addToCart(String sessionId, Long productId, Integer quantity, Long userId) {
        // Verificar que el producto existe y tiene stock
        Optional<Product> productOpt = productService.getProductById(productId);
        if (productOpt.isEmpty()) {
            throw new RuntimeException("Producto no encontrado");
        }

        Product product = productOpt.get();
        if (product.getStock() < quantity) {
            throw new RuntimeException("Stock insuficiente");
        }

        // Obtener o crear sesión del carrito
        CartSession cartSession = getOrCreateCartSession(sessionId, userId);

        // Verificar si el producto ya está en el carrito
        Optional<CartItem> existingItem = cartItemRepository.findByCartSessionIdAndProductId(sessionId, productId);

        if (existingItem.isPresent()) {
            // Actualizar cantidad
            CartItem item = existingItem.get();
            int newQuantity = item.getQuantity() + quantity;
            if (newQuantity > product.getStock()) {
                throw new RuntimeException("Stock insuficiente para la cantidad solicitada");
            }
            item.setQuantity(newQuantity);
            return cartItemRepository.save(item);
        } else {
            // Crear nuevo item
            CartItem cartItem = new CartItem();
            cartItem.setCartSession(cartSession);
            cartItem.setProduct(product);
            cartItem.setQuantity(quantity);
            return cartItemRepository.save(cartItem);
        }
    }

    public CartItem updateCartItemQuantity(String sessionId, Long productId, Integer quantity) {
        Optional<CartItem> cartItemOpt = cartItemRepository.findByCartSessionIdAndProductId(sessionId, productId);
        if (cartItemOpt.isEmpty()) {
            throw new RuntimeException("Item no encontrado en el carrito");
        }

        CartItem cartItem = cartItemOpt.get();
        Product product = cartItem.getProduct();

        if (quantity <= 0) {
            cartItemRepository.delete(cartItem);
            return null;
        }

        if (quantity > product.getStock()) {
            throw new RuntimeException("Stock insuficiente");
        }

        cartItem.setQuantity(quantity);
        return cartItemRepository.save(cartItem);
    }

    public void removeFromCart(String sessionId, Long productId) {
        cartItemRepository.deleteByCartSessionAndProduct(sessionId, productId);
    }

    public void clearCart(String sessionId) {
        cartItemRepository.deleteByCartSessionId(sessionId);
    }

    public BigDecimal getCartTotal(String sessionId) {
        List<CartItem> items = getCartItems(sessionId);
        return items.stream()
                .map(item -> item.getProduct().getActualPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public Integer getCartItemsCount(String sessionId) {
        List<CartItem> items = getCartItems(sessionId);
        return items.stream()
                .mapToInt(CartItem::getQuantity)
                .sum();
    }

    public boolean validateCartStock(String sessionId) {
        List<CartItem> items = getCartItems(sessionId);
        return items.stream()
                .allMatch(item -> item.getQuantity() <= item.getProduct().getStock());
    }
}
