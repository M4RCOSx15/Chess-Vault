package com.example.chessvault.service;

import com.example.chessvault.dto.VideoSearchResultDTO;
import com.example.chessvault.dto.YouTubeSearchResponseDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class YouTubeClientService {

    private static final Logger log = LoggerFactory.getLogger(YouTubeClientService.class);

    @Value("${youtube.api.key}")
    private String apiKey;

    @Value("${youtube.api.base-url}")
    private String baseUrl;

    @Value("${youtube.api.max-results:20}")
    private int maxResults;

    private final RestClient restClient;

    public YouTubeClientService() {
        this.restClient = RestClient.builder()
                .defaultHeader("Accept", "application/json")
                .build();
    }

    public List<VideoSearchResultDTO> buscarVideos(String termo) {
        if (termo == null || termo.isBlank()) {
            return Collections.emptyList();
        }

        // Garante contexto de xadrez sem duplicar "chess"
        String query = termo.toLowerCase().contains("chess")
                ? termo.trim()
                : termo.trim() + " chess";

        // ── PROBLEMA 2 CORRIGIDO ──────────────────────────────────────────────
        // UriComponentsBuilder.fromHttpUrl() lança IllegalArgumentException
        // quando a URL base vem de @Value e ainda não foi resolvida no construtor,
        // ou quando há caracteres especiais no query param que conflitam com
        // o parser interno do Spring.
        //
        // Solução: montar a URL manualmente com URLEncoder.encode() para o
        // query param e URI.create() para garantir que a URI seja válida.
        // Isso elimina a dependência de UriComponentsBuilder e do import
        // org.springframework.web.util que estava causando o erro.
        String queryEncoded = URLEncoder.encode(query, StandardCharsets.UTF_8);
        String urlString = baseUrl + "/search"
                + "?part=snippet"
                + "&q=" + queryEncoded
                + "&type=video"
                + "&maxResults=" + maxResults
                + "&key=" + apiKey;

        log.info("Buscando YouTube: {}", query);

        try {
            YouTubeSearchResponseDTO response = restClient.get()
                    .uri(URI.create(urlString))   // URI.create() em vez de fromHttpUrl()
                    .retrieve()
                    .body(YouTubeSearchResponseDTO.class);

            if (response == null || response.items() == null) {
                log.warn("YouTube retornou resposta vazia para: {}", query);
                return Collections.emptyList();
            }

            return response.items().stream()
                    .filter(item -> item.id() != null && item.id().videoId() != null)
                    .map(item -> {
                        String videoId  = item.id().videoId();
                        String titulo   = item.snippet().title();
                        String canal    = item.snippet().channelTitle();
                        String thumb    = item.snippet().thumbnails() != null
                                ? item.snippet().thumbnails().bestUrl()
                                : null;
                        String urlVideo = VideoSearchResultDTO.buildUrl(videoId);
                        String pubAt    = item.snippet().publishedAt();
                        String desc     = item.snippet().description();

                        return new VideoSearchResultDTO(
                                videoId, titulo, canal, thumb, urlVideo, pubAt, desc);
                    })
                    .collect(Collectors.toList());

        } catch (Exception e) {
            log.error("Erro ao buscar vídeos no YouTube para '{}': {}", query, e.getMessage());
            throw new RuntimeException(
                    "Não foi possível buscar vídeos no YouTube. Tente novamente.", e);
        }
    }
}
