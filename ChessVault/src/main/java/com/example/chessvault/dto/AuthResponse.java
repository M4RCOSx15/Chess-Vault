package com.example.chessvault.dto;

public class AuthResponse {

    private String token;
    private String nome;
    private String email;

    public AuthResponse() {
    }

    public String getToken() {
        return token;
    }

    public String getNome() {
        return nome;
    }

    public String getEmail() {
        return email;
    }
}
