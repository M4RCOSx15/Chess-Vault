package com.example.chessvault.model;

import jakarta.persistence.*;

@Entity
@Table(name = "Livros")
public class BookModel {

    @Id
    @Column(name = "id_livro", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "nome_livro", nullable = false)
    private String nome;
    @Column(name = "descricao_livro", nullable = false)
    private String descricao;

    public BookModel(Long id, String nome, String descricao) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
    }

    public BookModel() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }
}
