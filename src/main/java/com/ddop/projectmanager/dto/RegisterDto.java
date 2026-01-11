package com.ddop.projectmanager.dto;

public record RegisterDto(
        String email,
        String password,
        String firstName,
        String lastName) {}
