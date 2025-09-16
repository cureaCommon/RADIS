package com.radiology.diagnosis.controller;

import com.radiology.diagnosis.constant.Constant;
import com.radiology.diagnosis.dto.diagnosis.DiagnosisRequestDTO;
import com.radiology.diagnosis.dto.diagnosis.DiagnosisResponseDTO;
import com.radiology.diagnosis.service.impl.DiagnosisService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(Constant.DIAGNOSIS_URL)
public class DiagnosisController {

    private final DiagnosisService diagnosisService;

    public DiagnosisController(DiagnosisService diagnosisService) {
        this.diagnosisService = diagnosisService;
    }

    @PostMapping
    public ResponseEntity<DiagnosisResponseDTO> save(@Valid @RequestBody DiagnosisRequestDTO requestDTO) {

        DiagnosisResponseDTO response = diagnosisService.save(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
