package main.java.com.example.e_commerce.service;

import com.example.e_commerce.dto.DireccionDTO;
import com.example.e_commerce.model.Direccion;
import com.example.e_commerce.model.Usuario;
import com.example.e_commerce.repository.DireccionRepository;
import com.example.e_commerce.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DireccionService {

    @Autowired
    private DireccionRepository direccionRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<DireccionDTO> obtenerTodas() {
        return direccionRepository.findAll().stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    public DireccionDTO obtenerPorId(Long id) {
        Direccion direccion = direccionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dirección no encontrada con id: " + id));
        return convertirADTO(direccion);
    }

    public List<DireccionDTO> obtenerPorUsuarioId(Long usuarioId) {
        return direccionRepository.findByUsuarioId(usuarioId).stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    public DireccionDTO crear(DireccionDTO direccionDTO) {
        Usuario usuario = usuarioRepository.findById(direccionDTO.getUsuarioId())
                .orElseThrow(
                        () -> new RuntimeException("Usuario no encontrado con id: " + direccionDTO.getUsuarioId()));

        Direccion direccion = new Direccion();
        direccion.setCalle(direccionDTO.getCalle());
        direccion.setCiudad(direccionDTO.getCiudad());
        direccion.setCp(direccionDTO.getCp());
        direccion.setPais(direccionDTO.getPais());
        direccion.setUsuario(usuario);

        Direccion direccionGuardada = direccionRepository.save(direccion);
        return convertirADTO(direccionGuardada);
    }

    public DireccionDTO actualizar(Long id, DireccionDTO direccionDTO) {
        Direccion direccion = direccionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dirección no encontrada con id: " + id));

        direccion.setCalle(direccionDTO.getCalle());
        direccion.setCiudad(direccionDTO.getCiudad());
        direccion.setCp(direccionDTO.getCp());
        direccion.setPais(direccionDTO.getPais());

        if (direccionDTO.getUsuarioId() != null
                && !direccionDTO.getUsuarioId().equals(direccion.getUsuario().getId())) {
            Usuario nuevoUsuario = usuarioRepository.findById(direccionDTO.getUsuarioId())
                    .orElseThrow(
                            () -> new RuntimeException("Usuario no encontrado con id: " + direccionDTO.getUsuarioId()));
            direccion.setUsuario(nuevoUsuario);
        }

        Direccion direccionActualizada = direccionRepository.save(direccion);
        return convertirADTO(direccionActualizada);
    }

    public void eliminar(Long id) {
        if (!direccionRepository.existsById(id)) {
            throw new RuntimeException("Dirección no encontrada con id: " + id);
        }
        direccionRepository.deleteById(id);
    }

    private DireccionDTO convertirADTO(Direccion direccion) {
        DireccionDTO dto = new DireccionDTO();
        dto.setId(direccion.getId());
        dto.setCalle(direccion.getCalle());
        dto.setCiudad(direccion.getCiudad());
        dto.setCp(direccion.getCp());
        dto.setPais(direccion.getPais());
        dto.setUsuarioId(direccion.getUsuario().getId());
        return dto;
    }
}
