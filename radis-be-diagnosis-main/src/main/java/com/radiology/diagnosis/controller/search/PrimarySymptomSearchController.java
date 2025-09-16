package com.radiology.diagnosis.controller.search;

import com.radiology.diagnosis.constant.Constant;
import com.radiology.diagnosis.dto.primary.PrimarySymptomDTO;
import com.radiology.diagnosis.service.search.PrimarySymptomSearchService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(Constant.PRIMARY_SEARCH_SYMPTOM_URL)
public class PrimarySymptomSearchController {

    private final PrimarySymptomSearchService primarySymptomSearchService;

    public PrimarySymptomSearchController(PrimarySymptomSearchService primarySymptomSearchService) {
        this.primarySymptomSearchService = primarySymptomSearchService;
    }

    @GetMapping("/search")
    public ResponseEntity<Page<PrimarySymptomDTO>> searchSymptoms(
            @RequestParam String query,
            @RequestParam(defaultValue = "STANDARD") PrimarySymptomSearchService.SearchType searchType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name,asc") String[] sort) {

        Pageable pageable = PageRequest.of(page, size, parseSort(sort));
        Page<PrimarySymptomDTO> result = primarySymptomSearchService.searchSymptoms(
                query,
                PrimarySymptomSearchService.SearchType.STANDARD,
                pageable
        );

        return ResponseEntity.ok(result);
    }

    @GetMapping("/autocomplete")
    public ResponseEntity<List<PrimarySymptomDTO>> autocomplete(
            @RequestParam String prefix) {

        Pageable pageable = PageRequest.of(0, 10);
        Page<PrimarySymptomDTO> result = primarySymptomSearchService.searchSymptoms(
                prefix,
                PrimarySymptomSearchService.SearchType.PREFIX,
                pageable
        );

        return ResponseEntity.ok(result.getContent());
    }

    private Sort parseSort(String[] sort) {
        if (sort.length >= 2) {
            return Sort.by(Sort.Direction.fromString(sort[1]), sort[0]);
        }
        return Sort.by(Sort.Direction.ASC, "name");
    }
}
