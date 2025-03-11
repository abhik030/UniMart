package com.unimart.Authentication.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.unimart.Authentication.models.University;

@Repository
public interface UniversityRepository extends JpaRepository<University, Long> {
    Optional<University> findByDomain(String domain);
    boolean existsByDomain(String domain);
    Optional<University> findByName(String name);
} 