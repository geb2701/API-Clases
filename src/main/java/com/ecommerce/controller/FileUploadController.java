package com.ecommerce.controller;

import com.ecommerce.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/files")
public class FileUploadController {

  @Autowired
  private FileStorageService fileStorageService;

  /**
   * Endpoint para subir una imagen
   * POST /api/files/upload
   */
  @PostMapping("/upload")
  public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) {
    // Validar que el archivo no esté vacío
    if (file.isEmpty()) {
      return ResponseEntity.badRequest()
          .body(Map.of("error", "Por favor seleccione un archivo"));
    }

    // Validar tipo de archivo (solo imágenes)
    String contentType = file.getContentType();
    if (contentType == null || !contentType.startsWith("image/")) {
      return ResponseEntity.badRequest()
          .body(Map.of("error", "Solo se permiten archivos de imagen"));
    }

    // Validar tamaño del archivo (máximo 5MB)
    if (file.getSize() > 5 * 1024 * 1024) {
      return ResponseEntity.badRequest()
          .body(Map.of("error", "El archivo no debe superar los 5MB"));
    }

    try {
      String fileName = fileStorageService.storeFile(file);

      // Construir URL del archivo
      String fileUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
          .path("/api/files/")
          .path(fileName)
          .toUriString();

      Map<String, String> response = new HashMap<>();
      response.put("fileName", fileName);
      response.put("fileUrl", fileUrl);
      response.put("fileType", file.getContentType());
      response.put("size", String.valueOf(file.getSize()));

      return ResponseEntity.ok(response);
    } catch (Exception e) {
      return ResponseEntity.internalServerError()
          .body(Map.of("error", "Error al subir el archivo: " + e.getMessage()));
    }
  }

  /**
   * Endpoint para descargar/visualizar una imagen
   * GET /api/files/{fileName:.+}
   */
  @GetMapping("/{fileName:.+}")
  public ResponseEntity<Resource> downloadFile(@PathVariable String fileName, HttpServletRequest request) {
    // Cargar archivo como Resource
    Resource resource = fileStorageService.loadFileAsResource(fileName);

    // Determinar tipo de contenido del archivo
    String contentType = null;
    try {
      contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
    } catch (IOException ex) {
      // No hacer nada, se usará el tipo por defecto
    }

    // Si no se pudo determinar, usar tipo genérico
    if (contentType == null) {
      contentType = "application/octet-stream";
    }

    return ResponseEntity.ok()
        .contentType(MediaType.parseMediaType(contentType))
        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
        .body(resource);
  }

  /**
   * Endpoint para eliminar una imagen
   * DELETE /api/files/{fileName}
   */
  @DeleteMapping("/{fileName:.+}")
  public ResponseEntity<Map<String, String>> deleteFile(@PathVariable String fileName) {
    try {
      boolean deleted = fileStorageService.deleteFile(fileName);
      if (deleted) {
        return ResponseEntity.ok(Map.of("message", "Archivo eliminado correctamente"));
      } else {
        return ResponseEntity.notFound().build();
      }
    } catch (Exception e) {
      return ResponseEntity.internalServerError()
          .body(Map.of("error", "Error al eliminar el archivo: " + e.getMessage()));
    }
  }
}
