package main.java.com.example.e_commerce.controller;

import com.example.e_commerce.dto.DireccionDTO;
import com.example.e_commerce.service.DireccionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/direcciones")
public class DireccionController {

    @Autowired
    private DireccionService direccionService;

    @GetMapping
    public ResponseEntity<List<DireccionDTO>> obtenerTodas() {
        return ResponseEntity.ok(direccionService.obtenerTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DireccionDTO> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(direccionService.obtenerPorId(id));
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<DireccionDTO>> obtenerPorUsuarioId(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(direccionService.obtenerPorUsuarioId(usuarioId));
    }

    @PostMapping
    public ResponseEntity<DireccionDTO> crear(@RequestBody DireccionDTO direccionDTO) {
        DireccionDTO nuevaDireccion = direccionService.crear(direccionDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevaDireccion);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DireccionDTO> actualizar(@PathVariable Long id, @RequestBody DireccionDTO direccionDTO) {
        return ResponseEntity.ok(direccionService.actualizar(id, direccionDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        direccionService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
