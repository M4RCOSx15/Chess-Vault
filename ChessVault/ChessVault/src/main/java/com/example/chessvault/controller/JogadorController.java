package com.example.chessvault.controller;

import com.example.chessvault.model.JogadorModel;
import com.example.chessvault.service.JogadorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/jogador")
@CrossOrigin(origins = {"https://chessvaultfrontend.chessvault.workers.dev/"})
public class JogadorController {

    private final JogadorService jogadorService;

    public JogadorController(JogadorService jogadorService) {
        this.jogadorService = jogadorService;
    }

    @PostMapping("/criarjogador")
    public String CriarJogador(@RequestBody JogadorModel jogadorModel, Principal principal) {
        return jogadorService.CriarJogador(jogadorModel, principal.getName());
    }
    @DeleteMapping("/deletarjogador/{jogadorId}")
    public void DeletarJogador(@PathVariable Long jogadorId, Principal principal) {
        jogadorService.DeletarJogador(jogadorId, principal.getName());
    }

    @PutMapping("/atualizarjogador/{id}")
    public ResponseEntity<JogadorModel> AtualizarJogador(
            @PathVariable Long id,
            @RequestBody JogadorModel jogadorModel,
            Principal principal) {
        return jogadorService.AtualizarJogador(id, jogadorModel,principal.getName());
    }

    @GetMapping("/buscartodosjogadores")
    public List<JogadorModel> RetornarTodosJogadores(Principal principal) {
        return jogadorService.RetornarTodosJogadores(principal.getName());
    }
}
