/**
 * ========================================
 * SCRIPT DE PRUEBA DE ENDPOINTS DE LA API
 * ========================================
 * 
 * Este script prueba TODOS los endpoints de la API
 * para verificar que funcionan correctamente.
 * 
 * Ejecutar desde la consola del navegador (F12):
 * 1. Abre http://localhost:5173
 * 2. Abre la consola (F12)
 * 3. Copia y pega este código
 * 4. Ejecuta: await testAllEndpoints()
 */

const API_BASE = "http://localhost:8080/api";

// Utilidades
const log = {
  success: (msg: string) => console.log(`✅ ${msg}`),
  error: (msg: string) => console.error(`❌ ${msg}`),
  info: (msg: string) => console.log(`ℹ️  ${msg}`),
  section: (msg: string) => console.log(`\n${"=".repeat(50)}\n${msg}\n${"=".repeat(50)}`),
};

// ========================================
// 1. PRUEBAS DE PRODUCTOS
// ========================================
async function testProductsEndpoints() {
  log.section("PROBANDO ENDPOINTS DE PRODUCTOS");

  try {
    // GET /products - Listar todos
    log.info("GET /products - Listar productos");
    const productsRes = await fetch(`${API_BASE}/products`);
    const products = await productsRes.json();
    log.success(`${products.content.length} productos obtenidos`);
    console.table(products.content.slice(0, 3));

    // GET /products/{id} - Obtener por ID
    log.info("GET /products/1 - Obtener producto por ID");
    const productRes = await fetch(`${API_BASE}/products/1`);
    const product = await productRes.json();
    log.success(`Producto obtenido: ${product.name}`);

    // GET /products/category/{name} - Por categoría
    log.info("GET /products/category/Tecnología");
    const categoryRes = await fetch(`${API_BASE}/products/category/Tecnología`);
    const categoryProducts = await categoryRes.json();
    log.success(`${categoryProducts.content.length} productos en Tecnología`);

    // GET /products/search - Buscar
    log.info("GET /products/search?q=react");
    const searchRes = await fetch(`${API_BASE}/products/search?q=react`);
    const searchResults = await searchRes.json();
    log.success(`${searchResults.content.length} productos encontrados`);

    // GET /products/offers - Ofertas
    log.info("GET /products/offers - Productos con descuento");
    const offersRes = await fetch(`${API_BASE}/products/offers`);
    const offers = await offersRes.json();
    log.success(`${offers.content.length} productos en oferta`);

    // GET /products/low-stock - Stock bajo
    log.info("GET /products/low-stock?threshold=20");
    const lowStockRes = await fetch(`${API_BASE}/products/low-stock?threshold=20`);
    const lowStock = await lowStockRes.json();
    log.success(`${lowStock.length} productos con stock bajo`);

    return true;
  } catch (error) {
    log.error(`Error en productos: ${error}`);
    return false;
  }
}

// ========================================
// 2. PRUEBAS DE CATEGORÍAS
// ========================================
async function testCategoriesEndpoints() {
  log.section("PROBANDO ENDPOINTS DE CATEGORÍAS");

  try {
    // GET /categories - Listar todas
    log.info("GET /categories - Listar categorías");
    const categoriesRes = await fetch(`${API_BASE}/categories`);
    const categories = await categoriesRes.json();
    log.success(`${categories.length} categorías obtenidas`);
    console.table(categories);

    // GET /categories/{id} - Por ID
    log.info("GET /categories/1 - Obtener categoría por ID");
    const categoryRes = await fetch(`${API_BASE}/categories/1`);
    const category = await categoryRes.json();
    log.success(`Categoría obtenida: ${category.name}`);

    return true;
  } catch (error) {
    log.error(`Error en categorías: ${error}`);
    return false;
  }
}

