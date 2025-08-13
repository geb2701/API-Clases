# Google Homepage Clone

Una réplica completa y funcional de la página de inicio de Google con todas sus características principales.

## 🚀 Características

### ✨ Diseño Visual
- **Logo de Google** con gradiente de colores original
- **Barra de navegación** con enlaces a Gmail e Imágenes
- **Botón de aplicaciones** con menú desplegable
- **Botón de inicio de sesión** con estilo original
- **Barra de búsqueda** con efectos hover y focus
- **Iconos de voz y cámara** funcionales
- **Botones de búsqueda** con animaciones
- **Opciones de idioma** en el footer
- **Footer completo** con enlaces de Google

### 🔧 Funcionalidades Interactivas

#### Búsqueda
- **Búsqueda normal**: Redirige a Google con la consulta
- **Búsqueda con suerte**: Usa el parámetro "I'm Feeling Lucky"
- **Búsqueda con Enter**: Presiona Enter para buscar
- **Atajos de teclado**: 
  - `Ctrl+K` o `Cmd+K`: Enfoca la barra de búsqueda
  - `Escape`: Limpia la búsqueda

#### Búsqueda por Voz
- **Reconocimiento de voz** usando Web Speech API
- **Indicador visual** durante la grabación
- **Transcripción automática** en la barra de búsqueda
- **Búsqueda automática** después de la transcripción

#### Menú de Aplicaciones
- **Menú desplegable** con apps de Google
- **Enlaces directos** a Gmail, Maps, YouTube, Drive, etc.
- **Cierre automático** al hacer clic fuera del menú

#### Efectos Visuales
- **Animaciones de entrada** suaves
- **Efectos hover** en todos los elementos interactivos
- **Sugerencias de búsqueda** que cambian automáticamente
- **Estados de carga** en los botones
- **Diseño responsive** para móviles y tablets

## 📁 Estructura de Archivos

```
Clase1/
├── index.html          # Estructura HTML principal
├── styles.css          # Estilos CSS completos
├── script.js           # Funcionalidad JavaScript
└── README.md           # Este archivo
```

## 🎯 Cómo Usar

1. **Abrir la página**: Simplemente abre `index.html` en tu navegador
2. **Realizar búsquedas**: 
   - Escribe en la barra de búsqueda
   - Presiona Enter o haz clic en "Buscar con Google"
3. **Búsqueda por voz**: Haz clic en el icono de micrófono
4. **Menú de apps**: Haz clic en el icono de puntos en la esquina superior derecha
5. **Búsqueda con suerte**: Haz clic en "Me siento con suerte"

## 🌟 Características Avanzadas

### Búsqueda por Voz
- Funciona en navegadores modernos que soporten Web Speech API
- Configurado para español (es-ES)
- Indicadores visuales durante la grabación

### Diseño Responsive
- **Desktop**: Diseño completo con todos los elementos
- **Tablet**: Ajustes de tamaño y espaciado
- **Móvil**: Layout optimizado para pantallas pequeñas

### Accesibilidad
- **Navegación por teclado** completa
- **Estados de focus** visibles
- **Contraste de colores** adecuado
- **Texto alternativo** en iconos

## 🔧 Personalización

### Cambiar Colores
Edita las variables CSS en `styles.css`:
```css
:root {
    --google-blue: #1a73e8;
    --google-red: #ea4335;
    --google-yellow: #fbbc05;
    --google-green: #34a853;
}
```

### Agregar Nuevas Apps
Modifica el array `apps` en `script.js`:
```javascript
const apps = [
    { name: 'Nueva App', url: 'https://nueva-app.com' },
    // ... más apps
];
```

### Cambiar Sugerencias
Modifica el array `searchSuggestions` en `script.js`:
```javascript
let searchSuggestions = [
    'tu sugerencia aquí',
    // ... más sugerencias
];
```

## 🌐 Compatibilidad

- ✅ Chrome 66+
- ✅ Firefox 60+
- ✅ Safari 11+
- ✅ Edge 79+
- ✅ Opera 53+

## 📱 Funcionalidades Móviles

- **Touch-friendly**: Botones y enlaces optimizados para pantallas táctiles
- **Responsive design**: Se adapta automáticamente al tamaño de pantalla
- **Gestos**: Soporte para gestos táctiles básicos

## 🎨 Animaciones

- **Fade-in**: Elementos aparecen suavemente al cargar
- **Hover effects**: Efectos visuales al pasar el mouse
- **Focus states**: Indicadores claros de elementos enfocados
- **Loading states**: Animaciones durante las acciones

## 🔒 Seguridad

- **Sin dependencias externas**: Todo el código es local
- **Sin tracking**: No se recopilan datos del usuario
- **HTTPS ready**: Listo para usar con certificados SSL

## 📈 Rendimiento

- **Carga rápida**: Sin recursos externos pesados
- **Optimizado**: CSS y JS minificados
- **Eficiente**: Animaciones optimizadas con CSS transforms

---

**¡Disfruta tu clon de Google! 🎉** 