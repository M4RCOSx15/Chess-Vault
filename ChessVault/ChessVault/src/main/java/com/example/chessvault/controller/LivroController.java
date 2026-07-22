package com.example.chessvault.controller;

import com.example.chessvault.model.LivroModel;
import com.example.chessvault.service.LivroService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/livro")
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class LivroController {
    private LivroService livroService;

    public LivroController(LivroService livroService) {
        this.livroService = livroService;
    }

    @PutMapping("/criarlivro")
    public ResponseEntity<String> CriarLivro(@RequestBody LivroModel livroModel){
        return ResponseEntity.ok(livroService.CriarLivro(livroModel));
    }
    @DeleteMapping("/deletarlivro/{id}")
    public ResponseEntity<HttpStatus> DeletarLivro(@PathVariable Long id){
        livroService.DeletarLivro(id);
        return ResponseEntity.ok(HttpStatus.OK);
    }
    @GetMapping("/buscartodoslivros")
    public List<LivroModel> RetornarAll(){
        return livroService.RetornarTodosLivros();
    }
}
