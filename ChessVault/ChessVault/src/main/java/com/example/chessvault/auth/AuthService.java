package com.example.chessvault.auth;

import com.example.chessvault.dto.AuthResponse;
import com.example.chessvault.dto.LoginRequest;
import com.example.chessvault.dto.RegisterRequest;
import com.example.chessvault.exception.ResourceNotFoundException;
import com.example.chessvault.model.UserModel;
import com.example.chessvault.repository.UserRepository;
import com.example.chessvault.security.JwtService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    public AuthService(UserRepository userRepository, AuthResponse authResponse,PasswordEncoder passwordEncoder,JwtService jwtService,UserModel userModel) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public void register(RegisterRequest registerdto) {
        UserModel userModel = new UserModel();
        boolean existEmail =  userRepository.existsByEmail(registerdto.getEmail());
        if(existEmail){
            throw new ResourceNotFoundException("Email já cadastrado");
        }else if (existEmail == false){
          userModel.setNome(registerdto.getNome());
          userModel.setEmail(registerdto.getEmail());
          String senhaRegister = passwordEncoder.encode(registerdto.getSenha());
          userModel.setSenha(senhaRegister);

          userRepository.save(userModel);
        }
    }

    public AuthResponse login(LoginRequest logindto) {
       UserModel usuario = userRepository.findByEmail(logindto.getEmail()).orElseThrow(() -> new ResourceNotFoundException("Credenciais invalidas"));

       boolean testeSenha = passwordEncoder.matches(logindto.getSenha(), usuario.getSenha());
       if (!testeSenha) {
            throw new ResourceNotFoundException("Credenciais invalidas");
        }
        String token = jwtService.generateToken(usuario.getEmail());
       return new AuthResponse(token, usuario.getNome(),usuario.getEmail());
    }
}