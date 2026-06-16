package com.chessvault.game.domain;

import com.chessvault.shared.auditing.AuditableEntity;
import com.chessvault.shared.exception.BusinessException;
import com.chessvault.user.domain.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "games")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Game extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "uuid")
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(name = "white_player", length = 100)
    private String whitePlayer;

    @Column(name = "black_player", length = 100)
    private String blackPlayer;

    @Enumerated(EnumType.STRING)
    @Column(length = 15)
    private GameResult result;

    @Column(length = 200)
    private String event;

    @Column(name = "game_date")
    private LocalDate gameDate;

    @Embedded
    private PgnContent pgn;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(
            name = "game_tags",
            joinColumns = @JoinColumn(name = "game_id")
    )
    @Builder.Default
    private Set<GameTag> tags = new HashSet<>();

    // ─── Factory Method (garante invariantes) ────────────────────────────────

    public static Game create(User user, String title) {
        Objects.requireNonNull(user, "Usuário é obrigatório");
        if (title == null || title.isBlank()) {
            throw new BusinessException("Título da partida é obrigatório");
        }
        return Game.builder()
                .user(user)
                .title(title.trim())
                .pgn(PgnContent.empty())
                .tags(new HashSet<>())
                .build();
    }

    // ─── Comportamentos de domínio ────────────────────────────────────────────

    public void addTag(String tagName) {
        this.tags.add(new GameTag(tagName));
    }

    public void removeTag(String tagName) {
        this.tags.removeIf(t -> t.name().equalsIgnoreCase(tagName));
    }

    public void replaceTags(Set<String> newTagNames) {
        this.tags.clear();
        if (newTagNames != null) {
            newTagNames.forEach(this::addTag);
        }
    }

    public boolean belongsTo(User user) {
        return this.user.getId().equals(user.getId());
    }
}
