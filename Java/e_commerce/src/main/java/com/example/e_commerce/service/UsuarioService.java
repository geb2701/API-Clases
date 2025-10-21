package com.example.e_commerce.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.e_commerce.model.Usuario;
import com.example.e_commerce.repository.UsuarioRepository;
import com.example.e_commerce.dto.UsuarioUpdateDTO;

@Service
@Transactional
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<Usuario> getAllUsuarios() {
        return usuarioRepository.findAll();
    }

    public Usuario getUsuarioById(Long id) {
        return usuarioRepository.findById(id).orElse(null);
    }

    public Usuario saveUsuario(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    public void deleteUsuario(Long id) {
        usuarioRepository.deleteById(id);
    }

    public Usuario updateUsuario(Long id, UsuarioUpdateDTO usuarioDTO) {
        return usuarioRepository.findById(id)
                .map(usuario -> {
                    if (usuarioDTO.getEmail() != null) {
                        usuario.setEmail(usuarioDTO.getEmail());
                    }
                    if (usuarioDTO.getNombre() != null) {
                        usuario.setNombre(usuarioDTO.getNombre());
                    }
                    // Las direcciones se manejan por separado a través del DireccionController
                    return usuarioRepository.save(usuario);
                })
                .orElse(null);
    }
}