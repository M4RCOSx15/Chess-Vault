package com.example.chessvault.service;

import com.example.chessvault.exception.ResourceNotFoundException;
import com.example.chessvault.model.PartidasModel;
import com.example.chessvault.model.UserModel;
import com.example.chessvault.repository.PartidasRepository;
import com.example.chessvault.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class PartidasService {
    private final PartidasRepository partidasRepository;
    private final UserRepository userRepository;
    private Long idUserLogado;
    public PartidasService(PartidasRepository partidasRepository,UserRepository userRepository) {
        this.partidasRepository = partidasRepository;
        this.userRepository = userRepository;
    }
    public void CapturarUserLogado(Long id){
        this.idUserLogado = id;
    }

    public String CriarPartida(PartidasModel partidasChess, String email){
        PartidasModel partidasModel = new PartidasModel();
        partidasModel.setNome(partidasChess.getNome());
        partidasModel.setPGN(partidasChess.getPGN());
        UserModel usuario = new UserModel();


        usuario = userRepository.findByEmail(email).orElseThrow(()-> new ResourceNotFoundException("Usuario nao encontrado"));
        partidasModel.setUsuario(usuario);
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
    public void DeletarPartida(Long id){


        partidasRepository.deleteById(id);
    }
}
