package com.example.chessvault.model;

import jakarta.persistence.*;

@Entity
@Table(name = "Partidas")
public class PartidasModel {
    @Id
    @Column(name = "id_partidas", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "pgn_notacao", nullable = false)
    private String PGN;//NOTAÇÃO DE PARTIDA(METADADOS) --> PESQUISAR COMO FUNCIONA E DE ONDE EXTRAIR
    @Column(name = "partida_nome", nullable = false)
    private String nome;

    public PartidasModel(Long id, String PGN, String nome) {
        this.id = id;
        this.PGN = PGN;
        this.nome = nome;
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
}
