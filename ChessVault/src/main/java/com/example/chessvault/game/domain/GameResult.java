package com.example.chessvault.game.domain;

public enum GameResult {
    WHITE_WINS("1-0"),
    BLACK_WINS("0-1"),
    DRAW("1/2-1/2"),
    UNKNOWN("*");

    private final String notation;

    GameResult(String notation) {
        this.notation = notation;
    }

    public String getNotation() {
        return notation;
    }

    public static GameResult fromNotation(String notation) {
        for (GameResult r : values()) {
            if (r.notation.equals(notation)) return r;
        }
        throw new IllegalArgumentException("Resultado inválido: " + notation);
    }
}
