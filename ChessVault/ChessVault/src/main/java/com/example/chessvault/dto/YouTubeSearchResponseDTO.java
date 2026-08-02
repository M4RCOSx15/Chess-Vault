package com.example.chessvault.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

/**
 * Mapeia a resposta da YouTube Data API v3 — endpoint search.list
 *
 * JSON resumido da API:
 * {
 *   "items": [
 *     {
 *       "id": { "videoId": "abc123" },
 *       "snippet": {
 *         "title": "...",
 *         "channelTitle": "...",
 *         "description": "...",
 *         "publishedAt": "...",
 *         "thumbnails": {
 *           "high": { "url": "..." }
 *         }
 *       }
 *     }
 *   ]
 * }
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public record YouTubeSearchResponseDTO(
        List<YouTubeItemDTO> items
) {
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record YouTubeItemDTO(
            YouTubeIdDTO id,
            YouTubeSnippetDTO snippet
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record YouTubeIdDTO(
            String videoId
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record YouTubeSnippetDTO(
            String title,
            String channelTitle,
            String description,
            String publishedAt,
            YouTubeThumbnailsDTO thumbnails
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record YouTubeThumbnailsDTO(
            YouTubeThumbnailDTO high,
            YouTubeThumbnailDTO medium,
            @JsonProperty("default")
            YouTubeThumbnailDTO defaultThumb
    ) {
        // Retorna a melhor thumbnail disponível
        public String bestUrl() {
            if (high != null && high.url() != null)   return high.url();
            if (medium != null && medium.url() != null) return medium.url();
            if (defaultThumb != null)                   return defaultThumb.url();
            return null;
        }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record YouTubeThumbnailDTO(
            String url,
            Integer width,
            Integer height
    ) {}
}
