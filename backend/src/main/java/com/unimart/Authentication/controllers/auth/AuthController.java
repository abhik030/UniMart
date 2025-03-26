package com.unimart.Authentication.controllers.auth;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.unimart.Authentication.dtos.auth.EmailRequest;
import com.unimart.Authentication.dtos.auth.ProfileSetupRequest;
import com.unimart.Authentication.dtos.auth.ProfileSetupResponse;
import com.unimart.Authentication.dtos.auth.SchoolRedirectDTO;
import com.unimart.Authentication.dtos.auth.SupportedUniversityDTO;
import com.unimart.Authentication.dtos.auth.UserResponseDTO;
import com.unimart.Authentication.dtos.auth.VerifyRequest;
import com.unimart.Authentication.exceptions.InvalidEmailException;
import com.unimart.Authentication.exceptions.InvalidVerificationCodeException;
import com.unimart.Authentication.exceptions.SchoolNotFoundException;
import com.unimart.Authentication.models.User;
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
        boolean rememberMe = request.getRememberMe() != null ? request.getRememberMe() : false;
        
        log.info("Code verification request received for email: {}. Remember me: {}", email, rememberMe);
        
        try {
            UserResponseDTO user = authService.verifyCode(email, code, rememberMe);
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
    
    /**
     * Endpoint to set up user profile
     */
    @PostMapping(value = "/profile-setup", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> setupProfile(
            @RequestParam("email") String email,
            @RequestParam("firstName") String firstName,
            @RequestParam("lastName") String lastName,
            @RequestParam(value = "phoneNumber", required = false) String phoneNumber,
            @RequestParam(value = "description", required = false) String description,
            @RequestPart(value = "profilePicture", required = false) MultipartFile profilePicture) {
        
        log.info("Profile setup request received for email: {}", email);
        
        try {
            ProfileSetupRequest request = new ProfileSetupRequest();
            request.setEmail(email);
            request.setFirstName(firstName);
            request.setLastName(lastName);
            request.setPhoneNumber(phoneNumber);
            request.setDescription(description);
            
            ProfileSetupResponse response = authService.setupProfile(request, profilePicture);
            log.info("Profile setup successful for: {}", email);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error setting up profile for email: {}", email, e);
            return ResponseEntity.internalServerError().body("An error occurred while setting up your profile: " + e.getMessage());
        }
    }

    /**
     * Endpoint to verify a trusted device token
     */
    @PostMapping("/verify-trusted-token")
    public ResponseEntity<?> verifyTrustedToken(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String token = request.get("token");
        
        log.info("Trusted token verification request received for email: {}", email);
        
        try {
            boolean isValid = authService.verifyTrustedDeviceToken(email, token);
            
            if (isValid) {
                log.info("Trusted token verification successful for: {}", email);
                // If token is valid, fetch the user and return user info
                User user = authService.getUserByEmail(email);
                UserResponseDTO userResponse = new UserResponseDTO(email, user.getUsername(), user.getUniversity().getName());
                userResponse.setToken(authService.generateToken(user));
                
                // Check if the university is directly supported
                boolean isSchoolSupported = "northeastern.edu".equals(user.getUniversity().getDomain());
                String redirectUrl = isSchoolSupported ? "/huskymart" : "/unsupported";
                userResponse.setRedirectUrl(redirectUrl);
                
                return ResponseEntity.ok(userResponse);
            } else {
                log.warn("Invalid trusted token for email: {}", email);
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
            }
        } catch (Exception e) {
            log.error("Error verifying trusted token for email: {}", email, e);
            return ResponseEntity.internalServerError().body("An error occurred while processing your request.");
        }
    }

    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        boolean dbStatus = authService.databaseHealthCheck();
        Map<String, String> status = Map.of("status", dbStatus ? "UP" : "DOWN");
        return ResponseEntity.ok(status);
    }
}
