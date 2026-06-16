package com.chessvault.book.api.response;

import java.util.UUID;

public record BookResponse(
        UUID id,
        String title,
        String author,
        String category,
        String description,
        String externalLink,
        String coverUrl
) {}
