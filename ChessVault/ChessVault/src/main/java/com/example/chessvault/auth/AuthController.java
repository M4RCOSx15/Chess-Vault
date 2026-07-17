package com.example.chessvault.auth;

import com.example.chessvault.dto.AuthResponse;
import com.example.chessvault.dto.LoginRequest;
import com.example.chessvault.dto.RegisterRequest;
import com.example.chessvault.security.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class AuthController {

    private final JwtService jwtService;
    private final AuthService authService;

    public AuthController(JwtService jwtService, AuthService authService) {
        this.jwtService = jwtService;
        this.authService = authService;
    }


    @PostMapping("/registrar")
    public ResponseEntity<String> RegistrarUser(@RequestBody RegisterRequest registerRequest){
        authService.register(registerRequest);
        return ResponseEntity.ok("Usuario Criado");
    }

    @PostMapping("/login")
    public AuthResponse LoginUser(@RequestBody LoginRequest loginRequest){

        return authService.login(loginRequest);
    }
}