// ========================================
// 3. PRUEBAS DE USUARIOS
// ========================================
async function testUsersEndpoints() {
  log.section("PROBANDO ENDPOINTS DE USUARIOS");

  try {
    // GET /users - Listar todos
    log.info("GET /users - Listar usuarios");
    const usersRes = await fetch(`${API_BASE}/users`);
    const users = await usersRes.json();
    log.success(`${users.length} usuarios obtenidos`);
    console.table(users.slice(0, 3).map(u => ({ id: u.id, name: u.name, email: u.email })));

    // GET /users/{id} - Por ID
    log.info("GET /users/1 - Obtener usuario por ID");
    const userRes = await fetch(`${API_BASE}/users/1`);
    const user = await userRes.json();
    log.success(`Usuario obtenido: ${user.name}`);

    // GET /users/email/{email} - Por email
    log.info("GET /users/email/demo@demo.com");
    const emailRes = await fetch(`${API_BASE}/users/email/demo@demo.com`);
    const emailUser = await emailRes.json();
    log.success(`Usuario obtenido: ${emailUser.name}`);

    // POST /users/check-email - Verificar email
    log.info("POST /users/check-email");
    const checkRes = await fetch(`${API_BASE}/users/check-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "demo@demo.com" }),
    });
    const exists = await checkRes.json();
    log.success(`Email existe: ${exists}`);

    return true;
  } catch (error) {
    log.error(`Error en usuarios: ${error}`);
    return false;
  }
}

// ========================================
// 4. PRUEBAS DE ÓRDENES
// ========================================
async function testOrdersEndpoints() {
  log.section("PROBANDO ENDPOINTS DE ÓRDENES");

  try {
    // GET /orders - Listar todas
    log.info("GET /orders - Listar órdenes");
    const ordersRes = await fetch(`${API_BASE}/orders`);
    const orders = await ordersRes.json();
    log.success(`${orders.length} órdenes obtenidas`);
    console.table(orders);

    // GET /orders/{id} - Por ID
    if (orders.length > 0) {
      const orderId = orders[0].id;
      log.info(`GET /orders/${orderId} - Obtener orden por ID`);
      const orderRes = await fetch(`${API_BASE}/orders/${orderId}`);
      const order = await orderRes.json();
      log.success(`Orden obtenida: #${order.orderNumber}`);
    }

    // GET /orders/user/{userId} - Por usuario
    log.info("GET /orders/user/2 - Órdenes de usuario");
    const userOrdersRes = await fetch(`${API_BASE}/orders/user/2`);
    const userOrders = await userOrdersRes.json();
    log.success(`${userOrders.length} órdenes del usuario`);

    return true;
  } catch (error) {
    log.error(`Error en órdenes: ${error}`);
    return false;
  }
}

// ========================================
// 5. PRUEBAS DE CARRITO
// ========================================
async function testCartEndpoints() {
  log.section("PROBANDO ENDPOINTS DE CARRITO");

  const testSessionId = `test-cart-${Date.now()}`;

  try {
    // POST /cart/{sessionId}/add - Agregar producto
    log.info(`POST /cart/${testSessionId}/add - Agregar al carrito`);
    const addRes = await fetch(
      `${API_BASE}/cart/${testSessionId}/add?productId=1&quantity=2`,
      { method: "POST" }
    );
    const addedItem = await addRes.json();
    log.success(`Producto agregado: ${addedItem.product.name} x${addedItem.quantity}`);

    // GET /cart/{sessionId} - Obtener items
    log.info(`GET /cart/${testSessionId} - Obtener items del carrito`);
    const cartRes = await fetch(`${API_BASE}/cart/${testSessionId}`);
    const cartItems = await cartRes.json();
    log.success(`${cartItems.length} items en el carrito`);
    console.table(cartItems);

    // GET /cart/{sessionId}/count - Cantidad de items
    log.info(`GET /cart/${testSessionId}/count - Contar items`);
    const countRes = await fetch(`${API_BASE}/cart/${testSessionId}/count`);
    const count = await countRes.json();
    log.success(`Total de items: ${count}`);

    // GET /cart/{sessionId}/total - Total del carrito
    log.info(`GET /cart/${testSessionId}/total - Total del carrito`);
    const totalRes = await fetch(`${API_BASE}/cart/${testSessionId}/total`);
    const total = await totalRes.json();
    log.success(`Total: $${total}`);

    // PUT /cart/{sessionId}/update - Actualizar cantidad
    log.info(`PUT /cart/${testSessionId}/update - Actualizar cantidad`);
    const updateRes = await fetch(
      `${API_BASE}/cart/${testSessionId}/update?productId=1&quantity=3`,
      { method: "PUT" }
    );
    const updatedItem = await updateRes.json();
    log.success(`Cantidad actualizada: ${updatedItem.quantity}`);

    // GET /cart/{sessionId}/validate - Validar stock
    log.info(`GET /cart/${testSessionId}/validate - Validar stock`);
    const validateRes = await fetch(`${API_BASE}/cart/${testSessionId}/validate`);
    const isValid = await validateRes.json();
    log.success(`Stock válido: ${isValid}`);

    // DELETE /cart/{sessionId}/remove - Quitar producto
    log.info(`DELETE /cart/${testSessionId}/remove - Quitar del carrito`);
    await fetch(`${API_BASE}/cart/${testSessionId}/remove?productId=1`, {
      method: "DELETE",
    });
    log.success("Producto eliminado del carrito");

    // DELETE /cart/{sessionId}/clear - Limpiar carrito
    log.info(`DELETE /cart/${testSessionId}/clear - Limpiar carrito`);
    await fetch(`${API_BASE}/cart/${testSessionId}/clear`, { method: "DELETE" });
    log.success("Carrito limpiado");

    return true;
  } catch (error) {
    log.error(`Error en carrito: ${error}`);
    return false;
  }
}

