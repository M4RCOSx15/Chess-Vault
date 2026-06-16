package com.chessvault.game.domain;

import com.chessvault.shared.exception.BusinessException;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public record PgnContent(
        @Column(name = "pgn_content", columnDefinition = "TEXT")
        String value
) {
    public PgnContent {
        if (value != null && !value.isBlank() && !value.strip().startsWith("[") && !value.strip().startsWith("1.")) {
            throw new BusinessException("Formato PGN inválido. O conteúdo deve iniciar com tags '[' ou movimentos '1.'");
        }
    }

    public static PgnContent empty() {
        return new PgnContent(null);
    }

    public boolean hasContent() {
        return value != null && !value.isBlank();
    }
}
