package com.radiology.diagnosis.service.search;

import com.radiology.diagnosis.dto.secondary.SecondarySymptomDTO;
import com.radiology.diagnosis.model.SecondarySymptom;
import com.radiology.diagnosis.repository.SecondarySymptomRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.stream.Collectors;

@Service
public class SecondarySymptomSearchService {

    private final SecondarySymptomRepository secondarySymptomRepository;

    public SecondarySymptomSearchService(SecondarySymptomRepository secondarySymptomRepository) {
        this.secondarySymptomRepository = secondarySymptomRepository;
    }

    public Page<SecondarySymptomDTO> searchSymptoms(String query, SecondarySymptomSearchService.SearchType searchType, Pageable pageable) {
        Page<SecondarySymptom> results;

        switch (searchType) {
            case FULL_TEXT:
                results = secondarySymptomRepository.fullTextSearch(prepareQuery(query), pageable);
                break;
            case PREFIX:
                results = secondarySymptomRepository.searchByPrefix(query, pageable);
                break;
            case STANDARD:
            default:
                results = secondarySymptomRepository.searchByName(query, pageable);
        }

        return results.map(this::convertToDTO);
    }

    private SecondarySymptomDTO convertToDTO(SecondarySymptom symptom) {
        return new SecondarySymptomDTO(symptom.getId(), symptom.getName());
    }

    private String prepareQuery(String input) {
        return Arrays.stream(input.split("\\s+")).filter(word -> word.length() > 2).collect(Collectors.joining(" & "));
    }

    public enum SearchType {
        STANDARD, FULL_TEXT, PREFIX
    }
}
