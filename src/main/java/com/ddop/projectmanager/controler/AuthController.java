package com.ddop.projectmanager.controler;

import com.ddop.projectmanager.dto.LoginDto;
import com.ddop.projectmanager.dto.RegisterDto;
import com.ddop.projectmanager.dto.TokenDto;
import com.ddop.projectmanager.dto.UserDto;
import com.ddop.projectmanager.mapper.UserMapper;
import com.ddop.projectmanager.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public void register(@RequestBody RegisterDto request) {
        authService.register(request);
    }

    @PostMapping("/login")
    public TokenDto login(@RequestBody LoginDto request) {
        return authService.login(request);
    }

    @GetMapping("/me")
    public UserDto me() {
        return UserMapper.mapToDto(authService.getAuthenticatedUser());
    }
}
