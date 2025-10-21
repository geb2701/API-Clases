package main.java.com.example.e_commerce.dto;

import lombok.Data;

@Data
public class DireccionDTO {
    private Long id;
    private String calle;
    private String ciudad;
    private String cp;
    private String pais;
    private Long usuarioId;
}
