package com.unimart.Authentication.dtos.auth;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SchoolRedirectDTO {
    private String universityName;
    private String marketplaceUrl;
    private String marketplaceName;
    
    // Constructor without marketplaceName for backward compatibility
    public SchoolRedirectDTO(String universityName, String marketplaceUrl) {
        this.universityName = universityName;
        this.marketplaceUrl = marketplaceUrl;
    }
    
    // Manual getters and setters in case Lombok isn't working
    public String getUniversityName() {
        return universityName;
    }
    
    public void setUniversityName(String universityName) {
        this.universityName = universityName;
    }
    
    public String getMarketplaceUrl() {
        return marketplaceUrl;
    }
    
    public void setMarketplaceUrl(String marketplaceUrl) {
        this.marketplaceUrl = marketplaceUrl;
    }
    
    public String getMarketplaceName() {
        return marketplaceName;
    }
    
    public void setMarketplaceName(String marketplaceName) {
        this.marketplaceName = marketplaceName;
    }
} 