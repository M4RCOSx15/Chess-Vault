package com.example.chessvault.service;

import com.example.chessvault.config.SecurityConfig;
import com.example.chessvault.dto.UserRequestDTO;
import com.example.chessvault.exception.ResourceNotFoundException;
import com.example.chessvault.model.UserModel;
import com.example.chessvault.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;


@Service
public class UserService {
    @Autowired
    private final UserRepository userRepository;
    private  UserModel userModel;
    private final SecurityConfig securityConfig ;
    public UserService(UserRepository userRepository, SecurityConfig securityConfig) {
        this.userRepository = userRepository;
        this.securityConfig = securityConfig;
    }

    public String CriarUser(UserRequestDTO userDTO){
       UserModel user = new UserModel();
       String senhahash;
       user.setNome(userDTO.getNome());
       user.setEmail(userDTO.getEmail());
       senhahash = securityConfig.SenhaHash1(userDTO.getSenha());
       user.setSenha(senhahash);
       userRepository.save(user);
       return senhahash;
    }

   public ResponseEntity<UserModel> AtualizarUser(Long id){
        UserModel usuarioAntigo = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Não encontrado"));
        usuarioAntigo.setNome(userModel.getNome());
        usuarioAntigo.setEmail(userModel.getEmail());
        usuarioAntigo.setSenha(userModel.getSenha());

        return ResponseEntity.ok(userModel);
   }

   public UserModel LerId(Long id){
       UserModel user = userRepository.findById(id)
               .orElseThrow(() -> new ResourceNotFoundException("###########################Não encontrado##########################"));
       return user;
   }
   public String DeletarUser(Long id){
      userRepository.deleteById(id);
      return "Usuario deletado com sucesso";
   }

   public String Senhahash(String senha){
       return securityConfig.SenhaHash1(senha);
   }


}
