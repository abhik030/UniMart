import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api';

export interface PaymentRequest {
  amount: number;
  currency: string;
  paymentMethodId: string;
  productId: string;
  orderId: string;
  description: string;
  customerEmail: string;
}

export interface ProductCreateRequest {
  title: string;
  description: string;
  amount: number;
  currency: string;
}

export interface PaymentResponse {
  paymentIntentId: string;
  clientSecret: string;
  status: string;
  amount: number;
  currency: string;
  errorMessage?: string;
}

export interface ProductCreateResponse {
  stripeProductId: string;
  stripePriceId: string;
}

export const paymentService = {
  createPaymentIntent: async (request: PaymentRequest): Promise<PaymentResponse> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/payment/create-payment-intent`, request);
      return response.data;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  },

  createProduct: async (request: ProductCreateRequest): Promise<ProductCreateResponse> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/payment/create-product`, request);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  confirmPayment: async (paymentIntentId: string): Promise<PaymentResponse> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/payment/confirm-payment`, { paymentIntentId });
      return response.data;
    } catch (error) {
      console.error('Error confirming payment:', error);
      throw error;
    }
  }
}; 