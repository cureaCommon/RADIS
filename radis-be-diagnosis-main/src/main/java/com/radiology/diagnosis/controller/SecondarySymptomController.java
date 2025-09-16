package com.radiology.diagnosis.controller;

import com.radiology.diagnosis.constant.Constant;
import com.radiology.diagnosis.dto.secondary.SecondarySymptomDTO;
import com.radiology.diagnosis.dto.secondary.SecondarySymptomDetailDTO;
import com.radiology.diagnosis.dto.secondary.SecondarySymptomSummaryDTO;
import com.radiology.diagnosis.service.impl.SecondarySymptomService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(Constant.SECONDARY_SYMPTOM_URL)
public class SecondarySymptomController {

    private final SecondarySymptomService secondarySymptomService;

    public SecondarySymptomController(SecondarySymptomService secondarySymptomService) {
        this.secondarySymptomService = secondarySymptomService;
    }

    @GetMapping
    public ResponseEntity<Page<SecondarySymptomSummaryDTO>> getAllSymptoms(@PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(secondarySymptomService.getAllSymptomsSummary(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SecondarySymptomDTO> getSymptom(@PathVariable String id) {
        return ResponseEntity.ok(secondarySymptomService.getSymptomById(id));
    }

    @GetMapping("/{id}/detail")
    public ResponseEntity<SecondarySymptomDetailDTO> getSymptomDetail(@PathVariable String id) {
        return ResponseEntity.ok(secondarySymptomService.getSymptomDetail(id));
    }
}
