package com.example.chessvault.auth.service;

import com.example.chessvault.auth.domain.Role;
import com.example.chessvault.auth.request.LoginRequest;
import com.example.chessvault.auth.request.RegisterRequest;
import com.example.chessvault.auth.response.AuthResponse;
import com.example.chessvault.shared.exception.BusinessException;
import com.example.chessvault.user.entity.User;
import com.example.chessvault.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new BusinessException("Email já cadastrado");
        }

        User user = User.builder()
                .name(request.name())
                .email(request.email())
                .passwordHash(passwordEncoder.encode(request.password()))
                .role(Role.USER)
                .build();
        userRepository.save(user);

        // Retorna uma resposta simples (sem token, apenas confirmação)
        return new AuthResponse("Usuário registrado com sucesso", null, null);
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new BusinessException("Credenciais inválidas"));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new BusinessException("Credenciais inválidas");
        }

        // Aqui você pode gerar um token de sessão, ou retornar apenas um status.
        // Como não usamos JWT, retornamos uma mensagem de sucesso.
        return new AuthResponse("Login realizado com sucesso", null, "Bearer");
    }
}