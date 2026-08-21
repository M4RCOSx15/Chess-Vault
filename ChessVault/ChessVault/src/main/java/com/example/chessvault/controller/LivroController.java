package com.example.chessvault.controller;

import com.example.chessvault.model.LivroModel;
import com.example.chessvault.service.LivroService;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/livro")
@CrossOrigin(origins = "https://chessvaultfrontend.chessvault.workers.dev/")
public class LivroController {
    private LivroService livroService;

    public LivroController(LivroService livroService) {
        this.livroService = livroService;
    }

    @PutMapping("/criarlivro")
    public ResponseEntity<String> CriarLivro(@RequestBody LivroModel livroModel, Principal principal){
        return ResponseEntity.ok(livroService.CriarLivro(livroModel, principal.getName()));
    }
    @DeleteMapping("/deletarlivro/{id}")
    public ResponseEntity<HttpStatus> DeletarLivro(@PathVariable Long id,Principal principal){
        livroService.DeletarLivro(id, principal.getName());
        return ResponseEntity.ok(HttpStatus.OK);
    }
    @GetMapping("/buscartodoslivros")
    public List<LivroModel> RetornarAll(Principal principal){
        return livroService.RetornarTodosLivros(principal.getName());
    }
}
