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
    private String Tumbnail;
    private String canal;


    public VideoModel() {}

}
