import React, { useState } from 'react'
import {
  FiCreditCard,
  FiX,
  FiUser,
  FiCalendar,
  FiLock,
  FiAlertTriangle,
  FiCheckCircle,
  FiSettings
} from 'react-icons/fi'

interface PaymentMethodModalProps {
  isOpen: boolean
  onClose: () => void
  onUpdate: (paymentData: { payment_method: string; stripe_payment_method_id?: string }) => void
  loading: boolean
}

const PaymentMethodModal: React.FC<PaymentMethodModalProps> = ({
  isOpen,
  onClose,
  onUpdate,
  loading
}) => {
  const [paymentMethod, setPaymentMethod] = useState('credit_card')
  const [cardNumber, setCardNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvv, setCvv] = useState('')
  const [cardholderName, setCardholderName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // In a real implementation, this would integrate with Stripe
    // For now, we'll simulate the update
    onUpdate({
      payment_method: paymentMethod,
      stripe_payment_method_id: 'pm_test_' + Date.now()
    })
  }

  const handleCardNumberChange = (value: string) => {
    // Format card number with spaces
    const formatted = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim()
    if (formatted.length <= 19) {
      setCardNumber(formatted)
    }
  }

  const handleExpiryChange = (value: string) => {
    // Format expiry date MM/YY
    const formatted = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2')
    if (formatted.length <= 5) {
      setExpiryDate(formatted)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white shadow-2xl rounded-3xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 border-b-4 border-blue-800">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold flex items-center">
                <FiSettings className="h-6 w-6 mr-3" />
                Update Payment Method
              </h3>
              <p className="text-blue-100 text-sm font-medium mt-1">
                Manage your default payment method
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

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Payment Method Type */}
            <div>
              <label className="block text-base font-bold text-gray-900 mb-4 flex items-center">
                <FiCreditCard className="h-5 w-5 mr-2" />
                Payment Method Type
              </label>
              <div className="grid grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('credit_card')}
                  className={`p-4 border-2 rounded-2xl flex flex-col items-center transition-all duration-200 hover:shadow-md ${
                    paymentMethod === 'credit_card'
                      ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg'
                      : 'border-gray-300 bg-white hover:border-gray-400'
                  }`}
                >
                  <FiCreditCard className="w-8 h-8 mb-2 text-blue-600" />
                  <span className="text-sm font-bold text-gray-900">Credit Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('debit_card')}
                  className={`p-4 border-2 rounded-2xl flex flex-col items-center transition-all duration-200 hover:shadow-md ${
                    paymentMethod === 'debit_card'
                      ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg'
                      : 'border-gray-300 bg-white hover:border-gray-400'
                  }`}
                >
                  <FiCreditCard className="w-8 h-8 mb-2 text-green-600" />
                  <span className="text-sm font-bold text-gray-900">Debit Card</span>
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
              </div>
            </div>

            {paymentMethod === 'credit_card' || paymentMethod === 'debit_card' ? (
              <div className="space-y-6">
                {/* Cardholder Name */}
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
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl font-medium bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400"
                    required
                  />
                </div>

                {/* Card Number */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center">
                    <FiCreditCard className="h-4 w-4 mr-2" />
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => handleCardNumberChange(e.target.value)}
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl font-medium bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {/* Expiry Date */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center">
                      <FiCalendar className="h-4 w-4 mr-2" />
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      value={expiryDate}
                      onChange={(e) => handleExpiryChange(e.target.value)}
                      placeholder="MM/YY"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl font-medium bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400"
                      required
                    />
                  </div>

                  {/* CVV */}
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
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl font-medium bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400"
                      required
                    />
                  </div>
                </div>
              </div>
            ) : paymentMethod === 'paypal' ? (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center">
                  <FiCheckCircle className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-blue-900 mb-1">PayPal Integration</h4>
                    <p className="text-sm text-blue-700 font-medium">
                      You will be redirected to PayPal to complete the payment method setup securely.
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            {/* Test Mode Notice */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center">
                <FiAlertTriangle className="w-5 h-5 text-yellow-600 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-sm text-yellow-800 font-bold">
                    Test Mode Active
                  </p>
                  <p className="text-xs text-yellow-700 font-medium">
                    Use test card number 4242424242424242 for testing. No actual charges will be made.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border-2 border-gray-300 rounded-2xl text-gray-700 font-bold hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:shadow-md"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center font-bold shadow-lg hover:shadow-xl transition-all duration-200 hover:transform hover:scale-105"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <FiCheckCircle className="w-4 h-4 mr-2" />
                    Update Payment Method
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default PaymentMethodModal