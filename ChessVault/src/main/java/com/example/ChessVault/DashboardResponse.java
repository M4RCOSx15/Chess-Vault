package com.chessvault.dashboard.application;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record DashboardResponse(
        String userName,
        long totalGames,
        List<RecentGame> recentGames
) {
    public record RecentGame(
            UUID id,
            String title,
            String whitePlayer,
            String blackPlayer,
            String result,
            LocalDateTime createdAt
    ) {}
}
