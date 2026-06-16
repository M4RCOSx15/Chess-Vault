package com.example.chessvault.game.request;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.Set;

public record UpdateGameRequest(

        @Size(max = 200, message = "Título deve ter no máximo 200 caracteres")
        String title,

        @Size(max = 100)
        String whitePlayer,

        @Size(max = 100)
        String blackPlayer,

        @Pattern(regexp = "1-0|0-1|1/2-1/2|\\*",
                message = "Resultado inválido. Use: 1-0, 0-1, 1/2-1/2 ou *")
        String result,

        @Size(max = 200)
        String event,

        @PastOrPresent
        LocalDate gameDate,

        String pgnContent,
        String notes,
        Set<String> tags
) {}
