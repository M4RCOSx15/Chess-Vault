package com.example.chessvault.game.service;

import com.example.chessvault.game.domain.GameResult;
import com.example.chessvault.game.domain.PgnContent;
import com.example.chessvault.game.request.CreateGameRequest;
import com.example.chessvault.game.request.UpdateGameRequest;
import com.example.chessvault.game.response.GameResponse;
import com.example.chessvault.game.entity.Game;
import com.example.chessvault.game.repository.GameRepository;
import com.example.chessvault.game.mapper.GameMapper;
import com.chessvault.shared.exception.BusinessException;
import com.chessvault.shared.exception.ResourceNotFoundException;
import com.chessvault.shared.pagination.PageResponse;
import com.chessvault.user.domain.User;
import com.chessvault.user.infrastructure.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GameService {

    private final GameRepository gameRepository;
    private final UserRepository userRepository;
    private final GameMapper gameMapper;

    public PageResponse<GameResponse> listGames(
            int page, int size,
            String player, String result, String event
    ) {
        var currentUser = getCurrentUser();
        var pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        GameResult gameResult = null;
        if (result != null && !result.isBlank()) {
            gameResult = GameResult.fromNotation(result);
        }

        var gamesPage = gameRepository.findByFilters(
                currentUser.getId(), player, gameResult, event, pageable
        );

        return PageResponse.of(gamesPage.map(gameMapper::toResponse));
    }

    public GameResponse getGame(UUID id) {
        var currentUser = getCurrentUser();
        var game = gameRepository.findByIdAndUserId(id, currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Game", id));
        return gameMapper.toResponse(game);
    }

    @Transactional
    public GameResponse createGame(CreateGameRequest request) {
        var currentUser = getCurrentUser();

        var game = Game.create(currentUser, request.title());
        game.setWhitePlayer(request.whitePlayer());
        game.setBlackPlayer(request.blackPlayer());
        game.setEvent(request.event());
        game.setGameDate(request.gameDate());
        game.setNotes(request.notes());

        if (request.result() != null) {
            game.setResult(GameResult.fromNotation(request.result()));
        }

        if (request.pgnContent() != null) {
            game.setPgn(new PgnContent(request.pgnContent()));
        }

        if (request.tags() != null) {
            request.tags().forEach(game::addTag);
        }

        return gameMapper.toResponse(gameRepository.save(game));
    }

    @Transactional
    public GameResponse updateGame(UUID id, UpdateGameRequest request) {
        var currentUser = getCurrentUser();
        var game = gameRepository.findByIdAndUserId(id, currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Game", id));

        if (request.title() != null && !request.title().isBlank()) {
            game.setTitle(request.title().trim());
        }
        if (request.whitePlayer() != null) game.setWhitePlayer(request.whitePlayer());
        if (request.blackPlayer() != null) game.setBlackPlayer(request.blackPlayer());
        if (request.event() != null) game.setEvent(request.event());
        if (request.gameDate() != null) game.setGameDate(request.gameDate());
        if (request.notes() != null) game.setNotes(request.notes());
        if (request.result() != null) game.setResult(GameResult.fromNotation(request.result()));
        if (request.pgnContent() != null) game.setPgn(new PgnContent(request.pgnContent()));
        if (request.tags() != null) game.replaceTags(request.tags());

        return gameMapper.toResponse(gameRepository.save(game));
    }

    @Transactional
    public void deleteGame(UUID id) {
        var currentUser = getCurrentUser();
        var game = gameRepository.findByIdAndUserId(id, currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Game", id));
        gameRepository.delete(game);
    }

    @Transactional
    public GameResponse importFromPgn(String pgnContent) {
        if (pgnContent == null || pgnContent.isBlank()) {
            throw new BusinessException("Conteúdo PGN não pode ser vazio");
        }
        var currentUser = getCurrentUser();
        var pgn = new PgnContent(pgnContent);

        // Extrai título básico do PGN (pode ser expandido futuramente)
        String title = extractTitleFromPgn(pgnContent);

        var game = Game.create(currentUser, title);
        game.setPgn(pgn);

        return gameMapper.toResponse(gameRepository.save(game));
    }

    private String extractTitleFromPgn(String pgn) {
        // Tenta extrair Event e Players do cabeçalho PGN
        String white = extractTag(pgn, "White");
        String black = extractTag(pgn, "Black");
        String eventName = extractTag(pgn, "Event");

        if (white != null && black != null) {
            return white + " vs " + black + (eventName != null ? " - " + eventName : "");
        }
        return "Partida importada via PGN";
    }

    private String extractTag(String pgn, String tagName) {
        String search = "[" + tagName + " \"";
        int start = pgn.indexOf(search);
        if (start == -1) return null;
        start += search.length();
        int end = pgn.indexOf("\"", start);
        if (end == -1) return null;
        String value = pgn.substring(start, end);
        return value.equals("?") ? null : value;
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", email));
    }
}
