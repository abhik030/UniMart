package com.unimart.Authentication.dtos.auth;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SupportedUniversityDTO {
    private Long id;
    private String name;
    private String domain;
    private String marketplaceUrl;
    private String marketplaceName;
    
    // Manual getters and setters in case Lombok isn't working
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getDomain() {
        return domain;
    }
    
    public void setDomain(String domain) {
        this.domain = domain;
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