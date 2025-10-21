package com.example.e_commerce.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@DiscriminatorValue("DIGITAL")
public class ProductoDigital extends Producto {
    
    @Column(nullable = false)
    private String formatoArchivo;
    
    @Column(nullable = false)
    private Double tamanoMB;
    
    @Column(nullable = false)
    private String urlDescarga;
    
    @Column(nullable = false)
    private Integer limiteDescargas;
}
