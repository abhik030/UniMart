package com.unimart.Authentication.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.unimart.Authentication.dtos.auth.SchoolRedirectDTO;
import com.unimart.Authentication.dtos.auth.UserResponseDTO;
import com.unimart.Authentication.dtos.auth.SupportedUniversityDTO;
import com.unimart.Authentication.exceptions.InvalidEmailException;
import com.unimart.Authentication.exceptions.InvalidVerificationCodeException;
import com.unimart.Authentication.exceptions.SchoolNotFoundException;
import com.unimart.Authentication.models.University;
import com.unimart.Authentication.models.User;
import com.unimart.Authentication.models.VerificationCode;
import com.unimart.Authentication.repositories.UniversityRepository;
import com.unimart.Authentication.repositories.UserRepository;
import com.unimart.Authentication.repositories.VerificationCodeRepository;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class AuthService {
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private UniversityRepository universityRepository;
    
    @Autowired
    private EmailService emailService;
    
    @Autowired
    private VerificationCodeRepository verificationCodeRepository;

    /**
     * Validates if the email is a valid school email and sends an authentication code
     */
    @Transactional
    public SchoolRedirectDTO validateEmail(String email) {
        // Check if email is a valid .edu email
        if (!email.endsWith(".edu")) {
            throw new InvalidEmailException("Only .edu email addresses are allowed.");
        }
        
        // Extract domain from email (e.g., northeastern.edu from user@northeastern.edu)
        String domain = email.substring(email.indexOf('@') + 1);
        
        // Check if the university is supported
        University university = universityRepository.findByDomain(domain)
                .orElseThrow(() -> new SchoolNotFoundException("Your school is not yet supported by UniMart."));
        
        // Generate and send verification code
        String code = generateCode();
        LocalDateTime expirationTime = LocalDateTime.now().plusMinutes(10);
        
        // Delete any existing verification codes for this email
        verificationCodeRepository.findByEmail(email)
                .ifPresent(verificationCodeRepository::delete);
        
        // Save new verification code
        verificationCodeRepository.save(new VerificationCode(email, code, expirationTime));
        
        // Send email with verification code
        String emailBody = String.format(
            "Welcome to UniMart!\n\n" +
            "Your verification code is: %s\n\n" +
            "This code will expire in 10 minutes.\n\n" +
            "Thank you for joining the %s's UniMart community!",
            code, university.getName()
        );
        
        emailService.sendEmail(email, "UniMart Verification Code", emailBody);
        
        // Return university information for the frontend
        String marketplaceUrl = generateRedirectUrl(university);
        String marketplaceName = getMarketplaceName(university);
        
        SchoolRedirectDTO dto = new SchoolRedirectDTO(university.getName(), marketplaceUrl);
        dto.setMarketplaceName(marketplaceName);
        return dto;
    }

    /**
     * Verifies the code sent to the user's email and creates/updates the user account
     */
    @Transactional
    public UserResponseDTO verifyCode(String email, String code) {
        // Find the verification code
        VerificationCode storedCode = verificationCodeRepository.findByEmail(email)
                .orElseThrow(() -> new InvalidVerificationCodeException("No verification code found for this email."));
        
        // Check if code is valid and not expired
        if (!storedCode.getCode().equals(code)) {
            throw new InvalidVerificationCodeException("Invalid verification code.");
        }
        
        if (storedCode.isUsed()) {
            throw new InvalidVerificationCodeException("This verification code has already been used.");
        }
        
        if (storedCode.getExpirationTime().isBefore(LocalDateTime.now())) {
            throw new InvalidVerificationCodeException("Verification code has expired.");
        }
        
        // Extract domain and find university
        String domain = email.substring(email.indexOf('@') + 1);
        University university = universityRepository.findByDomain(domain)
                .orElseThrow(() -> new SchoolNotFoundException("School not found."));
        
        // Create or update user
        User user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    String username = generateUsername(email);
                    // Ensure username is unique
                    while (userRepository.existsByUsername(username)) {
                        username = generateUsername(email) + new Random().nextInt(1000);
                    }
                    return new User(email, username, university);
                });
        
        // Mark user as verified
        user.setVerified(true);
        user = userRepository.save(user);
        
        // Mark verification code as used
        storedCode.setUsed(true);
        verificationCodeRepository.save(storedCode);
        
        // Generate the redirect URL based on the university
        String redirectUrl = generateRedirectUrl(university);
        
        // Return user information with redirect URL
        UserResponseDTO dto = new UserResponseDTO(email, user.getUsername(), university.getName());
        dto.setRedirectUrl(redirectUrl);
        return dto;
    }
    
    /**
     * Generates a random 6-digit verification code
     */
    private String generateCode() {
        return String.format("%06d", new Random().nextInt(1000000));
    }
    
    /**
     * Generates a username from the email address
     */
    private String generateUsername(String email) {
        // Extract the part before @ and remove any non-alphanumeric characters
        String username = email.split("@")[0].replaceAll("[^a-zA-Z0-9]", "");
        
        // If username is too short, add a random suffix
        if (username.length() < 5) {
            username += String.format("%04d", new Random().nextInt(10000));
        }
        
        return username;
    }
    
    /**
     * Generates a redirect URL for the university's marketplace
     */
    private String generateRedirectUrl(University university) {
        // For Northeastern, use HuskyMart
        if ("northeastern.edu".equals(university.getDomain())) {
            return "/huskymart";
        }
        
        // For other universities, use a standardized format
        String universitySlug = university.getDomain().replace(".", "-");
        return "/" + universitySlug;
    }
    
    /**
     * Cleanup expired verification codes
     */
    @Transactional
    public void cleanupExpiredCodes() {
        verificationCodeRepository.deleteByExpirationTimeBefore(LocalDateTime.now());
        log.info("Cleaned up expired verification codes");
    }

    /**
     * Get all supported universities
     */
    public List<SupportedUniversityDTO> getAllSupportedUniversities() {
        List<University> universities = universityRepository.findAll();
        
        return universities.stream()
                .map(university -> {
                    String marketplaceUrl = generateRedirectUrl(university);
                    String marketplaceName = getMarketplaceName(university);
                    
                    SupportedUniversityDTO dto = new SupportedUniversityDTO();
                    dto.setId(university.getId());
                    dto.setName(university.getName());
                    dto.setDomain(university.getDomain());
                    dto.setMarketplaceUrl(marketplaceUrl);
                    dto.setMarketplaceName(marketplaceName);
                    return dto;
                })
                .collect(Collectors.toList());
    }
    
    /**
     * Get the marketplace name for a university
     */
    private String getMarketplaceName(University university) {
        // For Northeastern, use HuskyMart
        if ("northeastern.edu".equals(university.getDomain())) {
            return "HuskyMart";
        }
        
        // For other universities, use a standardized format
        return university.getName() + " Marketplace";
    }
}
