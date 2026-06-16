package com.chessvault.game.api.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.Set;

public record CreateGameRequest(

        @NotBlank(message = "Título é obrigatório")
        @Size(max = 200, message = "Título deve ter no máximo 200 caracteres")
        String title,

        @Size(max = 100, message = "Nome deve ter no máximo 100 caracteres")
        String whitePlayer,

        @Size(max = 100, message = "Nome deve ter no máximo 100 caracteres")
        String blackPlayer,

        @Pattern(regexp = "1-0|0-1|1/2-1/2|\\*",
                message = "Resultado inválido. Use: 1-0, 0-1, 1/2-1/2 ou *")
        String result,

        @Size(max = 200)
        String event,

        @PastOrPresent(message = "Data da partida não pode ser no futuro")
        LocalDate gameDate,

        String pgnContent,

        String notes,

        Set<String> tags
) {}
