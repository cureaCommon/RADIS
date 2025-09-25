package com.radiology.diagnosis.mapper;

import com.radiology.diagnosis.dto.secondary.SecondarySymptomDTO;
import com.radiology.diagnosis.dto.secondary.SecondarySymptomDetailDTO;
import com.radiology.diagnosis.dto.secondary.SecondarySymptomSummaryDTO;
import com.radiology.diagnosis.model.ImagingCombination;
import com.radiology.diagnosis.model.SecondarySymptom;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring", uses = {ImagingCombinationMapper.class})
public interface SecondarySymptomMapper {

    SecondarySymptomMapper INSTANCE = Mappers.getMapper(SecondarySymptomMapper.class);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "name", target = "name")
    SecondarySymptomDTO toDTO(SecondarySymptom entity);

    @Mapping(source = "imagingCombinations", target = "imagingCombinationCount", qualifiedByName = "countImagingCombinations")
    SecondarySymptomSummaryDTO toSummaryDTO(SecondarySymptom entity);

    @Mapping(source = "imagingCombinations", target = "imagingCombinations")
    SecondarySymptomDetailDTO toDetailDTO(SecondarySymptom entity);

    @Named("countImagingCombinations")
    static int countTestCombinations(List<ImagingCombination> imagingCombinations) {
        return imagingCombinations != null ? imagingCombinations.size() : 0;
    }

    List<SecondarySymptomDTO> toDTOList(List<SecondarySymptom> entities);
    List<SecondarySymptomSummaryDTO> toSummaryDTOList(List<SecondarySymptom> entities);
    List<SecondarySymptomDetailDTO> toDetailDTOList(List<SecondarySymptom> entities);
}
