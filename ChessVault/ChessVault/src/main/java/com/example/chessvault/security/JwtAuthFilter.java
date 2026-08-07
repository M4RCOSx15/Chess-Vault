package com.example.chessvault.security;

import com.example.chessvault.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserLookupService userLookupService;

    public JwtAuthFilter(JwtService jwtService, UserLookupService userLookupService) {
        this.jwtService = jwtService;
        this.userLookupService =userLookupService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            if (jwtService.isTokenValid(token)) {
                String email = jwtService.extractEmail(token);

                // Confirma que o usuário do token ainda existe no banco
               userLookupService.buscarPorEmail(email).ifPresent(usuario -> {
                    var authentication = new UsernamePasswordAuthenticationToken(
                            email, null, Collections.emptyList()
                    );
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                });
            }
        }

        filterChain.doFilter(request, response);
    }
}