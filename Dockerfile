# Etapa 1: Build
FROM node:20-alpine AS build

WORKDIR /app

# Instalar pnpm
RUN npm install -g pnpm

# Copiar archivos de configuración de paquetes
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Instalar dependencias
RUN pnpm install --frozen-lockfile

# Copiar el resto del código
COPY . .

# Argumentos para la construcción
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Compilar la aplicación
RUN pnpm build

# Etapa 2: Runtime con Nginx
FROM nginx:alpine

# Copiar la build al directorio de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

