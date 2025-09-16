package com.radiology.diagnosis.repository;

import com.radiology.diagnosis.model.ImagingType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ImagingTypeRepository extends JpaRepository<ImagingType, String> {

    Optional<ImagingType> findByCode(String name);
}