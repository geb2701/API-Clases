# Store TPO

Frontend de una tienda online desarrollado con **React**, **TypeScript** y un stack moderno de librerías que optimizan la construcción de interfaces, la navegación y el manejo de datos.

## 🚀 Tecnologías utilizadas

### [React](https://es.react.dev)

Framework de **JavaScript** para construir interfaces de usuario.

- Permite crear componentes reutilizables.
- Maneja el estado de forma eficiente con su sistema de renderizado reactivo.
- Base del proyecto para construir la tienda online.

### [TypeScript](https://www.typescriptlang.org)

Superset de **JavaScript** con tipado estático.

- Ayuda a prevenir errores en tiempo de desarrollo.
- Mejora la mantenibilidad del código.
- Facilita el trabajo en equipo gracias a la autocompletación y documentación automática.

### [ShadCn UI](https://ui.shadcn.com)

Colección de componentes de interfaz construidos sobre **Radix UI** y estilizados con **TailwindCSS**.

- Ofrece componentes modernos y accesibles listos para usar.
- Se integran fácilmente en proyectos React + TypeScript.
- Útil para crear el diseño consistente de la tienda (botones, formularios, menús, tablas, etc.).

### [Vite](https://vite.dev)

Herramienta de construcción de aplicaciones modernas.

- Reemplazo de **Webpack** mucho más rápido y simple.
- Ofrece un servidor de desarrollo con **Hot Module Replacement (HMR)**.
- Mejora los tiempos de build y optimización de la app para producción.

### [TanStack Query](https://tanstack.com/query/latest)

Librería para el manejo de estado remoto y consultas a API.

- Simplifica el **fetching, caching y sincronización** de datos.
- Ideal para consumir los endpoints del backend de la tienda (productos, usuarios, carrito, etc.).
- Evita reescribir lógica repetitiva de `fetch` y estados de carga/error.

### [TanStack Router](https://tanstack.com/router/latest)

Router moderno para aplicaciones React.

- Facilita la navegación declarativa dentro de la app.
- Permite crear rutas anidadas, loaders y protección de rutas.
- Fundamental para estructurar secciones de la tienda (inicio, catálogo, detalle de producto, carrito, checkout).

### [Biome](https://biomejs.dev)

Herramienta todo en uno para formateo, linting y análisis de código.

- **Reemplazo moderno** de ESLint + Prettier.
- Asegura un estilo de código consistente y detecta errores comunes.
- Rápido y fácil de integrar en proyectos TypeScript.
- Mejora la productividad y calidad del código en equipo.

---

## ⚙️ Comandos principales

### 1. Instalar pnpm

El proyecto utiliza **pnpm** como gestor de paquetes. Si no lo tenés instalado:

```bash
npm install -g pnpm
```

### 2. Instalar dependencias del proyecto

Dentro de la carpeta raíz del proyecto, ejecutar:

```bash
pnpm install
```

### 3. Scripts disponibles

En el archivo `package.json` están definidos los siguientes comandos:

- **Iniciar en modo desarrollo**

  ```bash
  pnpm dev
  ```

  Inicia el servidor de desarrollo en el puerto **3000**.

- **Iniciar (alias de dev)**

  ```bash
  pnpm start
  ```

  También levanta el servidor de desarrollo en el puerto **3000**.

- **Compilar para producción**

  ```bash
  pnpm build
  ```

  Genera la build optimizada del proyecto con **Vite** y corre **TypeScript (tsc)**.

- **Previsualizar build**

  ```bash
  pnpm serve
  ```

  Sirve la aplicación generada en la carpeta `dist`.

- **Formatear código**

  ```bash
  pnpm format
  ```

  Aplica formato al código usando **Biome**.

- **Linting**

  ```bash
  pnpm lint
  ```

  Analiza el código con **Biome** para detectar problemas de estilo y errores comunes.

- **Check**
  ```bash
  pnpm check
  ```
  Ejecuta todas las verificaciones integradas de **Biome** (lint, formateo, etc.).

---

## 👥 Integrantes

- **Pedro Alvarez**
  - Legajo: 12345678
  - GitHub: [githubLink](githubLink)

---

## 📌 Objetivo

Construir un **frontend moderno, modular y escalable** para una tienda online, aplicando buenas prácticas de desarrollo con **React** y apoyándonos en librerías que optimicen la experiencia de usuario, el flujo de datos y la calidad del código.
