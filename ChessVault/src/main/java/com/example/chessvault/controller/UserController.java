package com.example.chessvault.controller;

import com.example.chessvault.model.UserModel;
import com.example.chessvault.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuario/v1")
public class UserController {

    private final UserService userService;
    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("Criar")
    public ResponseEntity<UserModel> CriarUsuario(@RequestBody UserModel userModel){
        userService.CriarUser(userModel);
        return ResponseEntity.ok(userModel);
    }

    @PutMapping("{id}")
    public ResponseEntity<UserModel> Atualizar(@PathVariable Long id){
        return userService.AtualizarUser(id);
    }

    @DeleteMapping("{id}")
    public String Delete(@PathVariable Long id){
        return userService.DeletarUser(id);
    }
    @GetMapping("{id}")
    public UserModel LerUser (@PathVariable Long id){
        return userService.LerId(id);
    }

}
