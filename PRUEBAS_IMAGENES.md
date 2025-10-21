# 🧪 Guía de Pruebas - Sistema de Imágenes

## Preparación

### 1. Iniciar el Backend

**Opción A: Desde IntelliJ IDEA**
```
1. Abrir el proyecto en IntelliJ
2. Buscar la clase: EcommerceApiApplication.java
3. Click derecho → Run 'EcommerceApiApplication'
```

**Opción B: Desde terminal**
```bash
./mvnw spring-boot:run
```

**Verificar que está corriendo:**
- Debe mostrar: "Started EcommerceApiApplication in X seconds"
- Puerto: `http://localhost:8080`

### 2. Iniciar el Frontend

```bash
npm run dev
# o
pnpm dev
```

**Verificar que está corriendo:**
- URL: `http://localhost:5173` (o el puerto que indique)

---

## 🧪 Casos de Prueba

### Test 1: Subir una Imagen Nueva

**Pasos:**
1. Navegar a la página de agregar producto
   - URL: `http://localhost:5173/gestionar/agregar`
2. Completar el formulario:
   - Nombre: "Producto de Prueba"
   - Descripción: "Descripción de prueba"
   - Precio: 99.99
   - Categoría: Seleccionar cualquiera
   - Stock: 10
3. **Click en el input de imagen** y seleccionar una imagen de prueba
4. **Verificar:**
   - ✅ Aparece mensaje: "Imagen cargada - La imagen se ha subido correctamente"
   - ✅ Se muestra vista previa de la imagen
   - ✅ Aparece botón X para remover la imagen

5. Click en "Agregar Producto"
6. **Verificar:**
   - ✅ Mensaje de éxito
   - ✅ Producto creado correctamente

---

### Test 2: Verificar Imagen en el Servidor

**Pasos:**
1. Navegar a la carpeta del proyecto
2. Ir a: `uploads/images/`
3. **Verificar:**
   - ✅ Existe un archivo con formato: `uuid-xxxxx.jpg` (o la extensión de tu imagen)

**Verificar en navegador:**
1. Copiar el nombre del archivo
2. Abrir en navegador: `http://localhost:8080/api/files/nombre-del-archivo.jpg`
3. **Verificar:**
   - ✅ Se muestra la imagen correctamente

---

### Test 3: Validación de Tipo de Archivo

**Pasos:**
1. En el formulario de agregar producto
2. Intentar subir un archivo que NO sea imagen (ej: .pdf, .txt, .zip)
3. **Verificar:**
   - ✅ Aparece mensaje de error: "Archivo inválido"
   - ✅ No se sube el archivo
   - ✅ No hay vista previa

---

### Test 4: Validación de Tamaño

**Pasos:**
1. Preparar una imagen mayor a 5MB
2. Intentar subirla en el formulario
3. **Verificar:**
   - ✅ Aparece mensaje: "Archivo muy grande - La imagen no debe superar los 5MB"
   - ✅ No se sube el archivo

---

### Test 5: Remover Imagen Seleccionada

**Pasos:**
1. Seleccionar una imagen en el formulario
2. Esperar a que se cargue
3. Click en el botón X (remover)
4. **Verificar:**
   - ✅ La vista previa desaparece
   - ✅ El input de archivo se limpia
   - ✅ Se puede seleccionar otra imagen

---

### Test 6: Editar Producto - Mantener Imagen Original

**Pasos:**
1. Crear un producto con imagen (Test 1)
2. Navegar a gestionar productos
3. Click en "Editar" en el producto recién creado
4. Modificar solo el nombre o precio (NO tocar la imagen)
5. Click en "Guardar Cambios"
6. **Verificar:**
   - ✅ Producto actualizado
   - ✅ Imagen original se mantiene
   - ✅ Se sigue mostrando correctamente

---

### Test 7: Editar Producto - Cambiar Imagen

**Pasos:**
1. Editar un producto existente
2. Seleccionar una NUEVA imagen
3. Esperar a que se cargue
4. **Verificar vista previa:**
   - ✅ Se muestra la nueva imagen
   - ✅ Aparece mensaje de éxito
5. Click en "Guardar Cambios"
6. **Verificar:**
   - ✅ Producto actualizado con nueva imagen
   - ✅ La nueva imagen se muestra en todas partes

---

### Test 8: Visualización de Imágenes

**Lugares donde debe aparecer la imagen:**

1. **Página Principal (Home)**
   - ✅ Productos destacados
   - ✅ Productos por categoría

