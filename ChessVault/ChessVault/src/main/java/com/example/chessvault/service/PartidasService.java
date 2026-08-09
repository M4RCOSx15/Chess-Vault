package com.example.chessvault.service;

import com.example.chessvault.exception.ResourceNotFoundException;
import com.example.chessvault.model.JogadorModel;
import com.example.chessvault.model.PartidasModel;
import com.example.chessvault.model.UserModel;
import com.example.chessvault.repository.JogadorRepository;
import com.example.chessvault.repository.PartidasRepository;
import com.example.chessvault.repository.UserRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.regex.Pattern;

@Service
public class PartidasService {
    private final PartidasRepository partidasRepository;
    private final UserRepository userRepository;
    private final JogadorRepository jogadorRepository;
    // Separadores aceitos entre os dois nomes: "vs", "vs.", "x", "×".
    // Ex: "Carlsen vs Nakamura", "Carlsen vs. Nakamura", "Carlsen x Nakamura".
    private static final Pattern SEPARADOR_VS = Pattern.compile("(?i)\\s+(?:vs\\.?|x|×)\\s+");

    public PartidasService(PartidasRepository partidasRepository,UserRepository userRepository, JogadorRepository jogadorRepository) {
        this.partidasRepository = partidasRepository;
        this.userRepository = userRepository;
        this.jogadorRepository = jogadorRepository;
    }
    @CacheEvict(value = "PartidasCache", key = "#email")
    public String CriarPartida(PartidasModel partidasChess, String email){
        PartidasModel partidasModel = new PartidasModel();
        partidasModel.setNome(partidasChess.getNome());
        partidasModel.setPGN(partidasChess.getPGN());
        UserModel usuario = new UserModel();

        usuario = userRepository.findByEmail(email).orElseThrow(()-> new ResourceNotFoundException("Usuario nao encontrado"));
        partidasModel.setUsuario(usuario);

        if (partidasChess.getJogador1() != null && partidasChess.getJogador1().getId() != null) {
            partidasModel.setJogador1(buscarJogador(partidasChess.getJogador1().getId()));
        }
        if (partidasChess.getJogador2() != null && partidasChess.getJogador2().getId() != null) {
            partidasModel.setJogador2(buscarJogador(partidasChess.getJogador2().getId()));
        }

        //    Pra qualquer slot que ainda esteja vazio, tenta extrair do
        //    nome da partida (ex: "Carlsen vs Nakamura") e casar com o
        //    acervo de jogadores do usuário. Totalmente opcional — se não
        //    achar separador ou não achar o jogador, simplesmente ignora.
        extrairEVincularJogadoresPorNome(partidasModel, email);

        partidasRepository.save(partidasModel);
        return "Partida salva com sucesso";
    }
    @CacheEvict(value = "PartidasCache", key = "#email")
    private void extrairEVincularJogadoresPorNome(PartidasModel partidasModel, String email){
        if (partidasModel.getJogador1() != null && partidasModel.getJogador2() != null) return;

        String nome = partidasModel.getNome();
        if (nome == null || nome.isBlank()) return;

        String[] partes = SEPARADOR_VS.split(nome.trim());
        if (partes.length < 2) return; // não achou "X vs Y" no nome, não dá pra extrair

        List<JogadorModel> roster = jogadorRepository.findByUsuario_Email(email);

        if (partidasModel.getJogador1() == null) {
            JogadorModel encontrado = encontrarJogadorPorNome(partes[0], roster);
            if (encontrado != null) partidasModel.setJogador1(encontrado);
        }
        if (partidasModel.getJogador2() == null) {
            JogadorModel encontrado = encontrarJogadorPorNome(partes[1], roster);
            if (encontrado != null) partidasModel.setJogador2(encontrado);
        }
    }

    @CacheEvict(value = "PartidasCache", key = "#email")
    public PartidasModel VincularJogador(Long partidaId, Long jogadorId){
        PartidasModel partida = partidasRepository.findById(partidaId)
                .orElseThrow(() -> new ResourceNotFoundException("Partida não encontrada"));
        JogadorModel jogador = buscarJogador(jogadorId);

        if (partida.getJogador1() == null) {
            partida.setJogador1(jogador);
        } else if (partida.getJogador2() == null) {
            partida.setJogador2(jogador);
        } else {
            throw new IllegalStateException("Esta partida já tem dois jogadores vinculados");
        }

        return partidasRepository.save(partida);
    }
    @CacheEvict(value = "PartidasCache", key = "#email")
    // Desvincula um jogador específico da partida (limpa o slot em que ele estiver).
    public PartidasModel DesvincularJogador(Long partidaId, Long jogadorId){
        PartidasModel partida = partidasRepository.findById(partidaId)
                .orElseThrow(() -> new ResourceNotFoundException("Partida não encontrada"));

        if (partida.getJogador1() != null && partida.getJogador1().getId().equals(jogadorId)) {
            partida.setJogador1(null);
        } else if (partida.getJogador2() != null && partida.getJogador2().getId().equals(jogadorId)) {
            partida.setJogador2(null);
        }

        return partidasRepository.save(partida);
    }



    private JogadorModel encontrarJogadorPorNome(String nomeBusca, List<JogadorModel> roster){
        String alvo = nomeBusca.trim().toLowerCase();
        if (alvo.isBlank()) return null;

        // match exato primeiro (ex: nome da partida == nome cadastrado)
        for (JogadorModel j : roster) {
            if (j.getNome().equalsIgnoreCase(alvo)) return j;
        }
        // match parcial nas duas direções (ex: partida diz "Carlsen",
        // cadastro tem "Magnus Carlsen" — e vice-versa)
        for (JogadorModel j : roster) {
            String nomeJogador = j.getNome().toLowerCase();
            if (nomeJogador.contains(alvo) || alvo.contains(nomeJogador)) return j;
        }
        return null;
    }

    private JogadorModel buscarJogador(Long id){
        return jogadorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Jogador não encontrado"));
    }

    public PartidasModel RetornarPartida(String nome){
        String nomeDb = nome.toLowerCase();
        PartidasModel partida = partidasRepository.findByNome(nomeDb).orElseThrow(() -> new ResourceNotFoundException("Partida não encontrada"));
        return partida;
    }
    @CacheEvict(value = "PartidasCache", key = "#email")
    public List<PartidasModel> BuscarPartidasDoJogador(Long jogadorId,String email){
        return partidasRepository.findByJogador1_IdOrJogador2_Id(jogadorId, jogadorId);
    }
    @Cacheable(value = "PartidasCache", unless = "#result == null")
    public List<PartidasModel> RetornarTodasPartidas(String email){
        return partidasRepository.findByUsuario_Email(email);
    }
    @CacheEvict(value = "PartidasCache", key = "#email")
    public void DeletarPartida(Long id, String email){
        partidasRepository.deleteById(id);
    }



}
