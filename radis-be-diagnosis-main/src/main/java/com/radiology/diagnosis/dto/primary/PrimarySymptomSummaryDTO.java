package com.radiology.diagnosis.dto.primary;

public class PrimarySymptomSummaryDTO {

    private String id;
    private String name;
    private int secondarySymptomCount;

    public PrimarySymptomSummaryDTO(String id, String name, int secondarySymptomCount) {
        this.id = id;
        this.name = name;
        this.secondarySymptomCount = secondarySymptomCount;
    }

    public PrimarySymptomSummaryDTO() {
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

    public int getSecondarySymptomCount() {
        return secondarySymptomCount;
    }

    public void setSecondarySymptomCount(int secondarySymptomCount) {
        this.secondarySymptomCount = secondarySymptomCount;
    }
}
