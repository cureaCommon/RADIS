package com.radiology.diagnosis.service.search;

import com.radiology.diagnosis.dto.primary.PrimarySymptomDTO;
import com.radiology.diagnosis.model.PrimarySymptom;
import com.radiology.diagnosis.repository.PrimarySymptomRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.stream.Collectors;

@Service
public class PrimarySymptomSearchService {

    private final PrimarySymptomRepository primarySymptomRepository;

    public PrimarySymptomSearchService(PrimarySymptomRepository primarySymptomRepository) {
        this.primarySymptomRepository = primarySymptomRepository;
    }

    public Page<PrimarySymptomDTO> searchSymptoms(String query, SearchType searchType, Pageable pageable) {
        Page<PrimarySymptom> results;

        switch(searchType) {
            case FULL_TEXT:
                results = primarySymptomRepository.fullTextSearch(prepareQuery(query), pageable);
                break;
            case PREFIX:
                results = primarySymptomRepository.searchByPrefix(query, pageable);
                break;
            case STANDARD:
            default:
                results = primarySymptomRepository.searchByName(query, pageable);
        }

        return results.map(this::convertToDTO);
    }

    private PrimarySymptomDTO convertToDTO(PrimarySymptom symptom) {
        return new PrimarySymptomDTO(symptom.getId(), symptom.getName());
    }

    private String prepareQuery(String input) {
        return Arrays.stream(input.split("\\s+"))
                .filter(word -> word.length() > 2)
                .collect(Collectors.joining(" & "));
    }

    public enum SearchType {
        STANDARD, FULL_TEXT, PREFIX
    }
}
