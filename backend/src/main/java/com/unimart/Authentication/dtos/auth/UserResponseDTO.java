package com.unimart.Authentication.dtos.auth;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserResponseDTO {
    private String email;
    private String username;
    private String university;
    private String redirectUrl;
    private Boolean isFirstLogin;
    private String token;
    
    // Constructor without redirectUrl for backward compatibility
    public UserResponseDTO(String email, String username, String university) {
        this.email = email;
        this.username = username;
        this.university = university;
    }
    
    // Manual getters and setters in case Lombok isn't working
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public String getUniversity() {
        return university;
    }
    
    public void setUniversity(String university) {
        this.university = university;
    }
    
    public String getRedirectUrl() {
        return redirectUrl;
    }
    
    public void setRedirectUrl(String redirectUrl) {
        this.redirectUrl = redirectUrl;
    }
    
    public Boolean getIsFirstLogin() {
        return isFirstLogin;
    }
    
    public void setIsFirstLogin(Boolean isFirstLogin) {
        this.isFirstLogin = isFirstLogin;
    }
    
    public String getToken() {
        return token;
    }
    
    public void setToken(String token) {
        this.token = token;
    }
}

