import React, { useState } from 'react'

interface SubscriptionPlan {
  id: number
  name: string
  description: string
  for_role: string
  monthly_price: number
  yearly_price: number
  features: string
  is_active: boolean
  created_at: string
}

interface EnhancedPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  plan: SubscriptionPlan | null
  billingCycle: 'monthly' | 'yearly'
  onConfirm: (paymentData: {
    payment_method: string
    billing_cycle: 'monthly' | 'yearly'
    stripe_payment_method_id?: string
  }) => void
  loading: boolean
}

const EnhancedPaymentModal: React.FC<EnhancedPaymentModalProps> = ({
  isOpen,
  onClose,
  plan,
  billingCycle,
  onConfirm,
  loading
}) => {
  const [paymentMethod, setPaymentMethod] = useState('credit_card')
  const [cardNumber, setCardNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvv, setCvv] = useState('')
  const [cardholderName, setCardholderName] = useState('')
  const [billingZip, setBillingZip] = useState('')
  const [agreeTerms, setAgreeTerms] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!agreeTerms) {
      alert('Please accept the terms of service to continue.')
      return
    }

    // In a real implementation, this would create a payment method with Stripe
    onConfirm({
      payment_method: paymentMethod,
      billing_cycle: billingCycle,
      stripe_payment_method_id: `pm_test_${Date.now()}`
    })
  }

  const handleCardNumberChange = (value: string) => {
    const formatted = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim()
    if (formatted.length <= 19) {
      setCardNumber(formatted)
    }
  }

  const handleExpiryChange = (value: string) => {
    const formatted = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2')
    if (formatted.length <= 5) {
      setExpiryDate(formatted)
    }
  }

  const getCardType = (number: string) => {
    const cleanNumber = number.replace(/\s/g, '')
    if (cleanNumber.startsWith('4')) return 'Visa'
    if (cleanNumber.startsWith('5') || cleanNumber.startsWith('2')) return 'Mastercard'
    if (cleanNumber.startsWith('3')) return 'American Express'
    return 'Card'
  }

  if (!isOpen || !plan) return null

  const price = billingCycle === 'yearly' ? plan.yearly_price : plan.monthly_price
  const savings = billingCycle === 'yearly' ? (plan.monthly_price * 12 - plan.yearly_price) : 0

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-0 border w-full max-w-2xl shadow-lg rounded-lg bg-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-lg">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold">Complete Your Subscription</h3>
              <p className="text-indigo-100 text-sm">Secure payment powered by Stripe</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex">
          {/* Order Summary */}
          <div className="w-1/3 bg-gray-50 p-6 border-r">
            <h4 className="font-medium text-gray-900 mb-4">Order Summary</h4>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Plan</span>
                <span className="text-sm font-medium">{plan.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Billing Cycle</span>
                <span className="text-sm font-medium capitalize">{billingCycle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Subtotal</span>
                <span className="text-sm font-medium">{formatPrice(price)}</span>
              </div>
              {savings > 0 && (
                <div className="flex justify-between text-green-600">
                  <span className="text-sm">Yearly Savings</span>
                  <span className="text-sm font-medium">-{formatPrice(savings)}</span>
                </div>
              )}
              <div className="border-t pt-3 flex justify-between">
                <span className="font-medium">Total</span>
                <span className="font-bold text-lg">{formatPrice(price)}</span>
              </div>
            </div>

            {/* Features */}
            <div className="mt-6">
              <h5 className="text-sm font-medium text-gray-900 mb-2">What's Included</h5>
              <ul className="space-y-1">
                {plan.features.split(',').slice(0, 4).map((feature, idx) => (
                  <li key={idx} className="flex items-center text-xs text-gray-600">
                    <svg className="w-3 h-3 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {feature.trim()}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Payment Form */}
          <div className="flex-1 p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Payment Method Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Payment Method
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('credit_card')}
                    className={`p-3 border rounded-lg flex flex-col items-center ${
                      paymentMethod === 'credit_card' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
                    }`}
                  >
                    <svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M2 6C2 4.89543 2.89543 4 4 4H20C21.1046 4 22 4.89543 22 6V8H2V6Z"/>
                      <path d="M2 10H22V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V10Z"/>
                    </svg>
                    <span className="text-xs">Credit Card</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('paypal')}
                    className={`p-3 border rounded-lg flex flex-col items-center ${
                      paymentMethod === 'paypal' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
                    }`}
                  >
                    <svg className="w-6 h-6 mb-1 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm1.586-13.413c-.07-.043-.141-.074-.215-.092a.506.506 0 0 0-.134-.018h-2.95L4.234 12.11c-.059.367.213.688.588.688h2.19c1.464 0 2.764-.027 3.95-.341 1.186-.314 2.257-.9 2.994-1.913.737-1.013 1.126-2.382.776-4.233-.35-1.851-1.568-2.782-3.37-2.782H8.662z"/>
                    </svg>
                    <span className="text-xs">PayPal</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('apple_pay')}
                    className={`p-3 border rounded-lg flex flex-col items-center ${
                      paymentMethod === 'apple_pay' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
                    }`}
                  >
                    <svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    <span className="text-xs">Apple Pay</span>
                  </button>
                </div>
              </div>

              {/* Card Details */}
              {paymentMethod === 'credit_card' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      value={cardholderName}
                      onChange={(e) => setCardholderName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => handleCardNumberChange(e.target.value)}
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                        {getCardType(cardNumber)}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry
                      </label>
                      <input
                        type="text"
                        value={expiryDate}
                        onChange={(e) => handleExpiryChange(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        placeholder="123"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ZIP
                      </label>
                      <input
                        type="text"
                        value={billingZip}
                        onChange={(e) => setBillingZip(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="12345"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Terms and Conditions */}
              <div className="flex items-start space-x-2 pt-4">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the{' '}
                  <a href="#" className="text-indigo-600 hover:text-indigo-700">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-indigo-600 hover:text-indigo-700">
                    Privacy Policy
                  </a>
                </label>
              </div>

              {/* Test Mode Notice */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                <div className="flex">
                  <svg className="w-4 h-4 text-yellow-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="text-xs text-yellow-700">
                    <strong>Test Mode:</strong> Use 4242424242424242 for testing. No real charges will be made.
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 flex items-center"
                  disabled={loading || !agreeTerms}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Complete Payment - {formatPrice(price)}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EnhancedPaymentModal