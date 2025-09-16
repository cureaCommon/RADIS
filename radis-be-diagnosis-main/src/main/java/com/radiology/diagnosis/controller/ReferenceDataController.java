package com.radiology.diagnosis.controller;

import com.radiology.diagnosis.service.impl.ReferenceDataService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
public class ReferenceDataController {

    private final ReferenceDataService referenceDataService;

    public ReferenceDataController(ReferenceDataService referenceDataService) {
        this.referenceDataService = referenceDataService;
    }

    @PostMapping("/createReferenceData")
    public ResponseEntity<String> uploadXlsxFile(@RequestParam("file") MultipartFile file) throws IOException {

        if (file.isEmpty() || !file.getOriginalFilename().endsWith(".xlsx")) {
            return ResponseEntity.badRequest().body("Please upload a valid .xlsx file");
        }

        referenceDataService.create(file);
        return ResponseEntity.ok("File processed successfully");
    }
}
