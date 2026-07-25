package com.example.chessvault.service;

import com.example.chessvault.model.JogadorModel;
import com.example.chessvault.repository.JogadorRepository;
import org.springframework.stereotype.Service;

@Service
public class JogadorService {
    private final JogadorRepository jogadorRepository;

    public JogadorService(JogadorRepository jogadorRepository) {
        this.jogadorRepository = jogadorRepository;
    }

    public String CriarJogador(JogadorModel jogadorModel){
        

    }

}
