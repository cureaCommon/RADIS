package com.radiology.diagnosis.service.impl;

import com.radiology.diagnosis.constant.Constant;
import com.radiology.diagnosis.dto.primary.PrimarySymptomDTO;
import com.radiology.diagnosis.dto.primary.PrimarySymptomDetailDTO;
import com.radiology.diagnosis.dto.primary.PrimarySymptomSummaryDTO;
import com.radiology.diagnosis.exception.ExceptionUtil;
import com.radiology.diagnosis.mapper.PrimarySymptomMapper;
import com.radiology.diagnosis.repository.PrimarySymptomRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class PrimarySymptomService {

    private final PrimarySymptomRepository primarySymptomRepository;
    private final PrimarySymptomMapper mapper;

    public PrimarySymptomService(PrimarySymptomRepository primarySymptomRepository, PrimarySymptomMapper mapper) {
        this.primarySymptomRepository = primarySymptomRepository;
        this.mapper = mapper;
    }

    public PrimarySymptomDTO getSymptomById(String id) {
        return primarySymptomRepository.findById(id)
                .map(mapper::toDTO)
                .orElseThrow(() ->
                        ExceptionUtil.notFound(Constant.PRIMARY_SYMPTOM_NOT_FOUND, id));
    }

    public Page<PrimarySymptomSummaryDTO> getAllSymptomsSummary(Pageable pageable) {
        return primarySymptomRepository.findAll(pageable)
                .map(mapper::toSummaryDTO);
    }

    public PrimarySymptomDetailDTO getSymptomDetail(String id) {
        return primarySymptomRepository.findById(id)
                .map(mapper::toDetailDTO)
                .orElseThrow(() -> new EntityNotFoundException(Constant.PRIMARY_SYMPTOM_NOT_FOUND));
    }
}
