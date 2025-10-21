package com.example.e_commerce.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@DiscriminatorValue("FISICO")
public class ProductoFisico extends Producto {
    
    @Column(nullable = false)
    private Double peso;
    
    @Column(nullable = false)
    private String dimensiones;
    
    @Column(nullable = false)
    private String ubicacionAlmacen;
}
