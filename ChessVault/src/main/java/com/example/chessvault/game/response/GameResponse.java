package com.example.chessvault.game.response;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

public record GameResponse(
        UUID id,
        String title,
        String whitePlayer,
        String blackPlayer,
        String result,
        String event,
        LocalDate gameDate,
        String pgnContent,
        String notes,
        Set<String> tags,
        String createdBy,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
