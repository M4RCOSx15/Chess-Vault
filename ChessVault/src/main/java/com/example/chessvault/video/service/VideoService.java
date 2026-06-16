package com.example.chessvault.video.service;

import com.chessvault.shared.exception.ResourceNotFoundException;
import com.chessvault.shared.pagination.PageResponse;
import com.example.chessvault.video.response.VideoResponse;
import com.example.chessvault.video.entity.Video;
import com.example.chessvault.video.repository.VideoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class VideoService {

    private final VideoRepository videoRepository;

    public PageResponse<VideoResponse> listVideos(int page, int size, String category) {
        var pageable = PageRequest.of(page, size, Sort.by("title"));
        var videosPage = (category != null && !category.isBlank())
                ? videoRepository.findByCategory(category, pageable)
                : videoRepository.findAll(pageable);
        return PageResponse.of(videosPage.map(this::toResponse));
    }

    public VideoResponse getVideo(UUID id) {
        return videoRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Video", id));
    }

    private VideoResponse toResponse(Video video) {
        return new VideoResponse(
                video.getId(), video.getTitle(), video.getChannel(),
                video.getDescription(), video.getUrl(),
                video.getThumbnailUrl(), video.getCategory()
        );
    }
}
