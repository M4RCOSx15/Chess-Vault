package com.example.chessvault.game.mapper;

import com.example.chessvault.game.response.GameResponse;
import com.example.chessvault.game.entity.Game;
import com.example.chessvault.game.domain.GameResult;
import com.example.chessvault.game.domain.GameTag;

import org.mapstruct.Mapper;
import org.mapstruct.Named;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.Mapping;

import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface GameMapper {

    @Mapping(target = "result", expression = "java(game.getResult() != null ? game.getResult().getNotation() : null)")
    @Mapping(target = "pgnContent", expression = "java(game.getPgn() != null ? game.getPgn().value() : null)")
    @Mapping(target = "tags", expression = "java(mapTags(game.getTags()))")
    GameResponse toResponse(Game game);

    @Named("mapTags")
    default Set<String> mapTags(Set<GameTag> tags) {
        if (tags == null) return Set.of();
        return tags.stream().map(GameTag::name).collect(Collectors.toSet());
    }

    default GameResult mapResult(String notation) {
        if (notation == null) return null;
        return GameResult.fromNotation(notation);
    }

    default PgnContent mapPgn(String pgn) {
        return new PgnContent(pgn);
    }
}
