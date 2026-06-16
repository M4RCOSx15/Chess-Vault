package com.chessvault.game.api;

import com.chessvault.game.api.request.CreateGameRequest;
import com.chessvault.game.api.request.UpdateGameRequest;
import com.chessvault.game.api.response.GameResponse;
import com.chessvault.game.application.GameService;
import com.chessvault.shared.pagination.PageResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/games")
@RequiredArgsConstructor
public class GameController {

    private final GameService gameService;

    @GetMapping
    public ResponseEntity<PageResponse<GameResponse>> listGames(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String player,
            @RequestParam(required = false) String result,
            @RequestParam(required = false) String event
    ) {
        return ResponseEntity.ok(gameService.listGames(page, size, player, result, event));
    }

    @GetMapping("/{id}")
    public ResponseEntity<GameResponse> getGame(@PathVariable UUID id) {
        return ResponseEntity.ok(gameService.getGame(id));
    }

    @PostMapping
    public ResponseEntity<GameResponse> createGame(@Valid @RequestBody CreateGameRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(gameService.createGame(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<GameResponse> updateGame(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateGameRequest request
    ) {
        return ResponseEntity.ok(gameService.updateGame(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGame(@PathVariable UUID id) {
        gameService.deleteGame(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/import/pgn")
    public ResponseEntity<GameResponse> importFromPgn(@RequestBody String pgnContent) {
        return ResponseEntity.status(HttpStatus.CREATED).body(gameService.importFromPgn(pgnContent));
    }
}
