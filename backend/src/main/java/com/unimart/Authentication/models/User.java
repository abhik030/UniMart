package com.unimart.Authentication.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "Users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @Column(name = "email")
    private String email;
    
    @Column(name = "username", nullable = false, unique = true)
    private String username;
    
    @Column(name = "password", nullable = false)
    private String password;
    
    @Column(name = "role", nullable = false)
    private String role;
    
    @Column(name = "is_verified", nullable = false)
    private boolean verified;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "university_id")
    private University university;
    
    @Column(name = "trusted_device_token")
    private String trustedDeviceToken;
    
    @Column(name = "is_banned", nullable = false)
    private boolean banned;
    
    @Column(name = "banned_by")
    private String bannedBy;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    // Constructor for creating new users
    public User(String email, String username, String password, String role, University university) {
        this.email = email;
        this.username = username;
        this.password = password;
        this.role = role;
        this.university = university;
        this.verified = false;
        this.banned = false;
        this.createdAt = LocalDateTime.now();
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
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
    
    public String getRole() {
        return role;
    }
    
    public void setRole(String role) {
        this.role = role;
    }
    
    public boolean isVerified() {
        return verified;
    }
    
    public void setVerified(boolean verified) {
        this.verified = verified;
    }
    
    public University getUniversity() {
        return university;
    }
    
    public void setUniversity(University university) {
        this.university = university;
    }
    
    public String getTrustedDeviceToken() {
        return trustedDeviceToken;
    }
    
    public void setTrustedDeviceToken(String trustedDeviceToken) {
        this.trustedDeviceToken = trustedDeviceToken;
    }
    
    public boolean isBanned() {
        return banned;
    }
    
    public void setBanned(boolean banned) {
        this.banned = banned;
    }
    
    public String getBannedBy() {
        return bannedBy;
    }
    
    public void setBannedBy(String bannedBy) {
        this.bannedBy = bannedBy;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
} 