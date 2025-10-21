package com.api.e_commerce.model;


import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity(name = "pedidos")
public class Pedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String detalle;    

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario; // Assuming Usuario is another entity class
    
}
