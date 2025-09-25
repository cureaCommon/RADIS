package com.radiology.diagnosis.repository;

import com.radiology.diagnosis.model.PrimarySymptom;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface PrimarySymptomRepository extends JpaRepository<PrimarySymptom, String> {

    Optional<PrimarySymptom> findByName(String name);

    @Query("SELECT ps FROM PrimarySymptom ps WHERE LOWER(ps.name) LIKE LOWER(concat('%', :query,'%'))")
    Page<PrimarySymptom> searchByName(@Param("query") String query, Pageable pageable);

    @Query("SELECT ps FROM PrimarySymptom ps WHERE LOWER(ps.name) LIKE LOWER(concat(:query,'%'))")
    Page<PrimarySymptom> searchByPrefix(@Param("query") String query, Pageable pageable);

    @Query(value = "SELECT * FROM primary_symptom WHERE name_tsvector @@ to_tsquery('english', :query)", nativeQuery = true)
    Page<PrimarySymptom> fullTextSearch(@Param("query") String query, Pageable pageable);

}