package com.unimart.backend.dto.payment;

import lombok.Data;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
public class PaymentRequestDTO {
    @NotBlank(message = "Payment method ID is required")
    private String paymentMethodId;
    
    @NotNull(message = "Amount is required")
    @Min(value = 1, message = "Amount must be greater than 0")
    private Long amount;
    
    @NotBlank(message = "Currency is required")
    private String currency;
    
    @NotBlank(message = "Description is required")
    private String description;
    
    private String customerEmail;
    
    private String productId;
    
    private String orderId;
} 