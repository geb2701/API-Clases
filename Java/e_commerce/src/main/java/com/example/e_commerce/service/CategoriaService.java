package com.example.e_commerce.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.e_commerce.model.Categoria;
import com.example.e_commerce.repository.CategoriaRepository;
import com.example.e_commerce.dto.CategoriaUpdateDTO;

@Service
@Transactional
public class CategoriaService {

    @Autowired
    private CategoriaRepository categoriaRepository;

    public List<Categoria> getAllCategorias() {
        return categoriaRepository.findAll();
    }

    public Categoria getCategoriaById(Long id) {
        return categoriaRepository.findById(id).orElse(null);
    }

    public Categoria saveCategoria(Categoria categoria) {
        return categoriaRepository.save(categoria);
    }

    public void deleteCategoria(Long id) {
        categoriaRepository.deleteById(id);
    }

    public Categoria updateCategoria(Long id, CategoriaUpdateDTO categoriaDTO) {
        return categoriaRepository.findById(id)
                .map(categoria -> {
                    if (categoriaDTO.getNombre() != null) {
                        categoria.setNombre(categoriaDTO.getNombre());
                    }
                    return categoriaRepository.save(categoria);
                })
                .orElse(null);
    }
}