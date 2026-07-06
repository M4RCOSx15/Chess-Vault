package com.example.chessvault.shared.response;

import java.time.Instant;

public record ErrorResponse(
        String code,
        Object message,
        Instant timestamp
) {
    public ErrorResponse(String code, Object message) {
        this(code, message, Instant.now());
    }
}
