package com.example.chessvault.service;

import com.example.chessvault.exception.ResourceNotFoundException;
import com.example.chessvault.model.JogadorModel;
import com.example.chessvault.model.PartidasModel;
import com.example.chessvault.model.UserModel;
import com.example.chessvault.repository.JogadorRepository;
import com.example.chessvault.repository.PartidasRepository;
import com.example.chessvault.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;

@Service
public class JogadorService {
    private final JogadorRepository jogadorRepository;
    private final PartidasRepository partidasRepository;
    private UserModel usermodel;
    private final UserRepository userRepository;
    public JogadorService(JogadorRepository jogadorRepository, UserRepository userRepository,PartidasRepository partidasRepository) {
        this.jogadorRepository = jogadorRepository;
        this.userRepository = userRepository;
        this.partidasRepository=partidasRepository;
    }
   @Transactional
    public String CriarJogador(JogadorModel jogadorModel, String email){ //AQUI RECEBE TODOS OS DADOS MAIS O EMAIL PARA VINCULAR TAL JOGADOR A TAL CONTA DE USUARIO
        JogadorModel jogador = new JogadorModel(); //CRIA UMA INSTANCIA PRA RECEBER AS INFORMAÇÕES DO JOGADOR
        jogador.setNome(jogadorModel.getNome());//NOME
        jogador.setDescricao(jogadorModel.getDescricao());//DESCRIÇÃO DO JOGADOR
        jogador.setAberturasFav(jogadorModel.getAberturasFav());//ABERTURA FAVORITA
        jogador.setRating(jogadorModel.getRating());//RATING
        usermodel = userRepository.findByEmail(email).orElseThrow(()-> new ResourceNotFoundException("Usuario nao encontrado"));
        jogador.setUsuario(usermodel);
        jogadorRepository.save(jogador);
        return "Jogador Salvo com sucesso";
    }


    public void DeletarJogador(Long id){
        jogadorRepository.deleteById(id);
    }


    public ResponseEntity<JogadorModel> AtualizarJogador(Long id, JogadorModel jogadorModel){
        JogadorModel jogadorAntigo = jogadorRepository.findById(id).orElseThrow(()->new ResourceNotFoundException("Jogador não encontrado"));
        jogadorAntigo.setNome(jogadorModel.getNome());
        jogadorAntigo.setDescricao(jogadorModel.getDescricao());
        jogadorAntigo.setRating(jogadorModel.getRating());
        jogadorAntigo.setAberturasFav(jogadorModel.getAberturasFav());

        return ResponseEntity.ok(jogadorAntigo);
    }

    public List<JogadorModel> RetornarTodosJogadores(String email){
        return jogadorRepository.findByUsuario_Email(email);
    }



}
