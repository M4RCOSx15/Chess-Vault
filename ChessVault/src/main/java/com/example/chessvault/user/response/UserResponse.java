package com.example.chessvault.user.response;

import java.util.UUID;
import com.example.chessvault.auth.domain.Role;

public record UserResponse(
        UUID id,
        String name,
        String email,
        Role role,
        String createdAt
) {}