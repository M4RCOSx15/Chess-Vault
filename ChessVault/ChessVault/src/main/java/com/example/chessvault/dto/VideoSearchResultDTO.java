package com.example.chessvault.dto;

/**
 * DTO de saída: o que o frontend recebe ao buscar vídeos.
 * Isolado da estrutura interna da API do YouTube.
 */
public record VideoSearchResultDTO(
        String videoId,
        String titulo,
        String canal,
        String thumbnail,
        String url,           // link direto para assistir
        String publishedAt,
        String description
) {
    /**
     * Constrói a URL do YouTube a partir do videoId.
     * Centralizado aqui para nunca duplicar essa lógica.
     */
    public static String buildUrl(String videoId) {
        return "https://www.youtube.com/watch?v=" + videoId;
    }
}
