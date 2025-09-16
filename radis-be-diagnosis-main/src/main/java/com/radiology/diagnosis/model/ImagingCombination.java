package com.radiology.diagnosis.model;

import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;


@Entity
public class ImagingCombination {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column
    private String rating;

    @Column(columnDefinition="text")
    private String adultRRL;

    @Column(columnDefinition="text")
    private String shortJustification;

    @Column(columnDefinition="text")
    private String literatureSummary;

    //@ManyToOne
    @ManyToOne(optional = false, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "secondary_symptom_id")
    private SecondarySymptom secondarySymptom;

    //@ManyToMany
    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
            name = "imaging_combination_imaging_type",
            joinColumns = @JoinColumn(name = "imaging_combination_id"),
            inverseJoinColumns = @JoinColumn(name = "imaging_type_id")
    )
    private Set<ImagingType> imagingTypes = new HashSet<>();

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

    public String getShortJustification() {
        return shortJustification;
    }

    public void setShortJustification(String shortJustification) {
        this.shortJustification = shortJustification;
    }

    public String getAdultRRL() {
        return adultRRL;
    }

    public void setAdultRRL(String adultRRL) {
        this.adultRRL = adultRRL;
    }

    public String getLiteratureSummary() {
        return literatureSummary;
    }

    public void setLiteratureSummary(String literatureSummary) {
        this.literatureSummary = literatureSummary;
    }

    public SecondarySymptom getSecondarySymptom() {
        return secondarySymptom;
    }

    public void setSecondarySymptom(SecondarySymptom secondarySymptom) {
        this.secondarySymptom = secondarySymptom;
    }

    public Set<ImagingType> getImagingTypes() {
        return imagingTypes;
    }

    public void setImagingTypes(Set<ImagingType> imagingTypes) {
        this.imagingTypes = imagingTypes;
    }
}