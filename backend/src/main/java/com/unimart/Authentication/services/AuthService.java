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
        
        // Try to find the university, but don't throw an exception if not found
        University university = universityRepository.findByDomain(domain)
                .orElseGet(() -> {
                    // If the university isn't in our database, use a default university (Northeastern)
                    // This is a temporary solution to allow any .edu email for testing
                    log.info("School not directly supported: {}. Using default university.", domain);
                    return universityRepository.findByDomain("northeastern.edu")
                            .orElseThrow(() -> new SchoolNotFoundException("Default university not found. System configuration error."));
                });
        
        // Generate and send verification code
        String code = generateCode();
        LocalDateTime expirationTime = LocalDateTime.now().plusMinutes(10);
        
        // Delete any existing verification codes for this email
        verificationCodeRepository.findByEmail(email)
                .ifPresent(verificationCodeRepository::delete);
        
        // Save new verification code
        verificationCodeRepository.save(new VerificationCode(email, code, expirationTime));
        
        // Create a customized email body based on whether this is a directly supported school
        String emailBody;
        if (domain.equals(university.getDomain())) {
            // This is a directly supported school
            emailBody = String.format(
                "Welcome to UniMart!\n\n" +
                "Your verification code is: %s\n\n" +
                "This code will expire in 10 minutes.\n\n" +
                "Thank you for joining the %s's UniMart community!",
                code, university.getName()
            );
        } else {
            // This is not a directly supported school
            emailBody = String.format(
                "Welcome to UniMart!\n\n" +
                "Your verification code is: %s\n\n" +
                "This code will expire in 10 minutes.\n\n" +
                "Thank you for joining the UniMart community! While your school (%s) " +
                "is not yet directly supported, you can still use our platform through the HuskyMart marketplace.",
                code, domain
            );
        }
        
        // Send the email
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
        // Special case for testing - dummy code 123456
        if ("123456".equals(code)) {
            log.info("Using dummy verification code 123456 for email: {}", email);
            // Extract domain
            String domain = email.substring(email.indexOf('@') + 1);
            
            // Try to find the university, but don't throw an exception if not found
            University university = universityRepository.findByDomain(domain)
                    .orElseGet(() -> {
                        // If the university isn't in our database, use a default university (Northeastern)
                        log.info("School not directly supported in verification: {}. Using default university.", domain);
                        return universityRepository.findByDomain("northeastern.edu")
                                .orElseThrow(() -> new SchoolNotFoundException("Default university not found. System configuration error."));
                    });
            
            // Check if this is a first-time verification
            boolean isNewUser = !userRepository.findByEmail(email).isPresent();
            
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
            
            // Generate a simple token (in a real app, this would be a JWT)
            String token = generateToken(user);
            
            // Setting redirect based on whether school is supported
            boolean isSchoolSupported = domain.equals("northeastern.edu");
            String redirectUrl = isSchoolSupported ? "/huskymart" : "/unsupported";
            
            // Return user information with redirect URL and isFirstLogin flag
            UserResponseDTO dto = new UserResponseDTO(email, user.getUsername(), university.getName());
            dto.setRedirectUrl(redirectUrl);
            dto.setIsFirstLogin(isNewUser);
            dto.setToken(token);
            return dto;
        }

        // Normal verification code flow
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
        
        // Extract domain
        String domain = email.substring(email.indexOf('@') + 1);
        
        // Try to find the university, but don't throw an exception if not found
        University university = universityRepository.findByDomain(domain)
                .orElseGet(() -> {
                    // If the university isn't in our database, use a default university (Northeastern)
                    log.info("School not directly supported in verification: {}. Using default university.", domain);
                    return universityRepository.findByDomain("northeastern.edu")
                            .orElseThrow(() -> new SchoolNotFoundException("Default university not found. System configuration error."));
                });
        
        // Check if this is a first-time verification
        boolean isNewUser = !userRepository.findByEmail(email).isPresent();
        
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
        
        // Setting redirect based on whether school is supported and if it's a new user
        boolean isSchoolSupported = domain.equals("northeastern.edu");
        String redirectUrl;
        
        if (isNewUser) {
            // For new users, flow is: verify -> unsupported (if not supported) -> profile
            redirectUrl = isSchoolSupported ? "/huskymart" : "/unsupported";
        } else {
            // For existing users, go to their selected university or unsupported page
            redirectUrl = isSchoolSupported ? "/huskymart" : "/unsupported";
        }
        
        // Generate a simple token (in a real app, this would be a JWT)
        String token = generateToken(user);
        
        // Return user information with redirect URL and isFirstLogin flag
        UserResponseDTO dto = new UserResponseDTO(email, user.getUsername(), university.getName());
        dto.setRedirectUrl(redirectUrl);
        dto.setIsFirstLogin(isNewUser);
        dto.setToken(token);
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

    /**
     * Generate a simple token for the user (placeholder for JWT implementation)
     */
    private String generateToken(User user) {
        return "token-" + user.getEmail() + "-" + System.currentTimeMillis();
    }
}
