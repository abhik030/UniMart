package com.unimart.Authentication.controllers.auth;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.unimart.Authentication.dtos.auth.EmailRequest;
import com.unimart.Authentication.dtos.auth.SchoolRedirectDTO;
import com.unimart.Authentication.dtos.auth.SupportedUniversityDTO;
import com.unimart.Authentication.dtos.auth.UserResponseDTO;
import com.unimart.Authentication.dtos.auth.VerifyRequest;
import com.unimart.Authentication.exceptions.InvalidEmailException;
import com.unimart.Authentication.exceptions.InvalidVerificationCodeException;
import com.unimart.Authentication.exceptions.SchoolNotFoundException;
import com.unimart.Authentication.services.AuthService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {
    @Autowired
    private AuthService authService;

    /**
     * Endpoint to validate email and send verification code
     */
    @PostMapping("/validate-email")
    public ResponseEntity<?> validateEmail(@RequestBody EmailRequest request) {
        String email = request.getEmail();
        log.info("Email validation request received for: {}", email);
        
        try {
            SchoolRedirectDTO schoolInfo = authService.validateEmail(email);
            log.info("Email validation successful for: {}. University: {}", email, schoolInfo.getUniversityName());
            return ResponseEntity.ok(schoolInfo);
        } catch (InvalidEmailException e) {
            log.warn("Invalid email attempt: {}", email);
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (SchoolNotFoundException e) {
            log.info("School not supported: {}", email);
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            log.error("Error validating email: {}", email, e);
            return ResponseEntity.internalServerError().body("An error occurred while processing your request.");
        }
    }

    /**
     * Endpoint to verify the code and complete authentication
     */
    @PostMapping("/verify-code")
    public ResponseEntity<?> verifyCode(@RequestBody VerifyRequest request) {
        String email = request.getEmail();
        String code = request.getCode();
        log.info("Code verification request received for email: {}", email);
        
        try {
            UserResponseDTO user = authService.verifyCode(email, code);
            log.info("Code verification successful for: {}. Username: {}", email, user.getUsername());
            return ResponseEntity.ok(user);
        } catch (InvalidVerificationCodeException e) {
            log.warn("Invalid verification code for email: {}", email);
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            log.error("Error verifying code for email: {}", email, e);
            return ResponseEntity.internalServerError().body("An error occurred while processing your request.");
        }
    }
    
    /**
     * Endpoint to get all supported universities
     */
    @GetMapping("/supported-universities")
    public ResponseEntity<List<SupportedUniversityDTO>> getSupportedUniversities() {
        List<SupportedUniversityDTO> universities = authService.getAllSupportedUniversities();
        return ResponseEntity.ok(universities);
    }
}
