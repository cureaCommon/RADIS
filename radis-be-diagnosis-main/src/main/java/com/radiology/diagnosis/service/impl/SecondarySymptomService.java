package com.radiology.diagnosis.service.impl;

import com.radiology.diagnosis.constant.Constant;
import com.radiology.diagnosis.dto.secondary.SecondarySymptomDTO;
import com.radiology.diagnosis.dto.secondary.SecondarySymptomDetailDTO;
import com.radiology.diagnosis.dto.secondary.SecondarySymptomSummaryDTO;
import com.radiology.diagnosis.mapper.SecondarySymptomMapper;
import com.radiology.diagnosis.repository.SecondarySymptomRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class SecondarySymptomService {

    private final SecondarySymptomRepository secondarySymptomRepository;
    private final SecondarySymptomMapper mapper;


    public SecondarySymptomService(SecondarySymptomRepository secondarySymptomRepository, SecondarySymptomMapper mapper) {
        this.secondarySymptomRepository = secondarySymptomRepository;
        this.mapper = mapper;
    }

    public SecondarySymptomDTO getSymptomById(String id) {
        return secondarySymptomRepository.findById(id)
                .map(mapper::toDTO)
                .orElseThrow(() -> new EntityNotFoundException(Constant.SECONDARY_SYMPTOM_NOT_FOUND));
    }

    public Page<SecondarySymptomSummaryDTO> getAllSymptomsSummary(Pageable pageable) {
        return secondarySymptomRepository.findAll(pageable)
                .map(mapper::toSummaryDTO);
    }

    public SecondarySymptomDetailDTO getSymptomDetail(String id) {
        return secondarySymptomRepository.findById(id)
                .map(mapper::toDetailDTO)
                .orElseThrow(() -> new EntityNotFoundException(Constant.SECONDARY_SYMPTOM_NOT_FOUND));
    }
}
