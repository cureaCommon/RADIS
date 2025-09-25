package com.radiology.diagnosis.model;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
public class PrimarySymptom {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(unique = true, nullable = false)
    private String name;

    @OneToMany(mappedBy = "primarySymptom", cascade = CascadeType.ALL)
    private List<SecondarySymptom> secondarySymptoms = new ArrayList<>();

    public PrimarySymptom() {
    }

    public PrimarySymptom(String name) {
        this.name = name;
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

    public List<SecondarySymptom> getSecondarySymptoms() {
        return secondarySymptoms;
    }

    public void setSecondarySymptoms(List<SecondarySymptom> secondarySymptoms) {
        this.secondarySymptoms = secondarySymptoms;
    }
}