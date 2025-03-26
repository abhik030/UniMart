package com.unimart.Authentication.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.unimart.Authentication.models.UserProfile;

@Repository
public interface UserProfileRepository extends JpaRepository<UserProfile, String> {
    Optional<UserProfile> findByUserEmail(String email);
    boolean existsByUserEmail(String email);
} 