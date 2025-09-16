package com.radiology.diagnosis.mapper;

import com.radiology.diagnosis.dto.primary.PrimarySymptomDTO;
import com.radiology.diagnosis.dto.primary.PrimarySymptomDetailDTO;
import com.radiology.diagnosis.dto.primary.PrimarySymptomSummaryDTO;
import com.radiology.diagnosis.model.PrimarySymptom;
import com.radiology.diagnosis.model.SecondarySymptom;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring", uses = {SecondarySymptomMapper.class})
public interface PrimarySymptomMapper {

    PrimarySymptomMapper INSTANCE = Mappers.getMapper(PrimarySymptomMapper.class);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "name", target = "name")
    PrimarySymptomDTO toDTO(PrimarySymptom entity);

    @Mapping(source = "secondarySymptoms", target = "secondarySymptomCount", qualifiedByName = "countSecondarySymptoms")
    PrimarySymptomSummaryDTO toSummaryDTO(PrimarySymptom entity);

    @Mapping(source = "secondarySymptoms", target = "secondarySymptoms")
    PrimarySymptomDetailDTO toDetailDTO(PrimarySymptom entity);

    @Named("countSecondarySymptoms")
    static int countSecondarySymptoms(List<SecondarySymptom> symptoms) {
        return symptoms != null ? symptoms.size() : 0;
    }
}
