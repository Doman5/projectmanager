package com.ddop.projectmanager.service;

import com.ddop.projectmanager.dto.LoginDto;
import com.ddop.projectmanager.dto.RegisterDto;
import com.ddop.projectmanager.dto.TokenDto;
import com.ddop.projectmanager.model.User;
import com.ddop.projectmanager.repo.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public void register(@RequestBody RegisterDto request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User exists");
        }

        User user = new User();
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());

        userRepository.save(user);
    }

    public TokenDto login(@RequestBody LoginDto request) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.email(), request.password()));

        if (auth.getPrincipal() == null) {
            throw new IllegalStateException("User not authenticated");
        }

        String token = jwtService.generateToken((UserDetails) auth.getPrincipal());
        return new TokenDto(token);
    }

    public User getAuthenticatedUser() {
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null ) {
            throw new IllegalStateException("User not authenticated");
        }

        if (authentication.getPrincipal() == null) {
            throw new IllegalStateException("User not authenticated");
        }

        var user = (org.springframework.security.core.userdetails.User) authentication.getPrincipal();

        return userRepository.findByEmail(user.getUsername())
                .orElseThrow(() -> new EntityNotFoundException("User with email: " + user.getUsername() + " not found"));
    }
}
