package com.example.chessvault.service;

import com.example.chessvault.dto.VideoRequestDTO;
import com.example.chessvault.dto.VideoSearchResultDTO;
import com.example.chessvault.exception.ResourceNotFoundException;
import com.example.chessvault.model.UserModel;
import com.example.chessvault.model.VideoModel;
import com.example.chessvault.repository.UserRepository;
import com.example.chessvault.repository.VideoRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VideoService {

    private final VideoRepository videoRepository;
    private final YouTubeClientService youTubeClientService;
    private final UserRepository userRepository;
    public VideoService(VideoRepository videoRepository,
                        YouTubeClientService youTubeClientService, UserRepository userRepository) {
        this.videoRepository      = videoRepository;
        this.youTubeClientService = youTubeClientService;
        this.userRepository = userRepository;
    }
    @CacheEvict(value = "VideosCache", key = "#email")
    public String SalvarVideo(VideoRequestDTO dto, String email) {
        VideoModel video = new VideoModel();
        video.setUrl(dto.getUrl());
        video.setTitulo(dto.getTitulo());
        video.setCanal(dto.getCanal());
        video.setIdVideo(dto.getIdVideo());
        video.setThumbnail(dto.getThumbnail());
        UserModel usuario = new UserModel();
        usuario = userRepository.findByEmail(email).orElseThrow(()-> new ResourceNotFoundException("Usuario nao encontrado"));
        video.setUsuario(usuario);

        videoRepository.save(video);
        return "Vídeo salvo com sucesso";
    }
    @CacheEvict(value = "VideosCache", key = "#email")
    public void DeletarVideo(Long id, String email) {
        videoRepository.deleteById(id);
    }
    @Cacheable(value = "VideosCache", unless = "#result == null", key = "#email")
    public List<VideoModel> RetornarTodosVideos(String email) {
        return videoRepository.findByUsuario_Email(email);
    }

    public List<VideoSearchResultDTO> buscarNoYouTube(String termo) {
        return youTubeClientService.buscarVideos(termo);
    }
    @CacheEvict(value = "VideosCache", key = "#email")
    public List<VideoSearchResultDTO> buscarESalvarDoYouTube(String termo, String email) {
        List<VideoSearchResultDTO> resultados = youTubeClientService.buscarVideos(termo);

        resultados.forEach(r -> {
            if (!videoRepository.existsByIdVideo(r.videoId())) {
                VideoModel video = new VideoModel();
                video.setIdVideo(r.videoId());
                video.setTitulo(r.titulo());
                video.setCanal(r.canal());
                video.setThumbnail(r.thumbnail());
                video.setUrl(r.url());
                videoRepository.save(video);
            }
        });

        return resultados;
    }
}
