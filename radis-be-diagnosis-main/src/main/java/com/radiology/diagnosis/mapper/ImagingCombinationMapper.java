package com.radiology.diagnosis.mapper;

import com.radiology.diagnosis.dto.imagingCombination.ImagingCombinationDTO;
import com.radiology.diagnosis.dto.imagingCombination.ImagingCombinationDetailDTO;
import com.radiology.diagnosis.dto.imagingCombination.ImagingCombinationSummaryDTO;
import com.radiology.diagnosis.model.ImagingCombination;
import com.radiology.diagnosis.model.ImagingType;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;

import java.util.Set;

@Mapper(componentModel = "spring")
public interface ImagingCombinationMapper {

    ImagingCombinationMapper INSTANCE = Mappers.getMapper(ImagingCombinationMapper.class);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "rating", target = "rating")
    @Mapping(source = "adultRRL", target = "adultRRL")
    @Mapping(source = "shortJustification", target = "shortJustification")
    @Mapping(source = "literatureSummary", target = "literatureSummary")
    ImagingCombinationDTO toDTO(ImagingCombination entity);

    @Mapping(source = "imagingTypes", target = "imagingTypeCount", qualifiedByName = "countImagingTypes")
    ImagingCombinationSummaryDTO toSummaryDTO(ImagingCombination entity);

    @Mapping(source = "imagingTypes", target = "imagingTypes")
    ImagingCombinationDetailDTO toDetailDTO(ImagingCombination entity);

    @Named("countImagingTypes")
    static int countImagingTypes(Set<ImagingType> imagingTypes) {
        return imagingTypes != null ? imagingTypes.size() : 0;
    }
}
