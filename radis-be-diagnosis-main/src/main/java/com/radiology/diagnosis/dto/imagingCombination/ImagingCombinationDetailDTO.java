package com.radiology.diagnosis.dto.imagingCombination;

import com.radiology.diagnosis.dto.imagingType.ImagingTypeDTO;

import java.util.List;

public class ImagingCombinationDetailDTO {

    private String id;
    private String rating;
    private String adultRRL;
    private String shortJustification;
    private String literatureSummary;
    private List<ImagingTypeDTO> imagingTypes;

    public ImagingCombinationDetailDTO(String id, String rating, String adultRRL, String shortJustification, String literatureSummary, List<ImagingTypeDTO> imagingTypes) {
        this.id = id;
        this.rating = rating;
        this.adultRRL = adultRRL;
        this.shortJustification = shortJustification;
        this.literatureSummary = literatureSummary;
        this.imagingTypes = imagingTypes;
    }

    public ImagingCombinationDetailDTO() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getRating() {
        return rating;
    }

    public void setRating(String rating) {
        this.rating = rating;
    }

    public String getAdultRRL() {
        return adultRRL;
    }

    public void setAdultRRL(String adultRRL) {
        this.adultRRL = adultRRL;
    }

    public String getShortJustification() {
        return shortJustification;
    }

    public void setShortJustification(String shortJustification) {
        this.shortJustification = shortJustification;
    }

    public String getLiteratureSummary() {
        return literatureSummary;
    }

    public void setLiteratureSummary(String literatureSummary) {
        this.literatureSummary = literatureSummary;
    }

    public List<ImagingTypeDTO> getImagingTypes() {
        return imagingTypes;
    }

    public void setImagingTypes(List<ImagingTypeDTO> imagingTypes) {
        this.imagingTypes = imagingTypes;
    }
}