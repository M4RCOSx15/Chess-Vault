package com.example.chessvault.user.request;

import lombok.Data;
import jakarta.validation.constraints.Size;

@Data
public class UpdateUserRequest {
    @Size(min = 2, max = 150)
    private String name;
    // outros campos editáveis, como senha (com validação)
}