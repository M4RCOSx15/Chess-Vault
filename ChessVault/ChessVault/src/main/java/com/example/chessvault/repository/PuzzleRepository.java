package com.example.chessvault.repository;

import com.example.chessvault.model.PuzzleModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PuzzleRepository extends JpaRepository<PuzzleModel, Long> {
    boolean existsByFen(String fen);

    Optional<PuzzleModel> findByFen(String fen);
}
