package com.radiology.diagnosis.util;

import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class UserIdListener {

    private static UserContext userContext;

    @Autowired
    public void setUserContext(UserContext userContext) {
        UserIdListener.userContext = userContext;
    }

    @PrePersist
    public void prePersist(Object entity) {
        if (entity instanceof BaseEntity baseEntity) {
            LocalDateTime now = LocalDateTime.now();

            baseEntity.setCreatedAt(now);
            baseEntity.setUpdatedAt(now);

            String userId = userContext.getCurrentUserId();
            baseEntity.setCreatedBy(userId);
            baseEntity.setUpdatedBy(userId);
        }
    }

    @PreUpdate
    public void preUpdate(Object entity) {
        if (entity instanceof BaseEntity baseEntity) {
            baseEntity.setUpdatedAt(LocalDateTime.now());
            baseEntity.setUpdatedBy(userContext.getCurrentUserId());
        }
    }
}
