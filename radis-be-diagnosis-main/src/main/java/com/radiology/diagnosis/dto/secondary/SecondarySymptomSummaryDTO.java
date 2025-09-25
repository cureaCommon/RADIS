package com.radiology.diagnosis.dto.secondary;

public class SecondarySymptomSummaryDTO {

    private String id;
    private String name;
    private int imagingCombinationCount;

    public SecondarySymptomSummaryDTO(String id, String name, int imagingCombinationCount) {
        this.id = id;
        this.name = name;
        this.imagingCombinationCount = imagingCombinationCount;
    }

    public SecondarySymptomSummaryDTO() {
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

    public int getImagingCombinationCount() {
        return imagingCombinationCount;
    }

    public void setImagingCombinationCount(int imagingCombinationCount) {
        this.imagingCombinationCount = imagingCombinationCount;
    }
}
