package com.example.chessvault.repository;

import com.example.chessvault.model.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChessRepository extends JpaRepository<UserModel,Long>{
}
