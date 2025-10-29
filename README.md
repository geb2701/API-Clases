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

## 🐳 Ejecución con Docker (Recomendado)

La forma más sencilla de ejecutar el proyecto completo es usando Docker Compose.

📖 **Documentación Docker:**
- 🚀 **[Inicio Rápido](./INICIO_RAPIDO.md)** - ¡Empieza en 3 pasos!
- 📚 **[Guía Completa](./DOCKER.md)** - Instrucciones detalladas, troubleshooting y comandos avanzados
- ✅ **[Checklist](./CHECKLIST.md)** - Verifica que todo funcione correctamente
- 📋 **[Resumen Docker](./RESUMEN_DOCKER.md)** - Cambios realizados y arquitectura

### Prerequisitos
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Inicio Rápido

**Opción 1: Scripts automáticos** (Recomendado)

```bash
# Windows
.\start.bat

# Linux/Mac
./start.sh
```

**Opción 2: Docker Compose manual**

1. **Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd API-Clases
```

2. **Iniciar todos los servicios**
```bash
docker-compose up -d --build
```

Esto iniciará:
- **MySQL** en puerto 3306 (con datos iniciales)
- **Backend Spring Boot** en puerto 8080
- **Frontend React** en puerto 80

3. **Acceder a la aplicación**
- Frontend: http://localhost
- Backend API: http://localhost:8080/api
- MySQL: localhost:3306

4. **Ver logs**
```bash
# Todos los servicios
docker-compose logs -f

# Solo backend
docker-compose logs -f backend

# Solo frontend
docker-compose logs -f frontend
```

5. **Detener los servicios**

```bash
# Con scripts
.\stop.bat      # Windows
./stop.sh       # Linux/Mac

# Manual
docker-compose down
```

6. **Detener y eliminar datos (reset completo)**
```bash
docker-compose down -v
```

### Comandos útiles

```bash
# Reconstruir imágenes (después de cambios en el código)
docker-compose up -d --build

# Reiniciar un servicio específico
docker-compose restart backend

# Ver estado de los contenedores
docker-compose ps

# Acceder a la consola de MySQL
docker-compose exec mysql mysql -u ecommerce_user -pecommerce_pass ecommerce_db
```

---

## ⚙️ Ejecución Manual (Sin Docker)

### Configurar Base de Datos

1. Instalar XAMPP o MySQL
2. Iniciar MySQL
3. Crear la base de datos:
```sql
CREATE DATABASE ecommerce_db;
```
4. Ejecutar los scripts SQL en orden:
   - `db/database_schema.sql`
   - `db/poblar_base_datos_completa.sql`

Nota: Si genera algún error de tipo "'root'@'localhost' (using password: YES)", configurar `EcommerceApi/src/main/resources/application.properties` sin password

### Ejecutar Backend

1. Abrir `EcommerceApi` en IntelliJ IDEA
2. Esperar a que descargue las dependencias Maven
3. Ejecutar `EcommerceApiApplication.java`
4. El backend estará disponible en http://localhost:8080/api

### Ejecutar Frontend

```bash
# Instalar pnpm si no lo tienes
npm install -g pnpm

# Instalar dependencias
pnpm install

# Iniciar en modo desarrollo
pnpm dev
```

El frontend estará disponible en http://localhost:3000

---

## 👥 Integrantes

- **Augusto Roubineau**
  - Legajo: 
  - GitHub: [AugstR](https://github.com/AugstR)
 **Tomas Angulo**
  - Legajo: 1153717
  - GitHub: [TomasaDev](https://github.com/TomasADev)
   **Tobías Traverso**
  - Legajo: 1117470
  - GitHub: [Tobias024](https://github.com/Tobias024)
     **Matias Pedemonte**
  - Legajo: 1180644
  - GitHub: [catafrulo](https://github.com/catafrulo)
     **Dahiana Poggi**
  - Legajo: 1151380
  - GitHub: [Dahianapoggi](https://github.com/Dahianapoggi)
     **Paloma Irigoyen Ochoa**
  - Legajo: 1171277
  - GitHub: [pirigoyenochoa](https://github.com/pirigoyenochoa)
       **Salvatierra Valentino**
  - Legajo: 1150644
  - GitHub: [tinacho05](https://github.com/tinacho05)
       **Gustavo Bruno**
  - Legajo: 1172421
  - GitHub: [geb2701](https://github.com/geb2701)
---

## 📌 Objetivo

Construir un **frontend moderno, modular y escalable** para una tienda online, aplicando buenas prácticas de desarrollo con **React** y apoyándonos en librerías que optimicen la experiencia de usuario, el flujo de datos y la calidad del código.
