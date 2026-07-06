package com.example.chessvault.service;

import com.example.chessvault.exception.ResourceNotFoundException;
import com.example.chessvault.model.UserModel;
import com.example.chessvault.repository.ChessRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;


@Service
public class UserService {
    @Autowired
    private final ChessRepository chessRepository;
    private  UserModel userModel;

    public UserService(ChessRepository chessRepository) {
        this.chessRepository = chessRepository;

    }

    public void CriarUser(UserModel userModel){
       chessRepository.save(userModel);
    }

   public ResponseEntity<UserModel> AtualizarUser(Long id){
        UserModel usuarioAntigo = chessRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Não encontrado"));
        usuarioAntigo.setNome(userModel.getNome());
        usuarioAntigo.setEmail(userModel.getEmail());
        usuarioAntigo.setSenha(userModel.getSenha());

        return ResponseEntity.ok(userModel);
   }

   public UserModel LerId(Long id){
       UserModel user = chessRepository.findById(id)
               .orElseThrow(() -> new ResourceNotFoundException("###########################Não encontrado##########################"));
       return user;
   }
   public String DeletarUser(Long id){
      chessRepository.deleteById(id);
      return "Usuario deletado com sucesso";
   }


}
