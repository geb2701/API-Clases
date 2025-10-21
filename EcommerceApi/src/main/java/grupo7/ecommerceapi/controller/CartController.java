package grupo7.ecommerceapi.controller;

import grupo7.ecommerceapi.entity.CartItem;
import grupo7.ecommerceapi.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5173" })
public class CartController {

    private final CartService cartService;

    // GET /api/cart/{sessionId} - Obtener items del carrito
    @GetMapping("/{sessionId}")
    public ResponseEntity<List<CartItem>> getCartItems(@PathVariable String sessionId) {
        List<CartItem> cartItems = cartService.getCartItems(sessionId);
        return ResponseEntity.ok(cartItems);
    }

    // POST /api/cart/{sessionId}/add - Agregar producto al carrito
    @PostMapping("/{sessionId}/add")
    public ResponseEntity<CartItem> addToCart(
            @PathVariable String sessionId,
            @RequestParam Long productId,
            @RequestParam(defaultValue = "1") Integer quantity,
            @RequestParam(required = false) Long userId) {

        try {
            CartItem cartItem = cartService.addToCart(sessionId, productId, quantity, userId);
            return ResponseEntity.ok(cartItem);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // PUT /api/cart/{sessionId}/update - Actualizar cantidad de un producto
    @PutMapping("/{sessionId}/update")
    public ResponseEntity<CartItem> updateCartItemQuantity(
            @PathVariable String sessionId,
            @RequestParam Long productId,
            @RequestParam Integer quantity) {

        try {
            CartItem cartItem = cartService.updateCartItemQuantity(sessionId, productId, quantity);
            return ResponseEntity.ok(cartItem);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // DELETE /api/cart/{sessionId}/remove - Quitar producto del carrito
    @DeleteMapping("/{sessionId}/remove")
    public ResponseEntity<Void> removeFromCart(
            @PathVariable String sessionId,
            @RequestParam Long productId) {

        try {
            cartService.removeFromCart(sessionId, productId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // DELETE /api/cart/{sessionId}/clear - Limpiar carrito
    @DeleteMapping("/{sessionId}/clear")
    public ResponseEntity<Void> clearCart(@PathVariable String sessionId) {
        cartService.clearCart(sessionId);
        return ResponseEntity.ok().build();
    }

    // GET /api/cart/{sessionId}/total - Obtener total del carrito
    @GetMapping("/{sessionId}/total")
    public ResponseEntity<BigDecimal> getCartTotal(@PathVariable String sessionId) {
        BigDecimal total = cartService.getCartTotal(sessionId);
        return ResponseEntity.ok(total);
    }

    // GET /api/cart/{sessionId}/count - Obtener cantidad de items en el carrito
    @GetMapping("/{sessionId}/count")
    public ResponseEntity<Integer> getCartItemsCount(@PathVariable String sessionId) {
        Integer count = cartService.getCartItemsCount(sessionId);
        return ResponseEntity.ok(count);
    }

    // GET /api/cart/{sessionId}/validate - Validar stock del carrito
    @GetMapping("/{sessionId}/validate")
    public ResponseEntity<Boolean> validateCartStock(@PathVariable String sessionId) {
        boolean isValid = cartService.validateCartStock(sessionId);
        return ResponseEntity.ok(isValid);
    }
}
