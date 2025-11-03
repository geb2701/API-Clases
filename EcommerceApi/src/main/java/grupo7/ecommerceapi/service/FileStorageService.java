package grupo7.ecommerceapi.service;

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
    this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();

    try {
      Files.createDirectories(this.fileStorageLocation);
    } catch (IOException ex) {
      throw new RuntimeException("No se pudo crear el directorio de almacenamiento de archivos.", ex);
    }
  }

  /**
   * Guarda un archivo con un nombre único (UUID)
   */
  public String storeFile(MultipartFile file) {
    // Validar que el archivo no esté vacío
    if (file.isEmpty()) {
      throw new RuntimeException("No se puede guardar un archivo vacío");
    }

    // Obtener el nombre original del archivo
    String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());

    if (originalFileName == null || originalFileName.isEmpty()) {
      throw new RuntimeException("Nombre de archivo inválido");
    }

    // Validar que no contenga caracteres inválidos
    if (originalFileName.contains("..")) {
      throw new RuntimeException("El nombre del archivo contiene una secuencia de ruta inválida: " + originalFileName);
    }

    // Generar un nombre único para el archivo
    String fileExtension = "";
    int lastDotIndex = originalFileName.lastIndexOf('.');
    if (lastDotIndex > 0) {
      fileExtension = originalFileName.substring(lastDotIndex);
    }

    String uniqueFileName = UUID.randomUUID().toString() + fileExtension;

    try {
      // Copiar el archivo a la ubicación de destino
      Path targetLocation = this.fileStorageLocation.resolve(uniqueFileName);
      Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

      return uniqueFileName;
    } catch (IOException ex) {
      throw new RuntimeException("No se pudo guardar el archivo " + uniqueFileName + ". Por favor, inténtalo de nuevo.",
          ex);
    }
  }

  /**
   * Carga un archivo como Resource
   */
  public Resource loadFileAsResource(String fileName) {
    try {
      Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
      Resource resource = new UrlResource(filePath.toUri());

      if (resource.exists() && resource.isReadable()) {
        return resource;
      } else {
        throw new RuntimeException("Archivo no encontrado: " + fileName);
      }
    } catch (MalformedURLException ex) {
      throw new RuntimeException("Archivo no encontrado: " + fileName, ex);
    }
  }

  /**
   * Elimina un archivo
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
   * Verifica si un archivo existe
   */
  public boolean fileExists(String fileName) {
    Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
    return Files.exists(filePath);
  }
}


