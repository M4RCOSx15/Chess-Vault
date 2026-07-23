package com.example.chessvault.repository;

import com.example.chessvault.model.PartidasModel;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PartidasRepository extends JpaRepository<PartidasModel,Long> {

    Optional<PartidasModel> findByNome(String nome);
    List<PartidasModel> findByUsuario_Email(String email);
}
