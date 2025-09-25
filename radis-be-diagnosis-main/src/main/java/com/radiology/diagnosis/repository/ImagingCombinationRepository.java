package com.radiology.diagnosis.repository;

import com.radiology.diagnosis.model.ImagingCombination;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ImagingCombinationRepository extends JpaRepository<ImagingCombination, String> {

    List<ImagingCombination> findAllByIdIn(List<String> ids);
}