package grupo7.ecommerceapi.controller;

import grupo7.ecommerceapi.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/files")
@RequiredArgsConstructor
public class FileUploadController {

  private final FileStorageService fileStorageService;

  /**
   * POST /api/files/upload - Subir un archivo (imagen)
   */
  @PostMapping("/upload")
  public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) {
    try {
      // Validar que sea una imagen
      String contentType = file.getContentType();
      if (contentType == null || !contentType.startsWith("image/")) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", "Solo se permiten archivos de imagen");
        return ResponseEntity.badRequest().body(errorResponse);
      }

      // Validar tamaño (5MB máximo)
      long maxSize = 5 * 1024 * 1024; // 5MB
      if (file.getSize() > maxSize) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", "El archivo no debe superar los 5MB");
        return ResponseEntity.badRequest().body(errorResponse);
      }

      // Guardar el archivo
      String fileName = fileStorageService.storeFile(file);

      // Crear respuesta
      Map<String, String> response = new HashMap<>();
      response.put("fileName", fileName);
      response.put("fileUrl", "/api/files/" + fileName);
      response.put("message", "Archivo subido exitosamente");

      return ResponseEntity.status(HttpStatus.CREATED).body(response);

    } catch (Exception e) {
      Map<String, String> errorResponse = new HashMap<>();
      errorResponse.put("error", "Error al subir el archivo: " + e.getMessage());
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }
  }

  /**
   * GET /api/files/{fileName} - Descargar/visualizar un archivo
   */
  @GetMapping("/{fileName:.+}")
  public ResponseEntity<Resource> downloadFile(@PathVariable String fileName, HttpServletRequest request) {
    try {
      // Cargar el archivo como Resource
      Resource resource = fileStorageService.loadFileAsResource(fileName);

      // Determinar el tipo de contenido del archivo
      String contentType = null;
      try {
        contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
      } catch (IOException ex) {
        // Si no se puede determinar, usar tipo genérico
      }

      // Por defecto, usar application/octet-stream
      if (contentType == null) {
        contentType = "application/octet-stream";
      }

      return ResponseEntity.ok()
          .contentType(MediaType.parseMediaType(contentType))
          .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
          .body(resource);

    } catch (Exception e) {
      return ResponseEntity.notFound().build();
    }
  }

  /**
   * DELETE /api/files/{fileName} - Eliminar un archivo
   */
  @DeleteMapping("/{fileName:.+}")
  public ResponseEntity<Map<String, String>> deleteFile(@PathVariable String fileName) {
    try {
      boolean deleted = fileStorageService.deleteFile(fileName);

      Map<String, String> response = new HashMap<>();
      if (deleted) {
        response.put("message", "Archivo eliminado exitosamente");
        return ResponseEntity.ok(response);
      } else {
        response.put("error", "Archivo no encontrado");
        return ResponseEntity.notFound().build();
      }

    } catch (Exception e) {
      Map<String, String> errorResponse = new HashMap<>();
      errorResponse.put("error", "Error al eliminar el archivo: " + e.getMessage());
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }
  }

  /**
   * HEAD /api/files/{fileName} - Verificar si un archivo existe
   */
  @RequestMapping(value = "/{fileName:.+}", method = RequestMethod.HEAD)
  public ResponseEntity<Void> checkFileExists(@PathVariable String fileName) {
    boolean exists = fileStorageService.fileExists(fileName);
    return exists ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
  }
}




