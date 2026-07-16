package com.example.chessvault.repository;

import com.example.chessvault.model.PartidasModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PartidasRepository extends JpaRepository<PartidasModel,Long> {

    Optional<PartidasModel> findByNome(String nome);
    boolean existsByNome(String nome);
}
