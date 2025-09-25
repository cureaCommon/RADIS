package com.radiology.securitygateway.service;

import com.radiology.securitygateway.dto.AuthResponse;
import com.radiology.securitygateway.repository.UserRepository;
import com.radiology.securitygateway.util.JwtUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import static org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder.BCryptVersion.$2A;
import static org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder.BCryptVersion.$2Y;

@Service
@Slf4j
public class AuthService {

    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    public AuthService(JwtUtil jwtUtil, PasswordEncoder passwordEncoder, UserRepository userRepository) {
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
    }

    public Mono<AuthResponse> authenticate(String username, String password) {
        return userRepository.findByUsername(username)
                .switchIfEmpty(Mono.fromRunnable(() -> log.warn("Kullanıcı bulunamadı: {}", username)))
                .flatMap(user -> {
                    if (!isValidBcryptHash(user.getPassword())) {
                        log.error("Geçersiz BCrypt hash formatı: {}", user.getPassword());
                        return Mono.error(new RuntimeException("Geçersiz şifre formatı"));
                    }
                    if (passwordEncoder.matches(password, user.getPassword())) {
                        log.info("Başarılı giriş: {}", username);
                        return Mono.just(new AuthResponse(jwtUtil.generateToken(user)));
                    }
                    log.warn("Şifre eşleşmedi: {}", username);
                    return Mono.error(new RuntimeException("Geçersiz kimlik bilgileri"));
                });
    }

    private boolean isValidBcryptHash(String hash) {
        return hash != null
                && (hash.startsWith($2A.getVersion()) || hash.startsWith($2Y.getVersion()))
                && hash.length() == 60;
    }
}