package com.chessvault.dashboard.application;

import com.chessvault.game.infrastructure.GameRepository;
import com.chessvault.shared.exception.ResourceNotFoundException;
import com.chessvault.user.infrastructure.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {

    private final GameRepository gameRepository;
    private final UserRepository userRepository;

    public DashboardResponse getDashboard() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", email));

        long totalGames = gameRepository.countByUserId(user.getId());

        var recentGames = gameRepository.findRecentByUserId(
                user.getId(), PageRequest.of(0, 5)
        ).getContent();

        var recentResponses = recentGames.stream()
                .map(g -> new DashboardResponse.RecentGame(
                        g.getId(), g.getTitle(),
                        g.getWhitePlayer(), g.getBlackPlayer(),
                        g.getResult() != null ? g.getResult().getNotation() : null,
                        g.getCreatedAt()
                ))
                .toList();

        return new DashboardResponse(user.getName(), totalGames, recentResponses);
    }
}
