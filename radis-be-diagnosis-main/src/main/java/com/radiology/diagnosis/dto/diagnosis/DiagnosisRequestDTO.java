package com.radiology.diagnosis.dto.diagnosis;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class DiagnosisRequestDTO {

    @Size(max = 100, message = "Primary symptom cannot exceed 100 characters")
    private String primarySymptomId;

    @Size(max = 100, message = "Secondary symptom cannot exceed 100 characters")
    private String secondarySymptomId;

    @Size(max = 100, message = "Selected imaging combination cannot exceed 100 characters")
    private String selectedImagingCombinationId;

    @Size(max = 100, message = "Selected imaging type cannot exceed 100 characters")
    private String selectedImagingTypeId;

    @Size(max = 1000, message = "Comment cannot exceed 1000 characters")
    private String reason;

    @Size(max = 1000, message = "Comment cannot exceed 1000 characters")
    private String comment;

    @NotBlank(message = "Doctor name cannot be blank")
    @Size(max = 100, message = "Doctor name cannot exceed 100 characters")
    private String doctorName;

    @NotBlank(message = "Hospital name cannot be blank")
    @Size(max = 1000, message = "Hospital name cannot exceed 1000 characters")
    private String hospitalName;

    public DiagnosisRequestDTO(String primarySymptomId, String secondarySymptomId, String selectedImagingCombinationId, String selectedImagingTypeId, String reason, String comment, String doctorName, String hospitalName) {
        this.primarySymptomId = primarySymptomId;
        this.secondarySymptomId = secondarySymptomId;
        this.selectedImagingCombinationId = selectedImagingCombinationId;
        this.selectedImagingTypeId = selectedImagingTypeId;
        this.reason = reason;
        this.comment = comment;
        this.doctorName = doctorName;
        this.hospitalName = hospitalName;
    }

    public DiagnosisRequestDTO() {
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

    public String getSelectedImagingTypeId() {
        return selectedImagingTypeId;
    }

    public void setSelectedImagingTypeId(String selectedImagingTypeId) {
        this.selectedImagingTypeId = selectedImagingTypeId;
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