package com.radiology.securitygateway.exception;

import org.springframework.boot.web.error.ErrorAttributeOptions;
import org.springframework.boot.web.reactive.error.DefaultErrorAttributes;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.reactive.function.server.ServerRequest;

import java.util.Map;

@Component
public class GlobalExceptionHandler extends DefaultErrorAttributes {

    @Override
    public Map<String, Object> getErrorAttributes(ServerRequest request, ErrorAttributeOptions options) {
        Map<String, Object> map = super.getErrorAttributes(request, options);

        Throwable error = getError(request);

        if (error instanceof org.springframework.security.access.AccessDeniedException) {
            map.put("status", HttpStatus.FORBIDDEN.value());
            map.put("error", "Forbidden");
            map.put("message", "Access denied");
        } else if (error instanceof org.springframework.security.authentication.AuthenticationCredentialsNotFoundException) {
            map.put("status", HttpStatus.UNAUTHORIZED.value());
            map.put("error", "Unauthorized");
            map.put("message", "Authentication required");
        } else if (error instanceof HttpClientErrorException.BadRequest) {
            map.put("status", HttpStatus.BAD_REQUEST.value());
            map.put("error", "Bad Request");
            map.put("message", error.getMessage());
        } else if (error instanceof RuntimeException) {
            map.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
            map.put("error", "Internal Server Error");
            map.put("message", error.getMessage());
        }

        return map;
    }
}