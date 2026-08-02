package com.example.chessvault.repository;

import com.example.chessvault.model.VideoModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VideoRepository extends JpaRepository<VideoModel, Long> {
    boolean existsByIdVideo(String idVideo);
}
