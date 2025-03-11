package com.unimart.Authentication.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.unimart.Authentication.dtos.auth.SupportedUniversityDTO;
import com.unimart.Authentication.services.AuthService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/unsupported")
@RequiredArgsConstructor
@Slf4j
public class UnsupportedUniversityController {
    
    @Autowired
    private AuthService authService;
    
    /**
     * Endpoint to handle unsupported universities
     */
    @GetMapping
    public ResponseEntity<?> handleUnsupportedUniversity(@RequestParam(required = false) String email) {
        List<SupportedUniversityDTO> supportedUniversities = authService.getAllSupportedUniversities();
        
        // Create a response object with a message and the list of supported universities
        UnsupportedResponse response = new UnsupportedResponse(
            "Sorry, UniMart hasn't gotten around to supporting a university marketplace for your college yet. " +
            "You can select from one of our supported universities below.",
            supportedUniversities
        );
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Response class for unsupported universities
     */
    private static class UnsupportedResponse {
        private final String message;
        private final List<SupportedUniversityDTO> supportedUniversities;
        
        public UnsupportedResponse(String message, List<SupportedUniversityDTO> supportedUniversities) {
            this.message = message;
            this.supportedUniversities = supportedUniversities;
        }
        
        @SuppressWarnings("unused")
        public String getMessage() {
            return message;
        }
        
        @SuppressWarnings("unused")
        public List<SupportedUniversityDTO> getSupportedUniversities() {
            return supportedUniversities;
        }
    }
} 