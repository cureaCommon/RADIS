package com.radiology.diagnosis.controller;

import com.radiology.diagnosis.constant.Constant;
import com.radiology.diagnosis.dto.primary.PrimarySymptomDTO;
import com.radiology.diagnosis.dto.primary.PrimarySymptomDetailDTO;
import com.radiology.diagnosis.dto.primary.PrimarySymptomSummaryDTO;
import com.radiology.diagnosis.service.impl.PrimarySymptomService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(Constant.PRIMARY_SYMPTOM_URL)
public class PrimarySymptomController {

    private final PrimarySymptomService primarySymptomService;

    public PrimarySymptomController(PrimarySymptomService primarySymptomService) {
        this.primarySymptomService = primarySymptomService;
    }

    @GetMapping
    public ResponseEntity<Page<PrimarySymptomSummaryDTO>> getAllSymptoms(@PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(primarySymptomService.getAllSymptomsSummary(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PrimarySymptomDTO> getSymptom(@PathVariable String id) {
        return ResponseEntity.ok(primarySymptomService.getSymptomById(id));
    }

    @GetMapping("/{id}/detail")
    public ResponseEntity<PrimarySymptomDetailDTO> getSymptomDetail(@PathVariable String id) {
        return ResponseEntity.ok(primarySymptomService.getSymptomDetail(id));
    }
}
