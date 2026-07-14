package com.example.chessvault.dto;

public class UserResponseDTO {

  private String nome;
  private String email;

    public UserResponseDTO(String nome, String email) {
        this.nome = nome;
        this.email = email;
    }

    public String getNome() {
        return nome;
    }

    public String getEmail() {
        return email;
    }
}