2. **Página de Productos**
   - ✅ Grid de productos
   - ✅ Click en imagen abre modal

3. **Detalle de Producto**
   - ✅ Imagen grande
   - ✅ Click abre modal

4. **Carrito (Sidebar)**
   - ✅ Miniatura en cada item

5. **Checkout**
   - ✅ Miniatura en resumen

6. **Administración**
   - ✅ Grid de productos
   - ✅ Formularios de edición

---

### Test 9: Restaurar Imagen Original (Edit)

**Pasos:**
1. Editar un producto
2. Seleccionar una nueva imagen
3. Click en el botón X (restaurar)
4. **Verificar:**
   - ✅ Se muestra nuevamente la imagen original
   - ✅ El input de archivo se limpia
   - ✅ Al guardar, mantiene la imagen original

---

### Test 10: Limpiar Formulario (Add)

**Pasos:**
1. Formulario de agregar producto
2. Completar todos los campos + imagen
3. Click en "Limpiar"
4. **Verificar:**
   - ✅ Todos los campos se limpian
   - ✅ La imagen se remueve
   - ✅ Vista previa desaparece

---

## 🔍 Verificaciones del Backend

### Test 11: Endpoint Upload

**Con Postman o cURL:**

```bash
curl -X POST http://localhost:8080/api/files/upload \
  -F "file=@/ruta/a/tu/imagen.jpg"
```

**Verificar respuesta:**
```json
{
  "fileName": "uuid-xxxx.jpg",
  "fileUrl": "http://localhost:8080/api/files/uuid-xxxx.jpg",
  "fileType": "image/jpeg",
  "size": "123456"
}
```

---

### Test 12: Endpoint Get File

```bash
curl http://localhost:8080/api/files/nombre-del-archivo.jpg
```

**Verificar:**
- ✅ Devuelve el contenido de la imagen
- ✅ Header: `Content-Type: image/jpeg`

---

### Test 13: Endpoint Delete

```bash
curl -X DELETE http://localhost:8080/api/files/nombre-del-archivo.jpg
```

**Verificar:**
```json
{
  "message": "Archivo eliminado correctamente"
}
```

---

## ❌ Tests de Errores

### Test 14: Archivo Vacío

**Pasos:**
1. Intentar subir sin seleccionar archivo
2. **Verificar:**
   - ✅ Error: "Por favor seleccione un archivo"

---

### Test 15: Archivo No Imagen (Backend)

**Con cURL:**
```bash
curl -X POST http://localhost:8080/api/files/upload \
  -F "file=@/ruta/a/documento.pdf"
```

**Verificar:**
```json
{
  "error": "Solo se permiten archivos de imagen"
}
```

---

### Test 16: Archivo Muy Grande (Backend)

**Intentar subir archivo > 5MB**

**Verificar:**
```json
{
  "error": "El archivo no debe superar los 5MB"
}
```

---

## 📊 Checklist Final

Antes de dar por finalizado, verificar:

- [ ] Backend corre sin errores
- [ ] Frontend corre sin errores
- [ ] Se pueden agregar productos con imagen
- [ ] Se pueden editar productos y cambiar imagen
- [ ] Se pueden editar productos manteniendo imagen
- [ ] Imágenes se muestran en todas las páginas
- [ ] Validaciones funcionan (tipo y tamaño)
- [ ] Directorio `uploads/images/` contiene las imágenes
- [ ] Endpoints responden correctamente
- [ ] No hay errores en consola del navegador
- [ ] No hay errores en logs del backend

---

## 🐛 Problemas Comunes

### Problema: "Error al subir imagen"

**Solución:**
1. Verificar que el backend esté corriendo
2. Verificar que la URL sea correcta: `http://localhost:8080/api/`
3. Revisar logs del backend para más detalles

### Problema: "Las imágenes no se muestran"

**Solución:**
1. Verificar que el archivo exista en `uploads/images/`
2. Verificar que el endpoint GET funcione: `http://localhost:8080/api/files/nombre.jpg`
3. Revisar CORS en el backend

### Problema: "No se puede crear directorio"

**Solución:**
1. Verificar permisos de escritura
2. Crear manualmente: `mkdir -p uploads/images`
3. Verificar `file.upload-dir` en `application.properties`

---

## ✅ Resultado Esperado

Si todas las pruebas pasan:
- ✅ Sistema de imágenes **100% funcional**
- ✅ Validaciones **funcionando**
- ✅ UI **responsive y clara**
- ✅ Backend **robusto**

¡El sistema está listo para usar! 🎉

