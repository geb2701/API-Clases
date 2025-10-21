package com.example.e_commerce.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.e_commerce.model.Pedido;
import com.example.e_commerce.service.PedidoService;
import com.example.e_commerce.dto.PedidoUpdateDTO;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    @GetMapping
    public List<Pedido> getAllPedidos() {
        return pedidoService.getAllPedidos();
    }

    @GetMapping("/{id}")
    public Pedido getPedidoById(@PathVariable Long id) {
        return pedidoService.getPedidoById(id);
    }

    @PostMapping
    public Pedido createPedido(@RequestBody Pedido pedido) {
        return pedidoService.savePedido(pedido);
    }

    @PutMapping("/{id}")
    public Pedido updatePedido(@PathVariable Long id, @RequestBody PedidoUpdateDTO pedidoDTO) {
        return pedidoService.updatePedido(id, pedidoDTO);
    }

    @DeleteMapping("/{id}")
    public void deletePedido(@PathVariable Long id) {
        pedidoService.deletePedido(id);
    }

    @GetMapping("/usuario/{usuarioId}")
    public List<Pedido> getPedidosByUsuario(@PathVariable Long usuarioId) {
        return pedidoService.getPedidosByUsuario(usuarioId);
    }

    @PutMapping("/{id}/estado")
    public Pedido updateEstadoPedido(@PathVariable Long id, @RequestBody String estado) {
        PedidoUpdateDTO pedidoDTO = new PedidoUpdateDTO();
        pedidoDTO.setEstado(estado);
        return pedidoService.updatePedido(id, pedidoDTO);
    }
}