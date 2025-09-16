package com.radiology.diagnosis.util;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class UserIdInterceptor implements HandlerInterceptor {

    private final UserContext userContext;

    @Autowired
    public UserIdInterceptor(UserContext userContext) {
        this.userContext = userContext;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String userId = request.getHeader("X-User-Id");

        if (userId != null && !userId.isEmpty()) {
            userContext.setCurrentUserId(userId);
        }

        return true;
    }
}