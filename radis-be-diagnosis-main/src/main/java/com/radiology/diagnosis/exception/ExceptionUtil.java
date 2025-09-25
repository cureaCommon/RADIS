package com.radiology.diagnosis.exception;

public class ExceptionUtil {

    public static ResourceNotFoundException notFound(String entity, Object id) {
        return new ResourceNotFoundException(entity + " not found. ID: " + id);
    }

    public static DuplicateEntityException duplicate(String entity, String field) {
        return new DuplicateEntityException(entity + " already exist. Field: " + field);
    }
}
