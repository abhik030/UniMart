package com.unimart.Authentication.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.unimart.Authentication.models.University;
import com.unimart.Authentication.models.User;
import com.unimart.Authentication.models.UserProfile;
import com.unimart.Authentication.repositories.UniversityRepository;
import com.unimart.Authentication.repositories.UserProfileRepository;
import com.unimart.Authentication.repositories.UserRepository;

import lombok.extern.slf4j.Slf4j;

import java.time.LocalDateTime;

@Component
@Slf4j
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UniversityRepository universityRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private UserProfileRepository userProfileRepository;
    
    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // Temporarily disabling all initialization to fix startup issues
        log.info("Data initialization disabled to avoid UserProfile errors");
        
        // Initialize default universities if not present
        // initializeUniversities();
        
        // Create developer account
        // createDeveloperAccount();
    }
    
    @SuppressWarnings("unused")
    private void initializeUniversities() {
        // Add Northeastern University if not present
        if (!universityRepository.existsByDomain("northeastern.edu")) {
            University neu = new University();
            neu.setName("Northeastern University");
            neu.setDomain("northeastern.edu");
            neu = universityRepository.save(neu);
            log.info("Created Northeastern University entry");
        }
        
        // Add more universities as needed
    }
    
    @SuppressWarnings("unused")
    private void createDeveloperAccount() {
        String developerEmail = "studentunimart@gmail.com";
        
        // Check if developer account already exists
        if (!userRepository.existsByEmail(developerEmail)) {
            // Get northeastern university
            University neu = universityRepository.findByDomain("northeastern.edu")
                    .orElseThrow(() -> new RuntimeException("Northeastern University not found"));
            
            // Create developer user
            User developerUser = new User();
            developerUser.setEmail(developerEmail);
            developerUser.setUsername("unimart_developer");
            developerUser.setUniversity(neu);
            developerUser.setVerified(true);
            developerUser.setBanned(false);
            developerUser.setCreatedAt(LocalDateTime.now());
            developerUser.setTrustedDeviceToken("developer-token-" + System.currentTimeMillis());
            developerUser = userRepository.save(developerUser);
            
            // Refresh the user entity to ensure it's properly attached to the persistence context
            developerUser = userRepository.findById(developerEmail)
                .orElseThrow(() -> new RuntimeException("Failed to retrieve saved developer user"));
            
            // Create developer profile using the constructor that correctly sets up the MapsId relationship
            UserProfile profile = new UserProfile(
                developerUser,
                "UniMart",
                "Developer",
                "555-123-4567",
                "UniMart developer account for testing purposes."
            );
            profile.setProfileImageUrl("https://unimart.com/profile-pictures/developer-avatar.png");
            userProfileRepository.save(profile);
            
            log.info("Created developer account: {}", developerEmail);
        } else {
            log.info("Developer account already exists: {}", developerEmail);
        }
    }
} 