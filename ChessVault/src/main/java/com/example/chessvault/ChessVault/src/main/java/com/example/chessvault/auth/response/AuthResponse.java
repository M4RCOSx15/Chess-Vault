package com.example.chessvault.auth.response;

public record AuthResponse(
        String message,
        String userId,
        String email
) {}