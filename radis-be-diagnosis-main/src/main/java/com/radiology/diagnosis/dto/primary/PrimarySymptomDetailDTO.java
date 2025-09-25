package com.radiology.diagnosis.dto.primary;

import com.radiology.diagnosis.dto.secondary.SecondarySymptomSummaryDTO;

import java.util.List;

public class PrimarySymptomDetailDTO {

    private String id;
    private String name;
    private List<SecondarySymptomSummaryDTO> secondarySymptoms;

    public PrimarySymptomDetailDTO(String id, String name, List<SecondarySymptomSummaryDTO> secondarySymptoms) {
        this.id = id;
        this.name = name;
        this.secondarySymptoms = secondarySymptoms;
    }

    public PrimarySymptomDetailDTO() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<SecondarySymptomSummaryDTO> getSecondarySymptoms() {
        return secondarySymptoms;
    }

    public void setSecondarySymptoms(List<SecondarySymptomSummaryDTO> secondarySymptoms) {
        this.secondarySymptoms = secondarySymptoms;
    }
}
