import React, { useState } from 'react'
import { Elements } from '@stripe/react-stripe-js'
import { stripeService } from '../../../services/stripeService'
import PaymentForm from './PaymentForm'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (paymentIntentId: string) => void
  amount: number
  description: string
  metadata?: {
    court_id: number
    date: string
    start_time: string
    end_time: string
    player_id: number
  }
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  amount,
  description,
  metadata
}) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const initializePayment = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await stripeService.createPaymentIntent({
        amount: Math.round(amount * 100), // Convert to cents
        currency: 'usd', // Changed from MXN to USD for testing
        metadata
      })

      setClientSecret(response.client_secret)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Payment initialization failed')
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    if (isOpen) {
      initializePayment()
    } else {
      setClientSecret(null)
      setError(null)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-gray-100 animate-fade-in-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <span className="text-xl">💳</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  Payment Required
                </h2>
                <p className="text-green-100 text-sm">
                  ${amount.toFixed(2)}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-full transition-all duration-300 hover:scale-110"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Description */}
          <div className="mb-6">
            <p className="text-gray-700 leading-relaxed">
              {description}
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center space-x-2">
                <span className="text-red-500 text-lg">❌</span>
                <p className="text-red-700 font-medium">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg animate-bounce mb-4">
                <svg className="w-8 h-8 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <p className="text-green-700 font-medium">Preparing payment...</p>
            </div>
          )}

          {/* Stripe Elements */}
          {clientSecret && !loading && (
            <Elements stripe={stripeService.getStripeInstance()}>
              <PaymentForm
                clientSecret={clientSecret}
                onSuccess={onSuccess}
                onClose={onClose}
                amount={amount}
              />
            </Elements>
          )}
        </div>
      </div>
    </div>
  )
}

export default PaymentModal