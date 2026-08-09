package com.example.chessvault.service;

import com.example.chessvault.exception.ResourceNotFoundException;
import com.example.chessvault.model.LivroModel;
import com.example.chessvault.model.UserModel;
import com.example.chessvault.repository.LivroRepository;
import com.example.chessvault.repository.UserRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;


import java.util.List;

@Service
public class LivroService {
    private LivroRepository livroRepository;
    private UserRepository userRepository;

    public LivroService(LivroRepository livroRepository,UserRepository userRepository)
    {this.livroRepository=livroRepository;
    this.userRepository = userRepository;
    }
    @CacheEvict(value = "LivroCache", key = "#email")
    public String CriarLivro(LivroModel livro, String email){
        LivroModel livroAdd = new LivroModel();
        livroAdd.setNome(livro.getNome());
        livroAdd.setDescricao(livro.getDescricao());
        livroAdd.setImagemLivro(livro.getImagemLivro());
        UserModel usuario = new UserModel();
        usuario = userRepository.findByEmail(email).orElseThrow(()-> new ResourceNotFoundException("Usuario nao encontrado"));
        livroAdd.setUsuario(usuario);
        livroRepository.save(livroAdd);
        return "Livro adicionado com sucesso";
    }
    @CacheEvict(value = "LivroCache",key = "#email")
    public void DeletarLivro(Long id, String email){
        livroRepository.deleteById(id);

    }
    @Cacheable(value = "LivroCache",key = "#email", unless = "#result == null")
    public List<LivroModel> RetornarTodosLivros(String email){
        return livroRepository.findByUsuario_Email(email);
    }
}
