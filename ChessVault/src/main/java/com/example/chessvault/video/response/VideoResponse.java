package com.example.chessvault.video.response;

import java.util.UUID;

public record VideoResponse(
        UUID id,
        String title,
        String channel,
        String description,
        String url,
        String thumbnailUrl,
        String category
) {}
