// ─────────────────────────────────────────────────────────────────────────────
// BACKEND — JogadorController.java CORRIGIDO
//
// O endpoint de deletar agora só precisa do jogadorId.
// Antes era: DELETE /jogador/deletarjogador/{partidaId}/{jogadorId}
// Agora é:   DELETE /jogador/deletarjogador/{jogadorId}
// ─────────────────────────────────────────────────────────────────────────────

package com.example.chessvault.controller;

import com.example.chessvault.model.JogadorModel;
import com.example.chessvault.service.JogadorService;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/jogador")
@CrossOrigin(origins = {"http://127.0.0.1:5500", "http://localhost:5500"})
public class JogadorController {

    private final JogadorService jogadorService;

    public JogadorController(JogadorService jogadorService) {
        this.jogadorService = jogadorService;
    }

    @PostMapping("/criarjogador")
    public String CriarJogador(@RequestBody JogadorModel jogadorModel, Principal principal) {
        return jogadorService.CriarJogador(jogadorModel, principal.getName());
    }

    /**
     * ENDPOINT CORRIGIDO
     * Antes: DELETE /deletarjogador/{partidaId}/{jogadorId}
     * Agora: DELETE /deletarjogador/{jogadorId}
     *
     * O service cuida de desvincular todas as partidas automaticamente.
     */
    @DeleteMapping("/deletarjogador/{jogadorId}")
    public void DeletarJogador(@PathVariable Long jogadorId) {
        jogadorService.DeletarJogador(jogadorId);
    }

    @PutMapping("/atualizarjogador/{id}")
    public ResponseEntity<JogadorModel> AtualizarJogador(
            @PathVariable Long id,
            @RequestBody JogadorModel jogadorModel) {
        return jogadorService.AtualizarJogador(id, jogadorModel);
    }

    @GetMapping("/buscartodosjogadores")
    public List<JogadorModel> RetornarTodosJogadores(Principal principal) {
        return jogadorService.RetornarTodosJogadores(principal.getName());
    }
}
