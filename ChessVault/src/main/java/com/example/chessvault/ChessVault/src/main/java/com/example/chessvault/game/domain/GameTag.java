package com.example.chessvault.game.domain;


import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import com.example.chessvault.shared.exception.BusinessException;
@Embeddable
public record GameTag(
        @Column(name = "tag_name", length = 50)
        String name
) {
    public GameTag {
        if (name == null || name.isBlank()) {
            throw new BusinessException("Tag não pode ser vazia");
        }
        if (name.length() > 50) {
            throw new BusinessException("Tag deve ter no máximo 50 caracteres");
        }
        name = name.toLowerCase().trim();
    }
}
