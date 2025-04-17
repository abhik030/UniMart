package com.unimart.backend.controllers;

import com.unimart.backend.dto.payment.PaymentRequestDTO;
import com.unimart.backend.dto.payment.PaymentResponseDTO;
import com.unimart.backend.dto.payment.ProductCreateRequestDTO;
import com.unimart.backend.dto.payment.ProductCreateResponseDTO;
import com.unimart.backend.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Tag(name = "Payment", description = "Payment processing endpoints")
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create-product")
    @Operation(summary = "Create a Stripe product", description = "Creates a new product in Stripe with associated price")
    public ResponseEntity<ProductCreateResponseDTO> createProduct(@Valid @RequestBody ProductCreateRequestDTO request) {
        ProductCreateResponseDTO response = paymentService.createProduct(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/create-payment-intent")
    @Operation(summary = "Create a payment intent", description = "Creates a new payment intent for processing a payment")
    public ResponseEntity<PaymentResponseDTO> createPaymentIntent(@Valid @RequestBody PaymentRequestDTO request) {
        PaymentResponseDTO response = paymentService.createPaymentIntent(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/confirm/{paymentIntentId}")
    @Operation(summary = "Confirm a payment", description = "Confirms a payment intent that was previously created")
    public ResponseEntity<PaymentResponseDTO> confirmPayment(@PathVariable String paymentIntentId) {
        PaymentResponseDTO response = paymentService.confirmPayment(paymentIntentId);
        return ResponseEntity.ok(response);
    }
} 