package com.example.chessvault.controller;

import com.example.chessvault.model.PuzzleModel;
import com.example.chessvault.service.PuzzleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/puzzles")
@CrossOrigin(origins = {"http://127.0.0.1:5500", "http://localhost:5500"})
public class PuzzleController {

    private final PuzzleService puzzleService;

    public PuzzleController(PuzzleService puzzleService) {
        this.puzzleService = puzzleService;
    }

    @GetMapping("/diario")
    public ResponseEntity<PuzzleModel> getPuzzleDiario() {
        PuzzleModel puzzle = puzzleService.buscarESalvarPuzzleDoDia();
        return ResponseEntity.ok(puzzle);
    }

    @GetMapping("/aleatorio")
    public ResponseEntity<PuzzleModel> getPuzzleAleatorio() {
        PuzzleModel puzzle = puzzleService.buscarESalvarPuzzleAleatorio();
        return ResponseEntity.ok(puzzle);
    }
}