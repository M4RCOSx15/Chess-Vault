package com.example.chessvault.model;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "Jogador")
public class JogadorModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "nome", nullable = false)
    private String nome;
    @Column(name = "rating", nullable = false)
    private Long rating;
    @Column(name = "descricao", nullable = false)
    private String descricao;
    @Column(name = "aberturas_favoritas")
    private String aberturasFav;
    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private UserModel usuario;
    public JogadorModel(Long id, String nome, Long rating, String descricao,String aberturasFav, UserModel usuario) {
        this.id = id;
        this.nome = nome;
        this.rating = rating;
        this.descricao = descricao;
        this.aberturasFav = aberturasFav;
        this.usuario = usuario;
    }

    public JogadorModel() {}

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

    public Long getRating() {
        return rating;
    }

    public void setRating(Long rating) {
        this.rating = rating;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getAberturasFav() {
        return aberturasFav;
    }

    public void setAberturasFav(String aberturasFav) {
        this.aberturasFav = aberturasFav;
    }

    public UserModel getUsuario() {
        return usuario;
    }

    public void setUsuario(UserModel usuario) {
        this.usuario = usuario;
    }
}
