package com.radiology.securitygateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("auth-service", r -> r
                        .path("/auth/**")
                        .filters(f -> f
                                .rewritePath("/auth/(?<segment>.*)", "/${segment}")
                        )
                        .uri("http://188.166.82.72:8090"))
                // Diagnosis Service Route
                .route("diagnosis-service", r -> r
                        .path("/api/diagnosis/**")
                        .filters(f -> f
                                .rewritePath("/api/diagnosis/(?<segment>.*)", "/${segment}")
                                .removeRequestHeader("Cookie")
                        )
                        .uri("http://188.166.82.72:8091"))
                .build();
    }
}