package com.unimart.backend.dto.payment;

import lombok.Data;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
public class ProductCreateRequestDTO {
    @NotBlank(message = "Product title is required")
    private String title;
    
    @NotBlank(message = "Product description is required")
    private String description;
    
    @NotNull(message = "Amount is required")
    @Min(value = 1, message = "Amount must be greater than 0")
    private Long amount;
    
    @NotBlank(message = "Currency is required")
    private String currency;
} 