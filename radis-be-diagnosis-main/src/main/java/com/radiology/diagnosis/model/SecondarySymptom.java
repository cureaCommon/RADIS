package com.radiology.diagnosis.model;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
public class SecondarySymptom {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(unique = true, nullable = false)
    private String name;

    //@ManyToOne
    @ManyToOne(optional = false, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "primary_symptom_id")
    private PrimarySymptom primarySymptom;

    @OneToMany(mappedBy = "secondarySymptom", cascade = CascadeType.ALL)
    private List<ImagingCombination> imagingCombinations = new ArrayList<>();

    public SecondarySymptom() {
    }

    public SecondarySymptom(String name, PrimarySymptom primarySymptom) {
        this.name = name;
        this.primarySymptom = primarySymptom;
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

    public PrimarySymptom getPrimarySymptom() {
        return primarySymptom;
    }

    public void setPrimarySymptom(PrimarySymptom primarySymptom) {
        this.primarySymptom = primarySymptom;
    }

    public List<ImagingCombination> getImagingCombinations() {
        return imagingCombinations;
    }

    public void setImagingCombinations(List<ImagingCombination> imagingCombinations) {
        this.imagingCombinations = imagingCombinations;
    }
}