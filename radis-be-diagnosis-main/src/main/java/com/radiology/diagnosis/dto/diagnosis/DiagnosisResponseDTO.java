package com.radiology.diagnosis.dto.diagnosis;

import java.util.UUID;

public class DiagnosisResponseDTO {

    private UUID id;

    public DiagnosisResponseDTO(UUID id) {
        this.id = id;
    }

    public DiagnosisResponseDTO() {
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }
}
