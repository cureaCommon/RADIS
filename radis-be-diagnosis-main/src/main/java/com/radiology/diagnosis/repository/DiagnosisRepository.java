package com.radiology.diagnosis.repository;

import com.radiology.diagnosis.model.Diagnosis;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DiagnosisRepository extends JpaRepository<Diagnosis, String> {
}
