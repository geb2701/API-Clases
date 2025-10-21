package com.api.e_commerce.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.api.e_commerce.model.Producto;
import com.api.e_commerce.service.ProductoService;
// import com.api.e_commerce.dto.ProductoUpdateDTO;

@RestController
@RequestMapping("/api/productos") //localhost:8080/api/productos del locahost:8080/api/productos/id
public class ProductoController {
    
    @Autowired
    private ProductoService productoService;

    //https://localhost:8080/api/productos con metodo get http
    @GetMapping
    public List<Producto> getAllProductos() {
        return productoService.getAllProductos();
    }

    // https://localhost:8080/api/productos/1 con metodo get http
    @GetMapping("/{id}")
    public Producto getProductoById(@PathVariable Long id) {
        return productoService.getProductoById(id);
    }

    //https://localhost:8080/api/productos con metodo post http, enviar un body
    @PostMapping
    public Producto addProducto(@RequestBody Producto producto) {
        return productoService.saveProducto(producto);
    }    //https://localhost:8080/api/productos/1 con metodo put http, enviar un body

    // @PutMapping("/{id}")
    // public Producto updateProducto(@PathVariable Long id, @RequestBody ProductoUpdateDTO productoDTO) {
    //     return productoService.updateProducto(id, productoDTO);
    // }

    //https://localhost:8080/api/productos/1 con metodo delete http
    @DeleteMapping("/{id}")
    public void deleteProducto(@PathVariable Long id) {
        productoService.deleteProducto(id);
    }
}
