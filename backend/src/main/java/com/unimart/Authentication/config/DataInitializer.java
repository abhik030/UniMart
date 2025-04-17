package com.unimart.Authentication.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.unimart.Authentication.models.University;
import com.unimart.Authentication.models.User;
import com.unimart.Authentication.models.UserProfile;
import com.unimart.Authentication.repositories.UniversityRepository;
import com.unimart.Authentication.repositories.UserProfileRepository;
import com.unimart.Authentication.repositories.UserRepository;

import lombok.extern.slf4j.Slf4j;

import java.util.Optional;

@Component
@Slf4j
public class DataInitializer {

    @Autowired
    private UniversityRepository universityRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private UserProfileRepository userProfileRepository;
    
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    
    @Transactional
    public void initializeData() {
        log.info("Starting data initialization...");
        
        // Initialize default universities if not present
        initializeUniversities();
        
        // Create developer account
        createDeveloperAccount();
    }
    
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
    
    @Transactional
    private void createDeveloperAccount() {
        String developerEmail = "studentunimart@gmail.com";
        Optional<User> existingUser = userRepository.findByEmail(developerEmail);

        if (existingUser.isEmpty()) {
            try {
                University northeasternUniversity = universityRepository.findByDomain("northeastern.edu")
                        .orElseThrow(() -> new RuntimeException("Northeastern University not found"));

                // Create and save the User first
                User developer = new User(
                    developerEmail,
                    "unimart_developer",
                    passwordEncoder.encode("developer123"),
                    "DEVELOPER",
                    northeasternUniversity
                );
                developer.setVerified(true);
                developer = userRepository.save(developer);
                log.info("Developer user account created successfully");

                // Create and save the UserProfile
                UserProfile developerProfile = new UserProfile();
                developerProfile.setUserEmail(developerEmail); // Set ID explicitly
                developerProfile.setUser(developer);
                developerProfile.setFirstName("UniMart");
                developerProfile.setLastName("Developer");
                developerProfile.setPhoneNumber("1234567890");
                developerProfile.setBio("UniMart Developer Account");
                
                developerProfile = userProfileRepository.save(developerProfile);
                log.info("Developer profile created successfully");
            } catch (Exception e) {
                log.error("Error creating developer account: " + e.getMessage());
                e.printStackTrace();
            }
        } else {
            log.info("Developer account already exists");
        }
    }
} 