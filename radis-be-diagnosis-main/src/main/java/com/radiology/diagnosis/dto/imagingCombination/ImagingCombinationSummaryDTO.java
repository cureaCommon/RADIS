package com.radiology.diagnosis.dto.imagingCombination;

public class ImagingCombinationSummaryDTO {

    private String id;
    private String rating;
    private String adultRRL;
    private String shortJustification;
    private String literatureSummary;
    private int imagingTypeCount;


    public ImagingCombinationSummaryDTO(String id, String rating, String adultRRL, String shortJustification, String literatureSummary, int imagingTypeCount) {
        this.id = id;
        this.rating = rating;
        this.adultRRL = adultRRL;
        this.shortJustification = shortJustification;
        this.literatureSummary = literatureSummary;
        this.imagingTypeCount = imagingTypeCount;
    }

    public ImagingCombinationSummaryDTO() {
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

    public int getImagingTypeCount() {
        return imagingTypeCount;
    }

    public void setImagingTypeCount(int imagingTypeCount) {
        this.imagingTypeCount = imagingTypeCount;
    }
}
