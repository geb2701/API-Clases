package com.api.e_commerce.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.api.e_commerce.model.Usuario;
import com.api.e_commerce.service.UsuarioService;

@RestController
@RequestMapping("/api/usuarios") //localhost:8080/api/usuarios
public class UsuarioController {
 
    @Autowired
    private UsuarioService usuarioService;

    @GetMapping
    public List<Usuario> getAllUsuarios() {
        return usuarioService.getAllUsuarios();
    }

    @PostMapping
    public Usuario addUsuario(@RequestBody Usuario usuario) {
        return usuarioService.save(usuario);
    }
}
