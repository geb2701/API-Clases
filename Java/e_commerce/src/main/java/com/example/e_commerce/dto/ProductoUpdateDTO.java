package com.example.e_commerce.dto;

import lombok.Data;

@Data
public class ProductoUpdateDTO {
    private String nombre;
    private String descripcion;
    private Double precio;
    private Integer stock;
}
