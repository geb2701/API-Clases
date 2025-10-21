package com.example.e_commerce.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class PedidoUpdateDTO {
    private LocalDateTime fecha;
    private String estado;
}
