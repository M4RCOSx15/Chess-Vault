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
    @Column(name = "titulo")
    private String titulo;
    @Column(name = "tubnail")
    private String Tumbnail;
    @Column(name = "canal")
    private String canal;
    @Column(name = "id_video")
    private String idVideo;


    public VideoModel() {}

    public VideoModel(Long id, String url, String titulo, String tumbnail, String canal, String idVideo) {
        this.id = id;
        this.url = url;
        this.titulo = titulo;
        Tumbnail = tumbnail;
        this.canal = canal;
        this.idVideo = idVideo;
    }

    public Long getId() {
        return id;
    }


    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getTumbnail() {
        return Tumbnail;
    }

    public void setTumbnail(String tumbnail) {
        Tumbnail = tumbnail;
    }

    public String getCanal() {
        return canal;
    }

    public void setCanal(String canal) {
        this.canal = canal;
    }

    public String getIdVideo() {
        return idVideo;
    }

    public void setIdVideo(String idVideo) {
        this.idVideo = idVideo;
    }
}
