package com.example.chessvault.service;

import com.example.chessvault.dto.VideoRequestDTO;
import com.example.chessvault.dto.VideoSearchResultDTO;
import com.example.chessvault.model.VideoModel;
import com.example.chessvault.repository.VideoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VideoService {
    private final VideoRepository videoRepository;
    private final YouTubeClientService youTubeClientService;

    public VideoService(VideoRepository videoRepository,
                        YouTubeClientService youTubeClientService) {
        this.videoRepository      = videoRepository;
        this.youTubeClientService = youTubeClientService;
    }

    public String SalvarVideo(VideoRequestDTO videoRequestDTO){
     VideoModel videoSalvar= new VideoModel();
     videoSalvar.setUrl(videoRequestDTO.getUrl());
     videoSalvar.setTitulo(videoRequestDTO.getTitulo());
     videoSalvar.setTumbnail(videoRequestDTO.getTumbnail());
     videoSalvar.setCanal(videoRequestDTO.getCanal());
     videoSalvar.setIdVideo(videoRequestDTO.getIdVideo());

     videoRepository.save(videoSalvar);

     return "Video salvo com sucesso";
    }

    public void DeletarVideo(Long id){
        videoRepository.deleteById(id);
    }

    public List<VideoModel> RetornarTodosVideos(){
       return videoRepository.findAll();
    }

    /**
     * Busca vídeos relacionados ao termo no YouTube via API.
     *
     * Retorna até 15 resultados (configurável em application.properties).
     * Não salva no banco — o frontend exibe os resultados em tempo real.
     * O usuário pode clicar em "Salvar" para persistir um vídeo específico
     * via POST /videos/salvarvideo.
     */
    public List<VideoSearchResultDTO> buscarNoYouTube(String termo) {
        return youTubeClientService.buscarVideos(termo);
    }

    /**
     * Busca no YouTube E salva todos os resultados no banco.
     *
     * Use quando quiser popular o banco automaticamente com uma busca.
     * Evita duplicatas verificando se o idVideo já existe.
     */
    public List<VideoSearchResultDTO> buscarESalvarDoYouTube(String termo) {
        List<VideoSearchResultDTO> resultados = youTubeClientService.buscarVideos(termo);

        resultados.forEach(r -> {
            // Só salva se o vídeo ainda não estiver no banco
            boolean jaExiste = videoRepository.existsByIdVideo(r.videoId());
            if (!jaExiste) {
                VideoModel video = new VideoModel();
                video.setIdVideo(r.videoId());
                video.setTitulo(r.titulo());
                video.setCanal(r.canal());
                video.setTumbnail(r.thumbnail());
                video.setUrl(r.url());
                videoRepository.save(video);
            }
        });

        return resultados;
    }
}
