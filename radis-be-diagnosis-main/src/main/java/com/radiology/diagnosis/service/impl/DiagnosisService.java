package com.radiology.diagnosis.service.impl;

import com.radiology.diagnosis.dto.diagnosis.DiagnosisRequestDTO;
import com.radiology.diagnosis.dto.diagnosis.DiagnosisResponseDTO;
import com.radiology.diagnosis.model.*;
import com.radiology.diagnosis.repository.*;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import jakarta.validation.ValidationException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class DiagnosisService {

    private final PrimarySymptomRepository primarySymptomRepository;
    private final SecondarySymptomRepository secondarySymptomRepository;
    private final ImagingCombinationRepository imagingCombinationRepository;
    private final ImagingTypeRepository imagingTypeRepository;
    private final DiagnosisRepository diagnosisRepository;

    public DiagnosisService(PrimarySymptomRepository primarySymptomRepository, SecondarySymptomRepository secondarySymptomRepository, ImagingCombinationRepository imagingCombinationRepository, ImagingTypeRepository imagingTypeRepository, DiagnosisRepository diagnosisRepository) {
        this.primarySymptomRepository = primarySymptomRepository;
        this.secondarySymptomRepository = secondarySymptomRepository;
        this.imagingCombinationRepository = imagingCombinationRepository;
        this.imagingTypeRepository = imagingTypeRepository;
        this.diagnosisRepository = diagnosisRepository;
    }

    @Transactional
    public DiagnosisResponseDTO save(DiagnosisRequestDTO requestDTO) {

        validateDiagnose(requestDTO);

        Optional<PrimarySymptom> primarySymptom = Optional.empty();
        Optional<SecondarySymptom> secondarySymptom = Optional.empty();
        Optional<ImagingCombination> imagingCombination = Optional.empty();
        Optional<ImagingType> imagingType = Optional.empty();

        if (requestDTO.getPrimarySymptomId() != null) {
            primarySymptom = primarySymptomRepository.findById(requestDTO.getPrimarySymptomId());
        }

        if (requestDTO.getSecondarySymptomId() != null) {
            secondarySymptom = secondarySymptomRepository.findById(requestDTO.getSecondarySymptomId());
        }

        if (requestDTO.getSelectedImagingCombinationId() != null) {
            imagingCombination = imagingCombinationRepository.findById(requestDTO.getSelectedImagingCombinationId());
        }

        if (requestDTO.getSelectedImagingTypeId() != null) {
            imagingType = imagingTypeRepository.findById(requestDTO.getSelectedImagingTypeId());
        }

        Diagnosis request = new Diagnosis();
        request.setPrimarySymptomId(primarySymptom.map(PrimarySymptom::getId).orElse(null));
        request.setSecondarySymptomId(secondarySymptom.map(SecondarySymptom::getId).orElse(null));
        request.setSelectedImagingCombinationId(imagingCombination.map(ImagingCombination::getId).orElse(null));
        request.setSelectedImagingType(imagingType.map(ImagingType::getId).orElse(null));
        request.setReason(requestDTO.getReason());
        request.setComment(requestDTO.getComment());
        request.setDoctorName(requestDTO.getDoctorName());
        request.setHospitalName(requestDTO.getHospitalName());

        Diagnosis savedRequest = diagnosisRepository.save(request);

        return new DiagnosisResponseDTO(savedRequest.getId());
    }

    private void validateDiagnose(DiagnosisRequestDTO requestDTO) {
        boolean isSymptomNull = requestDTO.getPrimarySymptomId() == null && requestDTO.getSecondarySymptomId() == null;

        boolean isReasonOrCommentNull = requestDTO.getReason() == null || requestDTO.getComment() == null;

        if (isSymptomNull && isReasonOrCommentNull) {
            throw new ValidationException("Reason or Comment cannot be blank when Primary and Secondary symptom are blank");
        }

        if (requestDTO.getSelectedImagingCombinationId() != null && requestDTO.getSelectedImagingTypeId() != null) {
            throw new ValidationException("Imaging Type and Imaging Combination cannot be selected at the same time");
        }

        if (requestDTO.getPrimarySymptomId() != null && requestDTO.getSecondarySymptomId() == null && isReasonOrCommentNull) {
            throw new ValidationException("Reason or Comment cannot be blank when Primary symptom is present but Secondary symptom or Imaging combination is blank");
        }
    }
}
