package com.example.chessvault.user.service;

import com.example.chessvault.user.entity.User;
import com.example.chessvault.user.repository.UserRepository;
import com.example.chessvault.shared.exception.ResourceNotFoundException;
import com.example.chessvault.user.request.UpdateUserRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));
    }

    public User getUserById(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));
    }

    @Transactional
    public User updateUser(UUID id, UpdateUserRequest request) {
        User user = getUserById(id);
        user.setName(request.getName());
        // outros campos que podem ser atualizados
        return userRepository.save(user);
    }
}