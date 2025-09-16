package com.radiology.diagnosis.controller;

import com.radiology.diagnosis.constant.Constant;
import com.radiology.diagnosis.dto.imagingType.ImagingTypeDTO;
import com.radiology.diagnosis.service.impl.ImagingTypeService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(Constant.IMAGING_TYPE_URL)
public class ImagingTypeController {

    private final ImagingTypeService imagingTypeService;

    public ImagingTypeController(ImagingTypeService imagingTypeService) {
        this.imagingTypeService = imagingTypeService;
    }

    @GetMapping
    public ResponseEntity<Page<ImagingTypeDTO>> getAllSymptoms(@PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(imagingTypeService.getAllImagingTypes(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ImagingTypeDTO> getSymptom(@PathVariable String id) {
        return ResponseEntity.ok(imagingTypeService.getImagingTypeById(id));
    }
}