// ========================================
// 6. PRUEBAS DE ARCHIVOS
// ========================================
async function testFilesEndpoints() {
  log.section("PROBANDO ENDPOINTS DE ARCHIVOS");

  try {
    // GET /files/{fileName} - Obtener archivo
    log.info("GET /files/camiseta-react.png - Obtener imagen");
    const fileRes = await fetch(`${API_BASE}/files/camiseta-react.png`);
    if (fileRes.ok) {
      log.success("Imagen cargada correctamente");
    } else {
      log.error("No se pudo cargar la imagen");
    }

    return true;
  } catch (error) {
    log.error(`Error en archivos: ${error}`);
    return false;
  }
}

// ========================================
// EJECUTAR TODAS LAS PRUEBAS
// ========================================
export async function testAllEndpoints() {
  console.clear();
  log.section("🚀 INICIANDO PRUEBAS DE TODOS LOS ENDPOINTS");

  const results = {
    products: false,
    categories: false,
    users: false,
    orders: false,
    cart: false,
    files: false,
  };

  results.products = await testProductsEndpoints();
  await new Promise((resolve) => setTimeout(resolve, 1000));

  results.categories = await testCategoriesEndpoints();
  await new Promise((resolve) => setTimeout(resolve, 1000));

  results.users = await testUsersEndpoints();
  await new Promise((resolve) => setTimeout(resolve, 1000));

  results.orders = await testOrdersEndpoints();
  await new Promise((resolve) => setTimeout(resolve, 1000));

  results.cart = await testCartEndpoints();
  await new Promise((resolve) => setTimeout(resolve, 1000));

  results.files = await testFilesEndpoints();

  // Resumen
  log.section("📊 RESUMEN DE PRUEBAS");
  const total = Object.keys(results).length;
  const passed = Object.values(results).filter(Boolean).length;
  const failed = total - passed;

  console.log(`
    Total de módulos probados: ${total}
    ✅ Exitosos: ${passed}
    ❌ Fallidos: ${failed}
    
    Resultados por módulo:
    ${Object.entries(results)
      .map(([name, result]) => `${result ? "✅" : "❌"} ${name}`)
      .join("\n    ")}
  `);

  if (failed === 0) {
    log.success("🎉 ¡TODAS LAS PRUEBAS PASARON EXITOSAMENTE!");
  } else {
    log.error(`⚠️  ${failed} módulo(s) fallaron. Revisa los errores arriba.`);
  }

  return results;
}

// Auto-ejecutar si se importa en consola
if (typeof window !== "undefined") {
  (window as any).testAllEndpoints = testAllEndpoints;
  console.log(`
    ✨ Script de prueba cargado ✨
    
    Para ejecutar todas las pruebas:
    → await testAllEndpoints()
    
    Asegúrate de que el backend esté corriendo en:
    http://localhost:8080
  `);
}





