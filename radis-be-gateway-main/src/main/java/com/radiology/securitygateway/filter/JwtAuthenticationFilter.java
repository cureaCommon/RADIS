package com.radiology.securitygateway.filter;

import com.radiology.securitygateway.util.JwtUtil;
import io.jsonwebtoken.Claims;
import jakarta.annotation.Nonnull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpMethod;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextImpl;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Component
public class JwtAuthenticationFilter implements WebFilter, Ordered {

    private final JwtUtil jwtUtil;

    @Autowired
    public JwtAuthenticationFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    @Nonnull
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        // Bypass token validation for CORS preflight requests
        if (exchange.getRequest().getMethod() == HttpMethod.OPTIONS) {
            return chain.filter(exchange);
        }

        String path = exchange.getRequest().getPath().toString();
        if (isWhitelisted(path)) {
            return chain.filter(exchange);
        }

        String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        String token = extractToken(authHeader);

        if (token == null) {
            return onError(exchange, "Authorization header is missing", HttpStatus.UNAUTHORIZED);
        }

        if (!jwtUtil.validateToken(token)) {
            return onError(exchange, "Invalid or expired JWT token", HttpStatus.UNAUTHORIZED);
        }

        Claims claims = jwtUtil.extractAllClaims(token);

        // 1. Authentication objesi oluştur
        Authentication authentication = createAuthentication(claims);
        SecurityContext securityContext = new SecurityContextImpl(authentication);

        // 2. Header'ları ekle
        ServerHttpRequest modifiedRequest = addUserHeaders(exchange.getRequest(), claims);

        // 3. SecurityContext ve modifiye edilmiş request ile devam et
        return chain.filter(exchange.mutate().request(modifiedRequest).build())
                .contextWrite(ReactiveSecurityContextHolder.withSecurityContext(Mono.just(securityContext)));
    }

    private Authentication createAuthentication(Claims claims) {
        String username = claims.getSubject();
        String roles = claims.get("roles", String.class);

        List<SimpleGrantedAuthority> authorities = Collections.emptyList();
        if (roles != null) {
            authorities = Stream.of(roles.split(","))
                    .map(role -> new SimpleGrantedAuthority(role.trim()))
                    .collect(Collectors.toList());
        }

        return new UsernamePasswordAuthenticationToken(
                username,
                null,
                authorities
        );
    }

    private ServerHttpRequest addUserHeaders(ServerHttpRequest request, Claims claims) {
        String username = claims.getSubject();
        String userId = claims.get("userId", String.class);
        String roles = claims.get("roles", String.class);
        String email = claims.get("email", String.class);

        return request.mutate()
                .header("X-User-Id", userId != null ? userId : "")
                .header("X-User-Name", username != null ? username : "")
                .header("X-User-Roles", roles != null ? roles : "")
                .header("X-User-Email", email != null ? email : "")
                .build();
    }

    private boolean isWhitelisted(String path) {
        return path.startsWith("/auth/login") ||
                path.startsWith("/manage") ||
                path.startsWith("/actuator");
    }

    private String extractToken(String authHeader) {
        if (authHeader == null)
            return null;
        if (authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return authHeader;
    }

    private Mono<Void> onError(ServerWebExchange exchange, String error, HttpStatus httpStatus) {
        exchange.getResponse().setStatusCode(httpStatus);
        return exchange.getResponse().setComplete();
    }

    @Override
    public int getOrder() {
        return Ordered.HIGHEST_PRECEDENCE;
    }
}
