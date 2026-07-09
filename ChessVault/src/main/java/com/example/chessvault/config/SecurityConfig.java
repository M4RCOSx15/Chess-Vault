package com.example.chessvault.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    public String SenhaHash1(String senha){

        return encoder.encode(senha);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf -> csrf.disable()) // Desabilita proteção CSRF (necessário para APIs stateless)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/usuario/v1/Criar").permitAll() // Permite registro sem token
                        .anyRequest().authenticated() // Exige autenticação para o resto
                )
                .build();
    }
}
