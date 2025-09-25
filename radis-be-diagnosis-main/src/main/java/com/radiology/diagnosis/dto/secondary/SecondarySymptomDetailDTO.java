package com.radiology.diagnosis.dto.secondary;

import com.radiology.diagnosis.dto.imagingCombination.ImagingCombinationDTO;

import java.util.List;

public class SecondarySymptomDetailDTO {

    private String id;
    private String name;
    private List<ImagingCombinationDTO> imagingCombinations;

    public SecondarySymptomDetailDTO(String id, String name, List<ImagingCombinationDTO> imagingCombinations) {
        this.id = id;
        this.name = name;
        this.imagingCombinations = imagingCombinations;
    }

    public SecondarySymptomDetailDTO() {
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

    public List<ImagingCombinationDTO> getImagingCombinations() {
        return imagingCombinations;
    }

    public void setImagingCombinations(List<ImagingCombinationDTO> imagingCombinations) {
        this.imagingCombinations = imagingCombinations;
    }
}
