package com.radiology.diagnosis.model;

import com.radiology.diagnosis.util.BaseEntity;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "diagnosis")
public class Diagnosis extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private LocalDateTime createdAt;
    private String createdBy;

    private String primarySymptomId;
    private String secondarySymptomId;
    private String selectedImagingCombinationId;
    private String selectedImagingType;
    private String reason;
    private String comment;
    private String doctorName;
    private String hospitalName;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public Diagnosis() {
    }

    public Diagnosis(UUID id, LocalDateTime createdAt, String createdBy, String primarySymptomId, String secondarySymptomId, String selectedImagingCombinationId, String selectedImagingType, String reason, String comment, String doctorName, String hospitalName) {
        this.id = id;
        this.createdAt = createdAt;
        this.createdBy = createdBy;
        this.primarySymptomId = primarySymptomId;
        this.secondarySymptomId = secondarySymptomId;
        this.selectedImagingCombinationId = selectedImagingCombinationId;
        this.selectedImagingType = selectedImagingType;
        this.reason = reason;
        this.comment = comment;
        this.doctorName = doctorName;
        this.hospitalName = hospitalName;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    @Override
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    @Override
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public String getCreatedBy() {
        return createdBy;
    }

    @Override
    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public String getPrimarySymptomId() {
        return primarySymptomId;
    }

    public void setPrimarySymptomId(String primarySymptomId) {
        this.primarySymptomId = primarySymptomId;
    }

    public String getSecondarySymptomId() {
        return secondarySymptomId;
    }

    public void setSecondarySymptomId(String secondarySymptomId) {
        this.secondarySymptomId = secondarySymptomId;
    }

    public String getSelectedImagingCombinationId() {
        return selectedImagingCombinationId;
    }

    public void setSelectedImagingCombinationId(String selectedImagingCombinationId) {
        this.selectedImagingCombinationId = selectedImagingCombinationId;
    }

    public String getSelectedImagingType() {
        return selectedImagingType;
    }

    public void setSelectedImagingType(String selectedImagingType) {
        this.selectedImagingType = selectedImagingType;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public String getDoctorName() {
        return doctorName;
    }

    public void setDoctorName(String doctorName) {
        this.doctorName = doctorName;
    }

    public String getHospitalName() {
        return hospitalName;
    }

    public void setHospitalName(String hospitalName) {
        this.hospitalName = hospitalName;
    }
}