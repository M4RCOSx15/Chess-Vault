package com.example.chessvault.service;

import com.example.chessvault.exception.ResourceNotFoundException;
import com.example.chessvault.model.PartidasModel;
import com.example.chessvault.repository.PartidasRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PartidasService {
    private final PartidasRepository partidasRepository;

    public PartidasService(PartidasRepository partidasRepository) {
        this.partidasRepository = partidasRepository;
    }

    public String CriarPartida(PartidasModel partidasChess){
        PartidasModel partidasModel = new PartidasModel();
        partidasModel.setNome(partidasModel.getNome());
        partidasModel.setPGN(partidasChess.getPGN());
        partidasRepository.save(partidasModel);
        return "Partida salva com sucesso";
    }

    public PartidasModel RetornarPartida(String nome){
        String nomeDb = nome.toLowerCase();
        PartidasModel partida = partidasRepository.findByNome(nomeDb).orElseThrow(() -> new ResourceNotFoundException("Partida não encontrada"));
        return partida;
    }
    public List<PartidasModel> RetornarTodasPartidas(){
        return partidasRepository.findAll();
    }
    public void DeletarPartida(String nome){
        String nomeDb = nome.toLowerCase();
        Long partidaId = partidasRepository.findByNome(nomeDb).get().getId();
        partidasRepository.deleteById(partidaId);
    }
}
