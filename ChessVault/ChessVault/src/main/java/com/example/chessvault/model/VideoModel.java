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
    @Column(name = "thumbnail")
    private String thumbnail;
    @Column(name = "canal")
    private String canal;
    @Column(name = "id_video")
    private String idVideo;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private UserModel usuario;

    public VideoModel() {}

    public VideoModel(Long id, String url, String titulo, String thumbnail, String canal, String idVideo) {
        this.id = id;
        this.url = url;
        this.titulo = titulo;
        this.thumbnail = thumbnail;
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

    public String getThumbnail() {
        return thumbnail;
    }

    public void setThumbnail(String thumbnail) {
        this.thumbnail = thumbnail;
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

    public UserModel getUsuario() {
        return usuario;
    }

    public void setUsuario(UserModel usuario) {
        this.usuario = usuario;
    }
}
