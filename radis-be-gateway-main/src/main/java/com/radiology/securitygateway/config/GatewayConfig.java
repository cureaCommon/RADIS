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
                // Diagnosis Service Route
                .route("Diagnosis-service", r -> r
                        .path("/api/diagnosis/**")
                        .filters(f -> f
                                .rewritePath("/api/diagnosis/(?<segment>.*)", "/${segment}")
                                .removeRequestHeader("Cookie")
                        )
                        .uri("http://radis-be-diagnosis:8081"))
                .build();
    }
}