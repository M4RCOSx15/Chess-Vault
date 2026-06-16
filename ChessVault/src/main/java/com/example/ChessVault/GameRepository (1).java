package com.chessvault.game.infrastructure;

import com.chessvault.game.domain.Game;
import com.chessvault.game.domain.GameResult;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface GameRepository extends JpaRepository<Game, UUID>, JpaSpecificationExecutor<Game> {

    Page<Game> findByUserId(UUID userId, Pageable pageable);

    Optional<Game> findByIdAndUserId(UUID id, UUID userId);

    @Query("""
            SELECT g FROM Game g
            WHERE g.user.id = :userId
            AND (:player IS NULL OR LOWER(g.whitePlayer) LIKE LOWER(CONCAT('%', :player, '%'))
                 OR LOWER(g.blackPlayer) LIKE LOWER(CONCAT('%', :player, '%')))
            AND (:result IS NULL OR g.result = :result)
            AND (:event IS NULL OR LOWER(g.event) LIKE LOWER(CONCAT('%', :event, '%')))
            """)
    Page<Game> findByFilters(
            @Param("userId") UUID userId,
            @Param("player") String player,
            @Param("result") GameResult result,
            @Param("event") String event,
            Pageable pageable
    );

    @Query("SELECT COUNT(g) FROM Game g WHERE g.user.id = :userId")
    long countByUserId(@Param("userId") UUID userId);

    @Query("""
            SELECT g FROM Game g
            WHERE g.user.id = :userId
            ORDER BY g.createdAt DESC
            """)
    Page<Game> findRecentByUserId(@Param("userId") UUID userId, Pageable pageable);
}
