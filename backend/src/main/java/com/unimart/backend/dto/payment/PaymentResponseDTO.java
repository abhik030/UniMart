package com.unimart.backend.dto.payment;

import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class PaymentResponseDTO {
    private String paymentIntentId;
    private String clientSecret;
    private String status;
    private Long amount;
    private String currency;
    private String errorMessage;
} 