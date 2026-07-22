package com.example.chessvault.model;

import jakarta.persistence.*;

@Entity
@Table(name = "Livros")
public class LivroModel {

    @Id
    @Column(name = "id_livro", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "nome_livro", nullable = false, length = 255)
    private String nome;
    @Column(name = "descricao_livro", nullable = false, length = 5000)
    private String descricao;
    @Column(name = "imagem-opcional",length = 300)
    private String imagemLivro;

    public LivroModel(Long id, String nome, String descricao) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
    }

    public LivroModel() {}

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

    public String getImagemLivro() {
        return imagemLivro;
    }

    public void setImagemLivro(String imagemLivro) {
        this.imagemLivro = imagemLivro;
    }
}
