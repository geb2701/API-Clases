package com.example.e_commerce.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.e_commerce.model.Pedido;
import com.example.e_commerce.repository.PedidoRepository;
import com.example.e_commerce.dto.PedidoUpdateDTO;

@Service
@Transactional
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    public List<Pedido> getAllPedidos() {
        return pedidoRepository.findAll();
    }

    public Pedido getPedidoById(Long id) {
        return pedidoRepository.findById(id).orElse(null);
    }

    public Pedido savePedido(Pedido pedido) {
        return pedidoRepository.save(pedido);
    }

    public void deletePedido(Long id) {
        pedidoRepository.deleteById(id);
    }

    public Pedido updatePedido(Long id, PedidoUpdateDTO pedidoDTO) {
        return pedidoRepository.findById(id)
                .map(pedido -> {
                    if (pedidoDTO.getFecha() != null) {
                        pedido.setFecha(pedidoDTO.getFecha());
                    }
                    if (pedidoDTO.getEstado() != null) {
                        pedido.setEstado(pedidoDTO.getEstado());
                    }
                    return pedidoRepository.save(pedido);
                })
                .orElse(null);
    }

    public List<Pedido> getPedidosByUsuario(Long usuarioId) {
        return pedidoRepository.findByUsuarioId(usuarioId);
    }
}