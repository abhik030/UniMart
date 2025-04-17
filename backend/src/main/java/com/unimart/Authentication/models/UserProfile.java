package com.unimart.Authentication.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "UserProfiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfile {
    @Id
    @Column(name = "user_email")
    private String userEmail;
    
    @OneToOne
    @JoinColumn(name = "user_email", referencedColumnName = "email")
    private User user;
    
    @Column(name = "first_name")
    private String firstName;
    
    @Column(name = "last_name")
    private String lastName;
    
    @Column(name = "phone_number")
    private String phoneNumber;
    
    @Column(name = "bio")
    private String bio;
    
    @Column(name = "profile_image_url")
    private String profileImageUrl;
    
    public UserProfile(User user, String firstName, String lastName, String phoneNumber, String bio) {
        this.user = user;
        this.userEmail = user.getEmail();
        this.firstName = firstName;
        this.lastName = lastName;
        this.phoneNumber = phoneNumber;
        this.bio = bio;
    }

    // Ensure userEmail is set when user is set
    public void setUser(User user) {
        this.user = user;
        if (user != null) {
            this.userEmail = user.getEmail();
        }
    }
} 