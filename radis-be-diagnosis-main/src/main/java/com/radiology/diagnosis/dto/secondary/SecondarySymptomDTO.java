package com.radiology.diagnosis.dto.secondary;

public class SecondarySymptomDTO {

    private String id;
    private String name;

    public SecondarySymptomDTO() {
    }

    public SecondarySymptomDTO(String id, String name) {
        this.id = id;
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
}
