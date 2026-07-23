package com.example.chessvault.model;

import jakarta.persistence.*;

@Entity
@Table(name = "Partidas")
public class PartidasModel {
    @Id
    @Column(name = "id_partidas", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "pgn_notacao", nullable = false, length = 600)
    private String PGN;
    @Column(name = "partida_nome", nullable = false)
    private String nome;
    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private UserModel usuario;

    public PartidasModel() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPGN() {
        return PGN;
    }

    public void setPGN(String PGN) {
        this.PGN = PGN;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public UserModel getUsuario() {
        return usuario;
    }

    public void setUsuario(UserModel usuario) {
        this.usuario = usuario;
    }

}
