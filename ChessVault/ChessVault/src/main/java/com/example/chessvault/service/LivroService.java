package com.example.chessvault.service;

import com.example.chessvault.model.LivroModel;
import com.example.chessvault.model.PartidasModel;
import com.example.chessvault.repository.LivroRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@Service
public class LivroService {
    private LivroRepository livroRepository;

    public LivroService(LivroRepository livroRepository)
    {this.livroRepository=livroRepository;}

    public String CriarLivro(LivroModel livro){
        LivroModel livroAdd = new LivroModel();
        livroAdd.setNome(livro.getNome());
        livroAdd.setDescricao(livro.getDescricao());
        livroAdd.setImagemLivro(livro.getImagemLivro());
        livroRepository.save(livroAdd);
        return "Livro adicionado com sucesso";
    }

    public void DeletarLivro(Long id){
        livroRepository.deleteById(id);
    }

    public List<LivroModel> RetornarTodosLivros(){
        return livroRepository.findAll();
    }
}
