package com.radiology.diagnosis.model;

import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;

@Entity
public class ImagingType {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(unique = true, nullable = false)
    private String code;

    @Column(unique = true, nullable = false)
    private String name;

    @ManyToMany(mappedBy = "imagingTypes")
    private Set<ImagingCombination> imagingCombinations = new HashSet<>();

    public ImagingType() {
    }

    public ImagingType(String code, String name) {
        this.code = code;
        this.name = name;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<ImagingCombination> getImagingCombinations() {
        return imagingCombinations;
    }

    public void setImagingCombinations(Set<ImagingCombination> imagingCombinations) {
        this.imagingCombinations = imagingCombinations;
    }
}