package com.smartrecruit.backend.repository;

import com.smartrecruit.backend.entity.Candidate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CandidateRepository extends JpaRepository<Candidate, UUID> {
    Optional<Candidate> findByEmail(String email);
    
    boolean existsByEmail(String email);
  
    Optional<Candidate> findByPhone(String phone);
    
    List<Candidate> findByFullNameContainingIgnoreCase(String name);
    
    @Query("SELECT DISTINCT c FROM Candidate c JOIN FETCH c.cvList")
    List<Candidate> findAllWithCVs();

    @Query("SELECT c FROM Candidate c LEFT JOIN FETCH c.cvList WHERE c.id = :id")
    Optional<Candidate> findByIdWithCvs(@Param("id") UUID id);

    long count();
}
