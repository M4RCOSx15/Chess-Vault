package com.example.chessvault.repository;

import com.example.chessvault.model.PartidasModel;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PartidasRepository extends JpaRepository<PartidasModel,Long> {

    Optional<PartidasModel> findByNome(String nome);
    List<PartidasModel> findByUsuario_Email(String email);
    Optional<PartidasModel> findById(Long aLong);
       List<PartidasModel> findByJogador1_IdOrJogador2_Id(Long jogadorId, Long jogadorId1);
    @Query("SELECT p FROM PartidasModel p WHERE p.jogador1.id = :jogadorId OR p.jogador2.id = :jogadorId")
    List<PartidasModel> findByJogador1IdOrJogador2Id(
            @Param("jogadorId") Long jogadorId1,
            @Param("jogadorId") Long jogadorId2
    );
}
