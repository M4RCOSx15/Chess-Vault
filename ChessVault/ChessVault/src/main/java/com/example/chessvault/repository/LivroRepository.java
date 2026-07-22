package com.example.chessvault.repository;

import com.example.chessvault.model.LivroModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LivroRepository extends JpaRepository<LivroModel,Long> {

    Optional<LivroModel> findById(Long id);
    boolean existsById(Long id);
}
