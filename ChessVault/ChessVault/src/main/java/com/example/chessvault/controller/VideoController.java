package com.example.chessvault.controller;

import com.example.chessvault.dto.VideoRequestDTO;
import com.example.chessvault.dto.VideoSearchResultDTO;
import com.example.chessvault.model.VideoModel;
import com.example.chessvault.service.VideoService;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/videos")
@CrossOrigin(origins = {"http://127.0.0.1:5500", "http://localhost:5500"})
public class VideoController {

    private final VideoService videoService;

    public VideoController(VideoService videoService) {
        this.videoService = videoService;
    }
    @PostMapping("/salvarvideo")
    public String SalvarVideo(@RequestBody VideoRequestDTO videoRequestDTO, Principal principal){
       return videoService.SalvarVideo(videoRequestDTO,principal.getName());
    }
    @DeleteMapping("/deletarvideo/{id}")
    public void DeletarVideo(@PathVariable Long id, Principal principal){
        videoService.DeletarVideo(id, principal.getName());
    }
    @GetMapping("/buscartodosvideos")
    public List<VideoModel> RetornatTodosVideos(Principal principal){
        return videoService.RetornarTodosVideos(principal.getName());
    }

    /**
     * Busca vídeos no YouTube em tempo real.
     * GET /videos/buscar?termo=Sicilian+Defence
     *
     * Não salva no banco. Resultados são exibidos diretamente no frontend.
     * O frontend pode chamar POST /salvarvideo depois se quiser persistir.
     *
     * @param termo qualquer assunto de xadrez (ex: Magnus Carlsen, endgames, Tal)
     */
    @GetMapping("/buscar")
    public ResponseEntity<List<VideoSearchResultDTO>> BuscarNoYouTube(
            @RequestParam String termo) {

        if (termo == null || termo.isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        List<VideoSearchResultDTO> resultados = videoService.buscarNoYouTube(termo);
        return ResponseEntity.ok(resultados);
    }

    /**
     * Busca vídeos no YouTube E salva os resultados no banco (sem duplicatas).
     * POST /videos/buscaresalvar?termo=Queen%27s+Gambit
     *
     * Útil para popular o banco com vídeos sobre um tema específico.
     */
    @PostMapping("/buscaresalvar")
    public ResponseEntity<List<VideoSearchResultDTO>> BuscarESalvar(
            @RequestParam String termo,
            Principal principal) {

        if (termo == null || termo.isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        List<VideoSearchResultDTO> resultados = videoService.buscarESalvarDoYouTube(termo, principal.getName());
        return ResponseEntity.ok(resultados);
    }
}
