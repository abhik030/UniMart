package com.unimart.backend.dto.payment;

import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class ProductCreateResponseDTO {
    private String stripeProductId;
    private String stripePriceId;
} 