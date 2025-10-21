package com.example.e_commerce.dto;

import com.example.e_commerce.model.Direccion;
import lombok.Data;

@Data
public class UsuarioDTO {
    private String email;
    private String contrasena;
    private String nombre;
    private Direccion direccion;
}
