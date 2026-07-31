package com.example.chessvault.dto;

public record PuzzleDTO(
        String title,
        String url,
        String fen,
        String pgn,
        String image
) {}