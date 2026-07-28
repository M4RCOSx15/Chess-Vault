package com.example.chessvault.controller;

import com.example.chessvault.model.PartidasModel;
import com.example.chessvault.service.PartidasService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/partidas")
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class PartidasController {
    private final PartidasService partidasService;

    public PartidasController(PartidasService partidasService) {
        this.partidasService = partidasService;
    }

    @PostMapping("/criarpartida")
    public String CriarPartidas(@RequestBody PartidasModel partidasModel, Principal principal){
        return partidasService.CriarPartida(partidasModel, principal.getName());
    }
    @GetMapping("/buscarpartidas")
    public PartidasModel BuscarPartida(@PathVariable String nome){
       return partidasService.RetornarPartida(nome);
    }
    @DeleteMapping("/deletarpartidas/{id}")
    public void DeletarPartidas(@PathVariable Long id){
        partidasService.DeletarPartida(id);
    }
    @GetMapping("/buscartodaspartidas")
    public List<PartidasModel> RetornarAll(Principal principal){
        return partidasService.RetornarTodasPartidas(principal.getName());
    }
    @PutMapping("/vincularjogador/{partidaId}/{jogadorId}")
    public ResponseEntity<String> VincularJogador(@PathVariable Long partidaId, @PathVariable Long jogadorId){
        partidasService.VincularJogador(partidaId, jogadorId);
        return ResponseEntity.ok("Vinculo 200");
    }

    @PutMapping("/desvincularjogador/{partidaId}/{jogadorId}")
    public void DesvincularJogador(Long partidaId, Long jogadorId){
       partidasService.DesvincularJogador(partidaId,jogadorId);
    }

    @GetMapping("/buscarpartidasdojogador/{jogadorId}")
    public List<PartidasModel> BuscarPartidasDoJogador(@PathVariable Long jogadorId){
      return partidasService.BuscarPartidasDoJogador(jogadorId);
    }
}
