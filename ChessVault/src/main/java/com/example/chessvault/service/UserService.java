package com.example.chessvault.service;

import com.example.chessvault.config.SecurityConfig;
import com.example.chessvault.dto.UserRequestDTO;
import com.example.chessvault.dto.UserResponseDTO;
import com.example.chessvault.exception.ResourceNotFoundException;
import com.example.chessvault.model.UserModel;
import com.example.chessvault.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;



@Service
public class UserService {
    @Autowired
    private final UserRepository userRepository;
    private  UserModel userModel;
    @Autowired
    private PasswordEncoder passwordEncoder;
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;

    }

    public String CriarUser(UserRequestDTO userDTO){
       UserModel user = new UserModel();
       String senhahash;
       user.setNome(userDTO.getNome());
       user.setEmail(userDTO.getEmail());
       senhahash = passwordEncoder.encode(userDTO.getSenha());
       user.setSenha(senhahash);
       userRepository.save(user);
       return "Usuario "+user.getNome()+ " Criado com sucesso";
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
               .orElseThrow(() -> new ResourceNotFoundException("Usuario não encontrado"));
       return user;
   }
   public String DeletarUser(Long id){
      userRepository.deleteById(id);
      return "Usuario deletado com sucesso";
   }


}
