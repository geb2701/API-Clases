import { apiClient } from "@/lib/generic-ky-client";

/**
 * Respuesta de la API al subir un archivo
 */
export interface UploadResponse {
  fileName: string;
  fileUrl: string;
  fileType: string;
  size: string;
}

/**
 * Sube una imagen al servidor
 * @param file Archivo de imagen a subir
 * @returns Información del archivo subido
 */
export const uploadImage = async (file: File): Promise<UploadResponse> => {
  // Validar que sea una imagen
  if (!file.type.startsWith("image/")) {
    throw new Error("El archivo debe ser una imagen");
  }

  // Validar tamaño (máximo 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB en bytes
  if (file.size > maxSize) {
    throw new Error("La imagen no debe superar los 5MB");
  }

  // Crear FormData para enviar el archivo
  const formData = new FormData();
  formData.append("file", file);

  // Realizar petición sin el header Content-Type para que el navegador lo establezca automáticamente
  const response = await apiClient.post("files/upload", {
    body: formData,
    // No establecer Content-Type manualmente para multipart/form-data
    headers: {},
  });

  const data = await response.json<UploadResponse>();
  return data;
};

/**
 * Elimina una imagen del servidor
 * @param fileName Nombre del archivo a eliminar
 */
export const deleteImage = async (fileName: string): Promise<void> => {
  await apiClient.delete(`files/${fileName}`);
};

/**
 * Construye la URL completa de una imagen
 * @param fileName Nombre del archivo
 * @returns URL completa de la imagen
 */
export const getImageUrl = (fileName: string): string => {
  if (!fileName) {
    console.warn('getImageUrl: fileName is empty or undefined');
    return '/placeholder.png';
  }

  // 1. Si ya es una URL completa (de internet), devolverla tal cual
  if (fileName.startsWith("http://") || fileName.startsWith("https://")) {
    return fileName;
  }
  
  // 2. Si ya tiene una ruta completa, usarla tal cual
  if (fileName.startsWith("/images/") || fileName.startsWith("/api/")) {
    return fileName;
  }
  
  // 3. Detectar si es una imagen nueva (subida por admin)
  // Las imágenes nuevas tienen UUID al inicio: "abc123-def456-7890-1234-567890abcdef.png"
  // El formato UUID es: 8-4-4-4-12 caracteres hexadecimales separados por guiones
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
  const hasUUID = uuidRegex.test(fileName);
  
  if (hasUUID) {
    // Imagen nueva subida al backend → usar endpoint de archivos
    const url = `http://localhost:8080/api/files/${fileName}`;
    console.log('getImageUrl: UUID detected, returning:', url);
    return url;
  }
  
  // 4. Imágenes antiguas (sin UUID) → usar carpeta public/images
  // Vite sirve archivos de public/ directamente
  console.log('getImageUrl: No UUID detected, using /images/', fileName);
  return `/images/${fileName}`;
};

