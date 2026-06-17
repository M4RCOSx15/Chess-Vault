package com.example.chessvault.user.mapper;

import com.example.chessvault.user.entity.User;
import com.example.chessvault.user.response.UserResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(target = "createdAt", expression = "java(user.getCreatedAt().toString())")
    UserResponse toResponse(User user);
}