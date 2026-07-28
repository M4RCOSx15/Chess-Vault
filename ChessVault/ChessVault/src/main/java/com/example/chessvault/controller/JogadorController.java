package com.example.chessvault.controller;

import com.example.chessvault.model.JogadorModel;
import com.example.chessvault.service.JogadorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/jogador")
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class JogadorController {
    private final JogadorService jogadorService;

    public JogadorController(JogadorService jogadorService) {
        this.jogadorService = jogadorService;
    }
    @PostMapping("/criarjogador")
    public String CriarJogador(@RequestBody JogadorModel jogadorModel,Principal principal){
        return jogadorService.CriarJogador(jogadorModel,principal.getName());
    }
    @DeleteMapping("/deletarjogador/{id}")
    public void DeletarJogador(@PathVariable Long id){
        jogadorService.DeletarJogador(id);
    }
    @PutMapping("/atualizarjogador/{id}")
    public ResponseEntity<JogadorModel> AtualizarJogador(@PathVariable Long id, @RequestBody JogadorModel jogadorModel){
       return jogadorService.AtualizarJogador(id, jogadorModel);
    }
    @GetMapping("/buscartodosjogadores")
    public List<JogadorModel> RetornarAll(Principal principal){
        return jogadorService.RetornarTodosJogadores(principal.getName());
    }




}
