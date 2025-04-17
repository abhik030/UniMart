package com.unimart.backend.service;

import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.model.Product;
import com.stripe.model.Price;
import com.stripe.param.PaymentIntentCreateParams;
import com.stripe.param.ProductCreateParams;
import com.stripe.param.PriceCreateParams;
import com.unimart.backend.dto.payment.PaymentRequestDTO;
import com.unimart.backend.dto.payment.PaymentResponseDTO;
import com.unimart.backend.dto.payment.ProductCreateRequestDTO;
import com.unimart.backend.dto.payment.ProductCreateResponseDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
public class PaymentService {

    @Value("${stripe.api.key}")
    private String stripeApiKey;

    @Transactional
    public ProductCreateResponseDTO createProduct(ProductCreateRequestDTO request) {
        try {
            // Create product in Stripe
            ProductCreateParams productParams = ProductCreateParams.builder()
                .setName(request.getTitle())
                .setDescription(request.getDescription())
                .build();

            Product product = Product.create(productParams);

            // Create price for the product
            PriceCreateParams priceParams = PriceCreateParams.builder()
                .setProduct(product.getId())
                .setUnitAmount(request.getAmount())
                .setCurrency(request.getCurrency().toLowerCase())
                .build();

            Price price = Price.create(priceParams);

            return ProductCreateResponseDTO.builder()
                .stripeProductId(product.getId())
                .stripePriceId(price.getId())
                .build();

        } catch (StripeException e) {
            log.error("Error creating Stripe product: {}", e.getMessage());
            throw new RuntimeException("Failed to create Stripe product", e);
        }
    }

    public PaymentResponseDTO createPaymentIntent(PaymentRequestDTO request) {
        try {
            Map<String, String> metadata = new HashMap<>();
            metadata.put("product_id", request.getProductId());
            metadata.put("order_id", request.getOrderId());

            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(request.getAmount())
                .setCurrency(request.getCurrency().toLowerCase())
                .setPaymentMethod(request.getPaymentMethodId())
                .setConfirm(true)
                .setDescription(request.getDescription())
                .setReceiptEmail(request.getCustomerEmail())
                .putAllMetadata(metadata)
                .build();

            PaymentIntent paymentIntent = PaymentIntent.create(params);

            return PaymentResponseDTO.builder()
                .paymentIntentId(paymentIntent.getId())
                .clientSecret(paymentIntent.getClientSecret())
                .status(paymentIntent.getStatus())
                .amount(paymentIntent.getAmount())
                .currency(paymentIntent.getCurrency())
                .build();
        } catch (StripeException e) {
            log.error("Error creating payment intent: {}", e.getMessage());
            return PaymentResponseDTO.builder()
                .status("failed")
                .errorMessage(e.getMessage())
                .build();
        }
    }

    public PaymentResponseDTO confirmPayment(String paymentIntentId) {
        try {
            PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);
            PaymentIntent confirmedIntent = paymentIntent.confirm();

            return PaymentResponseDTO.builder()
                .paymentIntentId(confirmedIntent.getId())
                .status(confirmedIntent.getStatus())
                .amount(confirmedIntent.getAmount())
                .currency(confirmedIntent.getCurrency())
                .build();
        } catch (StripeException e) {
            log.error("Error confirming payment: {}", e.getMessage());
            return PaymentResponseDTO.builder()
                .status("failed")
                .errorMessage(e.getMessage())
                .build();
        }
    }
} 