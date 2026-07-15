package com.example.chessvault.auth;

import com.example.chessvault.dto.AuthResponse;
import com.example.chessvault.dto.LoginRequest;
import com.example.chessvault.dto.RegisterRequest;
import com.example.chessvault.security.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final JwtService jwtService;
    private final AuthService authService;
    public AuthController(JwtService jwtService, AuthService authService) {
        this.jwtService = jwtService;
        this.authService = authService;
    }

    @RequestMapping("/registrar")
    public ResponseEntity<String> RegistrarUser(RegisterRequest registerRequest){
        authService.register(registerRequest);
        return ResponseEntity.ok("Usuario Criado");
    }
    @RequestMapping("/login")
    public AuthResponse LoginUser(LoginRequest loginRequest){
        return authService.login(loginRequest);
    }
}
