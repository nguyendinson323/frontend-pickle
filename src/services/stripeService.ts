import { loadStripe } from '@stripe/stripe-js'

// Use test key for development - replace with actual test key when provided
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_51RuBXOPdinQkUQxdSLQzbhWJwHRvtgM1UvkNWgyC6ue25qxqT8zhBwWVySaTLJP2xeLhUjesZHKEQ8J0RCPzSMxp00DIOGz9j3')

export interface CreatePaymentIntentRequest {
  amount: number
  currency?: string
  metadata?: {
    court_id: number
    date: string
    start_time: string
    end_time: string
    player_id: number
  }
}

export interface CreatePaymentIntentResponse {
  client_secret: string
  payment_intent_id: string
}

class StripeService {
  async createPaymentIntent(data: CreatePaymentIntentRequest): Promise<CreatePaymentIntentResponse> {
    const response = await fetch('/api/payments/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      throw new Error('Failed to create payment intent')
    }

    return response.json()
  }

  async confirmPayment(
    clientSecret: string,
    paymentMethodId: string
  ): Promise<{ success: boolean; error?: string }> {
    const stripe = await stripePromise
    if (!stripe) {
      throw new Error('Stripe failed to load')
    }

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: paymentMethodId
    })

    if (result.error) {
      return { success: false, error: result.error.message }
    }

    return { success: true }
  }

  async getStripeInstance() {
    return stripePromise
  }
}

export const stripeService = new StripeService()