package com.example.chessvault.controller;

import com.example.chessvault.model.PuzzleModel;
import com.example.chessvault.service.PuzzleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/puzzles")
@CrossOrigin(origins = {"https://chessvaultfrontend.chessvault.workers.dev/"})
public class PuzzleController {

    private final PuzzleService puzzleService;

    public PuzzleController(PuzzleService puzzleService) {
        this.puzzleService = puzzleService;
    }

    @GetMapping("/diario")
    public ResponseEntity<PuzzleModel> getPuzzleDiario(Principal principal) {
        PuzzleModel puzzle = puzzleService.buscarESalvarPuzzleDoDia(principal.getName());
        return ResponseEntity.ok(puzzle);
    }

    @GetMapping("/aleatorio")
    public ResponseEntity<PuzzleModel> getPuzzleAleatorio(Principal principal) {
        PuzzleModel puzzle = puzzleService.buscarESalvarPuzzleAleatorio(principal.getName());
        return ResponseEntity.ok(puzzle);
    }
}