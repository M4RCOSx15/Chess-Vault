package com.example.chessvault.dto;

import jakarta.persistence.Column;

public class VideoRequestDTO {

    private Long id;
    private String url;
    private String titulo;
    private String Tumbnail;
    private String canal;
    private String idVideo;

    public VideoRequestDTO(Long id, String url, String titulo, String tumbnail, String canal, String idVideo) {
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

    public void setId(Long id) {
        this.id = id;
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
