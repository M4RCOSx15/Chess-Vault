package com.example.chessvault.service;

import com.example.chessvault.exception.ResourceNotFoundException;
import com.example.chessvault.model.JogadorModel;
import com.example.chessvault.model.PartidasModel;
import com.example.chessvault.model.UserModel;
import com.example.chessvault.repository.JogadorRepository;
import com.example.chessvault.repository.PartidasRepository;
import com.example.chessvault.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;

@Service
public class JogadorService {

    private final JogadorRepository jogadorRepository;
    private final PartidasRepository partidasRepository;
    private final PartidasService partidasService;
    private UserModel usermodel;
    private final UserRepository userRepository;

    public JogadorService(JogadorRepository jogadorRepository,
                          UserRepository userRepository,
                          PartidasRepository partidasRepository,
                          PartidasService partidasService) {
        this.jogadorRepository  = jogadorRepository;
        this.userRepository     = userRepository;
        this.partidasRepository = partidasRepository;
        this.partidasService    = partidasService;
    }

    @Transactional
    public String CriarJogador(JogadorModel jogadorModel, String email) {


        JogadorModel jogador = new JogadorModel();
        jogador.setNome(jogadorModel.getNome());
        jogador.setDescricao(jogadorModel.getDescricao());
        jogador.setAberturasFav(jogadorModel.getAberturasFav());
        jogador.setRating(jogadorModel.getRating());
        jogador.setImagemJogador(jogadorModel.getImagemJogador());
        UserModel usuario = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));
        jogador.setUsuario(usuario);
        jogadorRepository.save(jogador);

        return "Jogador salvo com sucesso";
    }

    /**
     * Deleta o jogador sem precisar que o frontend passe um partidaId.
     *
     * O método agora:
     *   1. Busca todas as partidas vinculadas ao jogador (onde ele é jogador1 OU jogador2).
     *   2. Desvincular cada uma delas.
     *   3. Deleta o jogador.
     *
     * Isso resolve o bug onde o frontend bloqueava a exclusão quando
     * o jogador não tinha partidas vinculadas.
     */
    @Transactional
    public void DeletarJogador(Long jogadorId) {

        JogadorModel jogador = jogadorRepository.findById(jogadorId)
                .orElseThrow(() -> new ResourceNotFoundException("Jogador não encontrado"));

        // Busca partidas onde o jogador aparece como jogador1 ou jogador2
        List<PartidasModel> partidasVinculadas = partidasRepository
                .findByJogador1IdOrJogador2Id(jogadorId, jogadorId);

        // Desvincular cada uma antes de deletar (respeita FK constraints)
        for (PartidasModel partida : partidasVinculadas) {
            partidasService.DesvincularJogador(partida.getId(), jogadorId);
        }

        jogadorRepository.deleteById(jogadorId);
    }

    public ResponseEntity<JogadorModel> AtualizarJogador(Long id, JogadorModel jogadorModel) {
        JogadorModel jogadorAntigo = jogadorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Jogador não encontrado"));
        jogadorAntigo.setNome(jogadorModel.getNome());
        jogadorAntigo.setDescricao(jogadorModel.getDescricao());
        jogadorAntigo.setRating(jogadorModel.getRating());
        jogadorAntigo.setAberturasFav(jogadorModel.getAberturasFav());
        jogadorAntigo.setImagemJogador(jogadorModel.getImagemJogador());
        return ResponseEntity.ok(jogadorAntigo);
    }
    @Cacheable(value = "JogadorCache", unless = "#result == null")
    public List<JogadorModel> RetornarTodosJogadores(String email) {
        System.out.println("======> BUSCANDO JOGADORES NO BANCO DE DADOS (CACHE MISS) <======");
        return jogadorRepository.findByUsuario_Email(email);
    }
}
