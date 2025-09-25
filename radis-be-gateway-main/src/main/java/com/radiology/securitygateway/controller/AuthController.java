package com.radiology.securitygateway.controller;

import com.radiology.securitygateway.dto.AuthResponse;
import com.radiology.securitygateway.dto.LoginRequest;
import com.radiology.securitygateway.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }
    @PostMapping("/login")
    public Mono<ResponseEntity<AuthResponse>> login(@RequestBody LoginRequest request) {
        return authService.authenticate(request.getUsername(), request.getPassword())
                .map(ResponseEntity::ok)
                .onErrorResume(e -> Mono
                        .just(ResponseEntity.status(401)
                        .body(new AuthResponse("Authentication failed"))));
    }
}