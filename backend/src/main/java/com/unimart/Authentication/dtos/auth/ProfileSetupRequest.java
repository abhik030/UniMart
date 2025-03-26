package com.unimart.Authentication.dtos.auth;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfileSetupRequest {
    private String email;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String description;
} 