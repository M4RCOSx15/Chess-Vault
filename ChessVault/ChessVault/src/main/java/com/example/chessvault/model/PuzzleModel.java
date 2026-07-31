    package com.example.chessvault.model;

    import jakarta.persistence.*;

    @Entity
    @Table(name = "puzzle")
    public class PuzzleModel {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "puzzle_id")
        private Long id;
        @Column(name = "titulo")
        private String title;
        @Column(name = "url")
        private String url;
        @Column(name = "fen")
        private String fen;
        @Column(name = "pgn")
        private String pgn;
        @Column(name = "imagem")
        private String image;

        public PuzzleModel() {
        }

        public PuzzleModel( String title, String url, String fen, String pgn, String image) {

            this.title = title;
            this.url = url;
            this.fen = fen;
            this.pgn = pgn;
            this.image = image;
        }




        public Long getId() {
            return id;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getUrl() {
            return url;
        }

        public void setUrl(String url) {
            this.url = url;
        }

        public String getFen() {
            return fen;
        }

        public void setFen(String fen) {
            this.fen = fen;
        }

        public String getPgn() {
            return pgn;
        }

        public void setPgn(String pgn) {
            this.pgn = pgn;
        }

        public String getImage() {
            return image;
        }

        public void setImage(String image) {
            this.image = image;
        }
    }
