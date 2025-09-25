package com.radiology.diagnosis.controller.search;

import com.radiology.diagnosis.dto.secondary.SecondarySymptomDTO;
import com.radiology.diagnosis.service.search.SecondarySymptomSearchService;
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

import static com.radiology.diagnosis.constant.Constant.SECONDARY_SEARCH_SYMPTOM_URL;

@RestController
@RequestMapping(SECONDARY_SEARCH_SYMPTOM_URL)
public class SecondarySymptomSearchController {

    private final SecondarySymptomSearchService secondarySymptomSearchService;

    public SecondarySymptomSearchController(SecondarySymptomSearchService secondarySymptomSearchService) {
        this.secondarySymptomSearchService = secondarySymptomSearchService;
    }

    @GetMapping("/search")
    public ResponseEntity<Page<SecondarySymptomDTO>> searchSymptoms(
            @RequestParam String query,
            @RequestParam(defaultValue = "STANDARD") SecondarySymptomSearchService.SearchType searchType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name,asc") String[] sort) {

        Pageable pageable = PageRequest.of(page, size, parseSort(sort));
        Page<SecondarySymptomDTO> result = secondarySymptomSearchService.searchSymptoms(
                query,
                SecondarySymptomSearchService.SearchType.STANDARD,
                pageable
        );

        return ResponseEntity.ok(result);
    }

    @GetMapping("/autocomplete")
    public ResponseEntity<List<SecondarySymptomDTO>> autocomplete(
            @RequestParam String prefix) {

        Pageable pageable = PageRequest.of(0, 10);
        Page<SecondarySymptomDTO> result = secondarySymptomSearchService.searchSymptoms(
                prefix,
                SecondarySymptomSearchService.SearchType.PREFIX,
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
