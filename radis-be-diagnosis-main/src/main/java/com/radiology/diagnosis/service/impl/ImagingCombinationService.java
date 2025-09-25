package com.radiology.diagnosis.service.impl;

import com.radiology.diagnosis.constant.Constant;
import com.radiology.diagnosis.dto.imagingCombination.ImagingCombinationDTO;
import com.radiology.diagnosis.dto.imagingCombination.ImagingCombinationDetailDTO;
import com.radiology.diagnosis.dto.imagingCombination.ImagingCombinationSummaryDTO;
import com.radiology.diagnosis.mapper.ImagingCombinationMapper;
import com.radiology.diagnosis.repository.ImagingCombinationRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ImagingCombinationService {

    private final ImagingCombinationRepository imagingCombinationRepository;
    private final ImagingCombinationMapper mapper;

    public ImagingCombinationService(ImagingCombinationRepository imagingCombinationRepository, ImagingCombinationMapper mapper) {
        this.imagingCombinationRepository = imagingCombinationRepository;
        this.mapper = mapper;
    }

    public ImagingCombinationDTO getImagingCombinationById(String id) {
        return imagingCombinationRepository.findById(id)
                .map(mapper::toDTO)
                .orElseThrow(() -> new EntityNotFoundException(Constant.IMAGING_COMBINATION_NOT_FOUND));
    }

    public Page<ImagingCombinationSummaryDTO> getAllImagingCombinationsSummary(Pageable pageable) {
        return imagingCombinationRepository.findAll(pageable)
                .map(mapper::toSummaryDTO);
    }

    public ImagingCombinationDetailDTO getImagingCombinationDetail(String id) {
        return imagingCombinationRepository.findById(id)
                .map(mapper::toDetailDTO)
                .orElseThrow(() -> new EntityNotFoundException(Constant.IMAGING_COMBINATION_NOT_FOUND));
    }

    public List<ImagingCombinationDetailDTO> getImagingCombinationsByIds(List<String> ids) {
        return imagingCombinationRepository.findAllByIdIn(ids)
                .stream()
                .map(mapper::toDetailDTO)
                .collect(Collectors.toList());
    }
}
