package com.example.chessvault.controller;

import com.example.chessvault.model.PartidasModel;
import com.example.chessvault.service.PartidasService;
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
    public PartidasModel BuscarPartida(@RequestParam String nome){
       return partidasService.RetornarPartida(nome);
    }
    @DeleteMapping("deletarpartidas")
    public void DeletarPartidas(@RequestParam String nome){
        partidasService.DeletarPartida(nome);
    }
    @GetMapping("buscartodaspartidas")
    public List<PartidasModel> RetornarAll(){
        return partidasService.RetornarTodasPartidas();
    }
}
