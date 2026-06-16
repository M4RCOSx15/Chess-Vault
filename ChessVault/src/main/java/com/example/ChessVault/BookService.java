package com.chessvault.book.application;

import com.chessvault.book.api.response.BookResponse;
import com.chessvault.book.domain.Book;
import com.chessvault.book.infrastructure.BookRepository;
import com.chessvault.shared.exception.ResourceNotFoundException;
import com.chessvault.shared.pagination.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BookService {

    private final BookRepository bookRepository;

    public PageResponse<BookResponse> listBooks(int page, int size, String category) {
        var pageable = PageRequest.of(page, size, Sort.by("title"));
        var booksPage = (category != null && !category.isBlank())
                ? bookRepository.findByCategory(category, pageable)
                : bookRepository.findAll(pageable);
        return PageResponse.of(booksPage.map(this::toResponse));
    }

    public BookResponse getBook(UUID id) {
        return bookRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Book", id));
    }

    private BookResponse toResponse(Book book) {
        return new BookResponse(
                book.getId(), book.getTitle(), book.getAuthor(),
                book.getCategory(), book.getDescription(),
                book.getExternalLink(), book.getCoverUrl()
        );
    }
}
