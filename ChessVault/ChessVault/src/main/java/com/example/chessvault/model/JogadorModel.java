package com.example.chessvault.model;

import jakarta.persistence.*;

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
    @ManyToOne()
    @JoinColumn(name = "id-partidas", nullable = false)
    private PartidasModel partidasModel;
    @Column(name = "aberturas-favoritas")
    private String aberturasFav;
    public JogadorModel(Long id, String nome, Long rating, String descricao, PartidasModel partidasModel, String aberturasFav) {
        this.id = id;
        this.nome = nome;
        this.rating = rating;
        this.descricao = descricao;
        this.partidasModel = partidasModel;
        this.aberturasFav = aberturasFav;
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

    public PartidasModel getPartidasModel() {
        return partidasModel;
    }

    public void setPartidasModel(PartidasModel partidasModel) {
        this.partidasModel = partidasModel;
    }

    public String getAberturasFav() {
        return aberturasFav;
    }

    public void setAberturasFav(String aberturasFav) {
        this.aberturasFav = aberturasFav;
    }
}
