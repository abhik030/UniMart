package com.unimart.Authentication.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;
import java.io.IOException;
import java.util.Base64;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.unimart.Authentication.dtos.auth.ProfileSetupRequest;
import com.unimart.Authentication.dtos.auth.ProfileSetupResponse;
import com.unimart.Authentication.dtos.auth.SchoolRedirectDTO;
import com.unimart.Authentication.dtos.auth.UserResponseDTO;
import com.unimart.Authentication.dtos.auth.SupportedUniversityDTO;
import com.unimart.Authentication.exceptions.InvalidEmailException;
import com.unimart.Authentication.exceptions.InvalidVerificationCodeException;
import com.unimart.Authentication.exceptions.SchoolNotFoundException;
import com.unimart.Authentication.models.University;
import com.unimart.Authentication.models.User;
import com.unimart.Authentication.models.UserProfile;
import com.unimart.Authentication.models.VerificationCode;
import com.unimart.Authentication.repositories.UniversityRepository;
import com.unimart.Authentication.repositories.UserProfileRepository;
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
    
    @Autowired
    private UserProfileRepository userProfileRepository;

    /**
     * Validates if the email is a valid school email and sends an authentication code
     */
    @Transactional
    public SchoolRedirectDTO validateEmail(String email) {
        // Special case for developer/testing account
        if (email.equals("studentunimart@gmail.com")) {
            log.info("Developer account email detected: {}", email);
            // Use Northeastern University as the default university for the developer account
            University university = universityRepository.findByDomain("northeastern.edu")
                    .orElseThrow(() -> new SchoolNotFoundException("Northeastern University not found in database"));
            
            // Generate and send verification code
            String code = generateCode();
            LocalDateTime expirationTime = LocalDateTime.now().plusMinutes(10);
            
            // Delete any existing verification codes for this email
            verificationCodeRepository.findByEmail(email)
                    .ifPresent(verificationCodeRepository::delete);
            
            // Save new verification code
            verificationCodeRepository.save(new VerificationCode(email, code, expirationTime));
            
            // Create email body for developer
            String emailBody = String.format(
                "Welcome to UniMart Developer Account!\n\n" +
                "Your verification code is: %s\n\n" +
                "This code will expire in 10 minutes.\n\n" +
                "Thank you for using the developer account!",
                code
            );
            
            // Send the email
            emailService.sendEmail(email, "UniMart Developer Verification Code", emailBody);
            
            // Return university information for the frontend
            String marketplaceUrl = generateRedirectUrl(university);
            String marketplaceName = getMarketplaceName(university);
            
            SchoolRedirectDTO dto = new SchoolRedirectDTO(university.getName(), marketplaceUrl);
            dto.setMarketplaceName(marketplaceName);
            return dto;
        }
        
        // Check if email is a valid .edu email
        if (!email.endsWith(".edu")) {
            throw new InvalidEmailException("Only .edu email addresses are allowed.");
        }
        
        // Extract domain from email (e.g., northeastern.edu from user@northeastern.edu)
        String domain = email.substring(email.indexOf('@') + 1);
        
        // Try to find the university
        University university = universityRepository.findByDomain(domain)
                .orElseGet(() -> {
                    // If the university isn't in our database, use Northeastern as default
                    log.info("School not directly supported: {}. Using Northeastern as default.", domain);
                    return universityRepository.findByDomain("northeastern.edu")
                            .orElseThrow(() -> new SchoolNotFoundException("Default university (Northeastern) not found in database"));
                });
        
        // Generate and send verification code
        String code = generateCode();
        LocalDateTime expirationTime = LocalDateTime.now().plusMinutes(10);
        
        // Delete any existing verification codes for this email
        verificationCodeRepository.findByEmail(email)
                .ifPresent(verificationCodeRepository::delete);
        
        // Save new verification code
        verificationCodeRepository.save(new VerificationCode(email, code, expirationTime));
        
        // Create email body
        String emailBody = String.format(
            "Welcome to UniMart!\n\n" +
            "Your verification code is: %s\n\n" +
            "This code will expire in 10 minutes.\n\n" +
            "Thank you for joining the %s's UniMart community!",
            code, university.getName()
        );
        
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
    public UserResponseDTO verifyCode(String email, String code, boolean rememberMe) {
        // Special case for testing - dummy code 123456
        if ("123456".equals(code)) {
            log.info("Using dummy verification code 123456 for email: {}", email);
            // Extract domain
            String domain = email.substring(email.indexOf('@') + 1);
            
            // Try to find the university
            University university = universityRepository.findByDomain(domain)
                    .orElseGet(() -> {
                        log.info("School not directly supported in verification: {}. Using default university.", domain);
                        return universityRepository.findByDomain("northeastern.edu")
                                .orElseThrow(() -> new SchoolNotFoundException("Default university (Northeastern) not found in database"));
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
                        User newUser = new User(email, username, "unused", "USER", university);
                        return userRepository.save(newUser);
                    });
            
            // Mark user as verified
            user.setVerified(true);
            
            // If remember me is enabled, generate a trusted device token
            if (rememberMe) {
                String trustedToken = generateTrustedDeviceToken(email);
                user.setTrustedDeviceToken(trustedToken);
                log.info("Remember me enabled. Set trusted device token for user: {}", email);
            }
            
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
            if (rememberMe) {
                dto.setTrustedDeviceToken(user.getTrustedDeviceToken());
            }
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
                    return new User(email, username, "unused", "USER", university);
                });
        
        // Mark user as verified
        user.setVerified(true);
        
        // If remember me is enabled, generate a trusted device token
        if (rememberMe) {
            String trustedToken = generateTrustedDeviceToken(email);
            user.setTrustedDeviceToken(trustedToken);
            log.info("Remember me enabled. Set trusted device token for user: {}", email);
        }
        
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
        if (rememberMe) {
            dto.setTrustedDeviceToken(user.getTrustedDeviceToken());
        }
        return dto;
    }
    
    /**
     * Fallback for the old method signature to maintain compatibility
     */
    @Transactional
    public UserResponseDTO verifyCode(String email, String code) {
        return verifyCode(email, code, false);
    }
    
    /**
     * Verifies if a trusted device token is valid
     */
    public boolean verifyTrustedDeviceToken(String email, String token) {
        if (email == null || token == null || token.isEmpty()) {
            return false;
        }
        
        return userRepository.findByEmail(email)
                .map(user -> token.equals(user.getTrustedDeviceToken()))
                .orElse(false);
    }
    
    /**
     * Generates a token for trusted devices
     */
    private String generateTrustedDeviceToken(String email) {
        // In a real application, this would be a secure token with an expiration
        return "trusted-" + email + "-" + System.currentTimeMillis();
    }

    /**
     * Sets up the user profile and returns profile information
     */
    @Transactional
    public ProfileSetupResponse setupProfile(ProfileSetupRequest request, MultipartFile profilePicture) {
        String email = request.getEmail();
        
        // Get the user from the repository
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found for email: " + email));
        
        // Create or update user profile
        UserProfile profile = userProfileRepository.findByUserEmail(email)
                .orElseGet(() -> {
                    UserProfile newProfile = new UserProfile();
                    newProfile.setUser(user);
                    newProfile.setUserEmail(email);
                    return newProfile;
                });
        
        profile.setFirstName(request.getFirstName());
        profile.setLastName(request.getLastName());
        profile.setPhoneNumber(request.getPhoneNumber());
        profile.setBio(request.getDescription());
        
        // Handle profile picture
        if (profilePicture != null && !profilePicture.isEmpty()) {
            try {
                // Convert image to Base64 encoded string
                byte[] imageBytes = profilePicture.getBytes();
                String base64Image = Base64.getEncoder().encodeToString(imageBytes);
                @SuppressWarnings({ "null", "unused" })
                String imageFormat = profilePicture.getContentType().split("/")[1]; // Get format (jpg, png, etc)
                String dataURI = "data:" + profilePicture.getContentType() + ";base64," + base64Image;
                
                // Store the data URI in the database
                profile.setProfileImageUrl(dataURI);
                log.info("Profile picture stored as base64 data URI for user: {}", email);
            } catch (IOException e) {
                log.error("Failed to process profile picture for user: {}", email, e);
                // Don't update the profile picture if there was an error
            }
        }
        
        // Save the profile
        profile = userProfileRepository.save(profile);
        
        // Generate a token that includes profile info
        String token = generateToken(user);
        
        // Return the response
        ProfileSetupResponse response = new ProfileSetupResponse();
        response.setId(user.getUniversity().getId());
        response.setEmail(email);
        response.setFirstName(profile.getFirstName());
        response.setLastName(profile.getLastName());
        response.setPhoneNumber(profile.getPhoneNumber());
        response.setDescription(profile.getBio());
        response.setProfilePictureUrl(profile.getProfileImageUrl());
        response.setUniversityName(user.getUniversity().getName());
        response.setToken(token);
        
        return response;
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
     * Get a user by email
     */
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found for email: " + email));
    }

    /**
     * Generate a simple token for the user (placeholder for JWT implementation)
     */
    public String generateToken(User user) {
        return "token-" + user.getEmail() + "-" + System.currentTimeMillis();
    }

    /**
     * Health check to verify database connection
     */
    public boolean databaseHealthCheck() {
        try {
            // Try to execute a simple DB query
            long userCount = userRepository.count();
            long universityCount = universityRepository.count();
            log.info("Database health check: {} users, {} universities", userCount, universityCount);
            return true;
        } catch (Exception e) {
            log.error("Database health check failed", e);
            return false;
        }
    }
}
