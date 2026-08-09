package com.example.chessvault.service;

import com.example.chessvault.dto.PuzzleDTO;
import com.example.chessvault.model.PuzzleModel;
import com.example.chessvault.repository.PuzzleRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;

@Service
public class PuzzleService {

    private final RestClient restClient;
    private final PuzzleRepository puzzleRepository;


    public PuzzleService(PuzzleRepository puzzleRepository) {
        this.puzzleRepository = puzzleRepository;
        this.restClient = RestClient.builder()
                .baseUrl("https://api.chess.com/pub/puzzle")
                .defaultHeader("User-Agent", "ChessVaultApp (contato: marcosdoth15@email.com)")
                .build();
    }

    @Transactional
    @Cacheable(value = "PuzzleCache", key = "#email")
    public PuzzleModel buscarESalvarPuzzleDoDia(String email) {
        // 1. Faz a requisição para a API externa
        PuzzleDTO dto = restClient.get()
                .retrieve()
                .body(PuzzleDTO.class);

        if (dto == null || dto.fen() == null) {
            throw new RuntimeException("Não foi possível obter o puzzle do Chess.com");
        }

        // 2. Se já existir no banco pelo FEN, apenas retorna o existente sem duplicar
        return puzzleRepository.findByFen(dto.fen())
                .orElseGet(() -> {
                    // 3. Se for novo, mapeia o DTO para a Entidade e Salva
                    PuzzleModel novoPuzzle = new PuzzleModel(
                            dto.title(),
                            dto.url(),
                            dto.fen(),
                            dto.pgn(),
                            dto.image()
                    );
                    return puzzleRepository.save(novoPuzzle);
                });
    }

    @Transactional
    @CacheEvict(value = "PuzzleCache", key = "#email")
    public PuzzleModel buscarESalvarPuzzleAleatorio(String email) {
        PuzzleDTO dto = restClient.get()
                .uri("/random")
                .retrieve()
                .body(PuzzleDTO.class);

        if (dto == null) {
            throw new RuntimeException("Erro ao buscar puzzle aleatório");
        }

        // Converte o DTO consumido da API e salva diretamente no banco
        PuzzleModel puzzle = new PuzzleModel(
                dto.title(),
                dto.url(),
                dto.fen(),
                dto.pgn(),
                dto.image()
        );

        return puzzleRepository.save(puzzle);
    }
}