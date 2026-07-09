package com.example.chessvault.model;

import jakarta.persistence.*;

@Entity
@Table(name = "Videos")
public class VideoModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id",nullable = false)
    private Long id;
    @Column(name = "url_video")
    private String url;
    @Column(name = "nome")
    private String nome;


    public VideoModel(Long id, String url, String nome) {
        this.id = id;
        this.url = url;
        this.nome = nome;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }
}
