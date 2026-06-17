package com.example.chessvault;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
public class ChessVaultApplication {

    public static void main(String[] args) {
        SpringApplication.run(ChessVaultApplication.class, args);
    }
}
