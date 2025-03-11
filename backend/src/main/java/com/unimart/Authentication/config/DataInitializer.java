package com.unimart.Authentication.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.unimart.Authentication.models.University;
import com.unimart.Authentication.repositories.UniversityRepository;

import lombok.extern.slf4j.Slf4j;

@Configuration
@Slf4j
public class DataInitializer {
    @Autowired
    private UniversityRepository universityRepository;
    
    @Bean
    public CommandLineRunner initData() {
        return args -> {
            // Add Northeastern University if it doesn't exist
            if (!universityRepository.existsByDomain("northeastern.edu")) {
                University northeastern = new University("Northeastern University", "northeastern.edu");
                universityRepository.save(northeastern);
                log.info("Added Northeastern University to the database");
            }
            
            // You can add more universities here as needed
            // Example:
            // if (!universityRepository.existsByDomain("harvard.edu")) {
            //     University harvard = new University("Harvard University", "harvard.edu");
            //     universityRepository.save(harvard);
            //     log.info("Added Harvard University to the database");
            // }
        };
    }
} 