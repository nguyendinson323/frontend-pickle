import React, { useState } from 'react'
import {
  FiCreditCard,
  FiX,
  FiCheck,
  FiAlertTriangle,
  FiLock,
  FiStar,
  FiShield,
  FiUser,
  FiCalendar,
  FiDollarSign
} from 'react-icons/fi'

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
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl bg-white shadow-2xl rounded-3xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white p-8 border-b-4 border-indigo-800">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-bold flex items-center">
                <FiShield className="h-8 w-8 mr-3" />
                Complete Your Subscription
              </h3>
              <p className="text-indigo-100 text-base font-medium mt-2 flex items-center">
                <FiLock className="h-4 w-4 mr-2" />
                Secure payment powered by Stripe
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 p-2 rounded-xl hover:bg-white hover:bg-opacity-20 transition-all duration-200"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex">
          {/* Order Summary */}
          <div className="w-1/3 bg-gradient-to-br from-gray-50 to-blue-50 p-8 border-r border-gray-200">
            <h4 className="font-bold text-gray-900 mb-6 text-lg flex items-center">
              <FiDollarSign className="h-5 w-5 mr-2" />
              Order Summary
            </h4>

            <div className="space-y-4">
              <div className="flex justify-between items-center bg-white border border-gray-200 rounded-xl p-3">
                <span className="text-sm text-gray-600 font-medium flex items-center">
                  <FiStar className="h-4 w-4 mr-2" />
                  Plan
                </span>
                <span className="text-sm font-bold text-gray-900">{plan.name}</span>
              </div>
              <div className="flex justify-between items-center bg-white border border-gray-200 rounded-xl p-3">
                <span className="text-sm text-gray-600 font-medium flex items-center">
                  <FiCalendar className="h-4 w-4 mr-2" />
                  Billing Cycle
                </span>
                <span className="text-sm font-bold text-gray-900 capitalize">{billingCycle}</span>
              </div>
              <div className="flex justify-between items-center bg-white border border-gray-200 rounded-xl p-3">
                <span className="text-sm text-gray-600 font-medium">Subtotal</span>
                <span className="text-sm font-bold text-gray-900">{formatPrice(price)}</span>
              </div>
              {savings > 0 && (
                <div className="flex justify-between items-center bg-green-50 border border-green-200 rounded-xl p-3">
                  <span className="text-sm text-green-700 font-medium">Yearly Savings</span>
                  <span className="text-sm font-bold text-green-700">-{formatPrice(savings)}</span>
                </div>
              )}
              <div className="border-t-2 border-gray-300 pt-4 flex justify-between items-center bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl p-4">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-bold text-xl text-indigo-600">{formatPrice(price)}</span>
              </div>
            </div>

            {/* Features */}
            <div className="mt-8">
              <h5 className="text-sm font-bold text-gray-900 mb-4 flex items-center">
                <FiCheck className="h-4 w-4 mr-2" />
                What's Included
              </h5>
              <ul className="space-y-3">
                {plan.features.split(',').slice(0, 4).map((feature, idx) => (
                  <li key={idx} className="flex items-center text-sm text-gray-700 bg-white border border-gray-200 rounded-xl p-3">
                    <FiCheck className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                    <span className="font-medium">{feature.trim()}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Payment Form */}
          <div className="flex-1 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Payment Method Selection */}
              <div>
                <label className="block text-base font-bold text-gray-900 mb-4 flex items-center">
                  <FiCreditCard className="h-5 w-5 mr-2" />
                  Payment Method
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('credit_card')}
                    className={`p-4 border-2 rounded-2xl flex flex-col items-center transition-all duration-200 hover:shadow-md ${
                      paymentMethod === 'credit_card'
                        ? 'border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-lg'
                        : 'border-gray-300 bg-white hover:border-gray-400'
                    }`}
                  >
                    <FiCreditCard className="w-8 h-8 mb-2 text-indigo-600" />
                    <span className="text-sm font-bold text-gray-900">Credit Card</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('paypal')}
                    className={`p-4 border-2 rounded-2xl flex flex-col items-center transition-all duration-200 hover:shadow-md ${
                      paymentMethod === 'paypal'
                        ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg'
                        : 'border-gray-300 bg-white hover:border-gray-400'
                    }`}
                  >
                    <div className="w-8 h-8 mb-2 bg-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">P</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">PayPal</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('apple_pay')}
                    className={`p-4 border-2 rounded-2xl flex flex-col items-center transition-all duration-200 hover:shadow-md ${
                      paymentMethod === 'apple_pay'
                        ? 'border-gray-500 bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg'
                        : 'border-gray-300 bg-white hover:border-gray-400'
                    }`}
                  >
                    <div className="w-8 h-8 mb-2 bg-black rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">A</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">Apple Pay</span>
                  </button>
                </div>
              </div>

              {/* Card Details */}
              {paymentMethod === 'credit_card' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center">
                      <FiUser className="h-4 w-4 mr-2" />
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      value={cardholderName}
                      onChange={(e) => setCardholderName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl font-medium bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:border-gray-400"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center">
                      <FiCreditCard className="h-4 w-4 mr-2" />
                      Card Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => handleCardNumberChange(e.target.value)}
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-4 py-3 pr-20 border-2 border-gray-300 rounded-2xl font-medium bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:border-gray-400"
                        required
                      />
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm font-bold text-gray-600">
                        {getCardType(cardNumber)}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center">
                        <FiCalendar className="h-4 w-4 mr-2" />
                        Expiry
                      </label>
                      <input
                        type="text"
                        value={expiryDate}
                        onChange={(e) => handleExpiryChange(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl font-medium bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:border-gray-400"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center">
                        <FiLock className="h-4 w-4 mr-2" />
                        CVV
                      </label>
                      <input
                        type="text"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        placeholder="123"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl font-medium bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:border-gray-400"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-3">
                        ZIP
                      </label>
                      <input
                        type="text"
                        value={billingZip}
                        onChange={(e) => setBillingZip(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="12345"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl font-medium bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:border-gray-400"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Terms and Conditions */}
              <div className="flex items-start space-x-3 pt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-4">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-1 h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="terms" className="text-sm text-gray-700 font-medium">
                  I agree to the{' '}
                  <a href="#" className="text-indigo-600 hover:text-indigo-700 font-bold underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-indigo-600 hover:text-indigo-700 font-bold underline">
                    Privacy Policy
                  </a>
                </label>
              </div>

              {/* Test Mode Notice */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center">
                  <FiAlertTriangle className="w-5 h-5 text-yellow-600 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-yellow-800 font-bold">
                      Test Mode Active
                    </p>
                    <p className="text-xs text-yellow-700 font-medium">
                      Use card number 4242424242424242 for testing. No real charges will be made.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-8 py-3 border-2 border-gray-300 rounded-2xl text-gray-700 font-bold hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 hover:shadow-md"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-2xl hover:from-indigo-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 flex items-center font-bold shadow-lg hover:shadow-xl transition-all duration-200 hover:transform hover:scale-105"
                  disabled={loading || !agreeTerms}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <FiLock className="w-5 h-5 mr-2" />
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