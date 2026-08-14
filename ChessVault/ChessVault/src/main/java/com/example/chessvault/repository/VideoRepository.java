package com.example.chessvault.repository;

import com.example.chessvault.model.PartidasModel;
import com.example.chessvault.model.VideoModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VideoRepository extends JpaRepository<VideoModel, Long> {
    boolean existsByIdVideo(String idVideo);


    List<VideoModel> findByUsuario_Email(String email);
}
