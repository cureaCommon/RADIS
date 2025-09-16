package com.radiology.diagnosis.mapper;

import com.radiology.diagnosis.dto.imagingType.ImagingTypeDTO;
import com.radiology.diagnosis.model.ImagingType;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ImagingTypeMapper {

    @Mapping(source = "id", target = "id")
    @Mapping(source = "code", target = "code")
    @Mapping(source = "name", target = "name")
    ImagingTypeDTO toDTO(ImagingType entity);
}
