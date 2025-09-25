package com.radiology.diagnosis.controller;

import com.radiology.diagnosis.constant.Constant;
import com.radiology.diagnosis.dto.imagingCombination.ImagingCombinationDTO;
import com.radiology.diagnosis.dto.imagingCombination.ImagingCombinationDetailDTO;
import com.radiology.diagnosis.dto.imagingCombination.ImagingCombinationSummaryDTO;
import com.radiology.diagnosis.service.impl.ImagingCombinationService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(Constant.IMAGING_COMBINATION_URL)
public class ImagingCombinationController {

    private final ImagingCombinationService imagingCombinationService;

    public ImagingCombinationController(ImagingCombinationService imagingCombinationService) {
        this.imagingCombinationService = imagingCombinationService;
    }

    @GetMapping
    public ResponseEntity<Page<ImagingCombinationSummaryDTO>> getAllSymptoms(@PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(imagingCombinationService.getAllImagingCombinationsSummary(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ImagingCombinationDTO> getSymptom(@PathVariable String id) {
        return ResponseEntity.ok(imagingCombinationService.getImagingCombinationById(id));
    }

    @GetMapping("/{id}/detail")
    public ResponseEntity<ImagingCombinationDetailDTO> getSymptomDetail(@PathVariable String id) {
        return ResponseEntity.ok(imagingCombinationService.getImagingCombinationDetail(id));
    }

    @GetMapping("/by-ids")
    public ResponseEntity<List<ImagingCombinationDetailDTO>> getSymptomDetailByIdsGet(@RequestParam List<String> ids) {
        return ResponseEntity.ok(imagingCombinationService.getImagingCombinationsByIds(ids));
    }

    @PostMapping("/by-ids")
    public ResponseEntity<List<ImagingCombinationDetailDTO>> getSymptomDetailByIdsPost(@RequestBody List<String> ids) {
        return ResponseEntity.ok(imagingCombinationService.getImagingCombinationsByIds(ids));
    }
}
