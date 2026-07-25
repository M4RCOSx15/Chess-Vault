package com.example.chessvault.repository;

import com.example.chessvault.model.JogadorModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface JogadorRepository extends JpaRepository<JogadorModel, Long> {

    Optional<JogadorModel> findById(Long id);
}
