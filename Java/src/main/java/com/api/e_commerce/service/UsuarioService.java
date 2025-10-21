package com.api.e_commerce.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.*;

import com.api.e_commerce.model.Usuario;
import com.api.e_commerce.repository.UsuarioRepository;

@Service
@Transactional
public class UsuarioService {
    
    @Autowired
    private UsuarioRepository usuarioRepository;

    //getAllUsuarios 
    public List<Usuario> getAllUsuarios() {
        return usuarioRepository.findAll();
    }

    //saveUsuario
    public Usuario save(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }
    
}
