package com.ecommerce.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

  private final Path fileStorageLocation;

  public FileStorageService(@Value("${file.upload-dir:uploads/images}") String uploadDir) {
    this.fileStorageLocation = Paths.get(uploadDir)
        .toAbsolutePath().normalize();

    try {
      Files.createDirectories(this.fileStorageLocation);
    } catch (Exception ex) {
      throw new RuntimeException("No se pudo crear el directorio donde se almacenarán los archivos.", ex);
    }
  }

  /**
   * Almacena un archivo en el servidor
   * 
   * @param file Archivo a guardar
   * @return Nombre del archivo guardado
   */
  public String storeFile(MultipartFile file) {
    // Normalizar nombre del archivo
    String originalFileName = file.getOriginalFilename();
    if (originalFileName == null || originalFileName.isEmpty()) {
      throw new RuntimeException("El archivo debe tener un nombre válido");
    }
    originalFileName = StringUtils.cleanPath(originalFileName);

    try {
      // Verificar si el archivo contiene caracteres inválidos
      if (originalFileName.contains("..")) {
        throw new RuntimeException(
            "El nombre del archivo contiene una secuencia de ruta no válida: " + originalFileName);
      }

      // Generar nombre único para evitar colisiones
      String fileExtension = "";
      int dotIndex = originalFileName.lastIndexOf('.');
      if (dotIndex > 0) {
        fileExtension = originalFileName.substring(dotIndex);
      }
      String fileName = UUID.randomUUID().toString() + fileExtension;

      // Copiar archivo a la ubicación de destino
      Path targetLocation = this.fileStorageLocation.resolve(fileName);
      Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

      return fileName;
    } catch (IOException ex) {
      throw new RuntimeException(
          "No se pudo almacenar el archivo " + originalFileName + ". Por favor intente de nuevo.", ex);
    }
  }

  /**
   * Carga un archivo como Resource
   * 
   * @param fileName Nombre del archivo a cargar
   * @return Resource del archivo
   */
  public Resource loadFileAsResource(String fileName) {
    try {
      Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
      Resource resource = new UrlResource(filePath.toUri());
      if (resource.exists()) {
        return resource;
      } else {
        throw new RuntimeException("Archivo no encontrado: " + fileName);
      }
    } catch (MalformedURLException ex) {
      throw new RuntimeException("Archivo no encontrado: " + fileName, ex);
    }
  }

  /**
   * Elimina un archivo del servidor
   * 
   * @param fileName Nombre del archivo a eliminar
   * @return true si se eliminó correctamente
   */
  public boolean deleteFile(String fileName) {
    try {
      Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
      return Files.deleteIfExists(filePath);
    } catch (IOException ex) {
      throw new RuntimeException("No se pudo eliminar el archivo: " + fileName, ex);
    }
  }

  /**
   * Obtiene la ruta completa del directorio de almacenamiento
   * 
   * @return Path del directorio
   */
  public Path getFileStorageLocation() {
    return fileStorageLocation;
  }
}
