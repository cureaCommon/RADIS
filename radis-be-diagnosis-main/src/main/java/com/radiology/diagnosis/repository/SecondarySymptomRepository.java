package com.radiology.diagnosis.repository;

import com.radiology.diagnosis.model.SecondarySymptom;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface SecondarySymptomRepository extends JpaRepository<SecondarySymptom, String> {

    Optional<SecondarySymptom> findByName(String name);

    // Basit LIKE araması (büyük/küçük harf duyarsız)
    @Query("SELECT ss FROM SecondarySymptom ss WHERE LOWER(ss.name) LIKE LOWER(concat('%', :query,'%'))")
    Page<SecondarySymptom> searchByName(@Param("query") String query, Pageable pageable);

    // Full-text search (PostgreSQL özelliği)
    @Query(value = "SELECT * FROM SecondarySymptom WHERE name_tsvector @@ to_tsquery('english', :query)",
            nativeQuery = true)
    Page<SecondarySymptom> fullTextSearch(@Param("query") String query, Pageable pageable);

    // Prefix arama (otomatik tamamlama için)
    @Query("SELECT ss FROM SecondarySymptom ss WHERE LOWER(ss.name) LIKE LOWER(concat(:query,'%'))")
    Page<SecondarySymptom> searchByPrefix(@Param("query") String query, Pageable pageable);
}