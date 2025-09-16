package com.radiology.diagnosis.service.impl;

import com.radiology.diagnosis.constant.Constant;
import com.radiology.diagnosis.dto.imagingType.ImagingTypeDTO;
import com.radiology.diagnosis.mapper.ImagingTypeMapper;
import com.radiology.diagnosis.repository.ImagingTypeRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class ImagingTypeService {

    private final ImagingTypeRepository imagingTypeRepository;
    private final ImagingTypeMapper mapper;

    public ImagingTypeService(ImagingTypeRepository imagingTypeRepository, ImagingTypeMapper mapper) {
        this.imagingTypeRepository = imagingTypeRepository;
        this.mapper = mapper;
    }

    public ImagingTypeDTO getImagingTypeById(String id) {
        return imagingTypeRepository.findById(id)
                .map(mapper::toDTO)
                .orElseThrow(() -> new EntityNotFoundException(Constant.IMAGING_TYPE_NOT_FOUND));
    }

    public Page<ImagingTypeDTO> getAllImagingTypes(Pageable pageable) {
        return imagingTypeRepository.findAll(pageable)
                .map(mapper::toDTO);
    }
}
