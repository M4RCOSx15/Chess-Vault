package com.example.chessvault.security;

import com.example.chessvault.model.UserModel;
import com.example.chessvault.repository.UserRepository;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserLookupService {

    private final UserRepository userRepository;

    public UserLookupService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Cacheable(value = "UsuarioPorEmailCache", key = "#email", unless = "#result == null")
    public Optional<UserModel> buscarPorEmail(String email) {
        System.out.println("======> BUSCANDO USUARIO NO BANCO (CACHE MISS) <======");
        return userRepository.findByEmail(email);
    }
}