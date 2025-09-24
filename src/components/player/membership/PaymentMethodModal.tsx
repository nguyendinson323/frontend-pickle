import React, { useState } from 'react'
import {
  FiCreditCard,
  FiX,
  FiUser,
  FiCalendar,
  FiLock,
  FiHome,
  FiDollarSign,
  FiInfo,
  FiCheck
} from 'react-icons/fi'

interface PaymentMethodModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (paymentData: { payment_method: string; stripe_payment_method_id?: string }) => void
}

const PaymentMethodModal: React.FC<PaymentMethodModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [paymentMethod, setPaymentMethod] = useState('credit_card')
  const [cardNumber, setCardNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvv, setCvv] = useState('')
  const [cardholderName, setCardholderName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // In a real implementation, you would use Stripe Elements to securely handle card data
    // For now, we'll simulate the payment method update
    onSubmit({
      payment_method: paymentMethod,
      stripe_payment_method_id: `pm_${Date.now()}` // Simulated Stripe payment method ID
    })
    
    // Reset form
    setCardNumber('')
    setExpiryDate('')
    setCvv('')
    setCardholderName('')
    onClose()
  }

  const formatCardNumber = (value: string) => {
    // Remove all non-digits
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    // Add spaces every 4 digits
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl max-w-2xl w-full shadow-2xl border-2 border-gray-200">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mr-4">
                <FiCreditCard className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Update Payment Method</h2>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors duration-200"
            >
              <FiX className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <div className="p-8">

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
            <div className="flex items-center mb-4">
              <FiDollarSign className="w-5 h-5 text-blue-600 mr-3" />
              <label className="block text-lg font-bold text-blue-800">Payment Method</label>
            </div>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-6 py-4 border-2 border-blue-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium bg-white text-lg"
            >
              <option value="credit_card">💳 Credit Card</option>
              <option value="debit_card">💳 Debit Card</option>
              <option value="bank_transfer">🏦 Bank Transfer</option>
            </select>
          </div>

          {(paymentMethod === 'credit_card' || paymentMethod === 'debit_card') && (
            <>
              <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
                <div className="flex items-center mb-4">
                  <FiUser className="w-5 h-5 text-green-600 mr-3" />
                  <label className="block text-lg font-bold text-green-800">Cardholder Name</label>
                </div>
                <input
                  type="text"
                  value={cardholderName}
                  onChange={(e) => setCardholderName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-6 py-4 border-2 border-green-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 font-medium bg-white text-lg"
                  required
                />
              </div>

              <div className="bg-purple-50 rounded-2xl p-6 border border-purple-200">
                <div className="flex items-center mb-4">
                  <FiCreditCard className="w-5 h-5 text-purple-600 mr-3" />
                  <label className="block text-lg font-bold text-purple-800">Card Number</label>
                </div>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  className="w-full px-6 py-4 border-2 border-purple-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-medium bg-white text-lg font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-orange-50 rounded-2xl p-6 border border-orange-200">
                  <div className="flex items-center mb-4">
                    <FiCalendar className="w-5 h-5 text-orange-600 mr-3" />
                    <label className="block text-lg font-bold text-orange-800">Expiry Date</label>
                  </div>
                  <input
                    type="text"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                    placeholder="MM/YY"
                    maxLength={5}
                    className="w-full px-6 py-4 border-2 border-orange-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-medium bg-white text-lg font-mono"
                    required
                  />
                </div>

                <div className="bg-red-50 rounded-2xl p-6 border border-red-200">
                  <div className="flex items-center mb-4">
                    <FiLock className="w-5 h-5 text-red-600 mr-3" />
                    <label className="block text-lg font-bold text-red-800">CVV</label>
                  </div>
                  <input
                    type="text"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substring(0, 4))}
                    placeholder="123"
                    maxLength={4}
                    className="w-full px-6 py-4 border-2 border-red-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 font-medium bg-white text-lg font-mono"
                    required
                  />
                </div>
              </div>
            </>
          )}

          {paymentMethod === 'bank_transfer' && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-3xl p-8">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mr-4 flex-shrink-0">
                  <FiInfo className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-blue-800 mb-3 flex items-center">
                    <FiHome className="w-5 h-5 mr-2" />
                    Bank Transfer Instructions
                  </h4>
                  <p className="text-base font-medium text-blue-700 leading-relaxed">
                    You will receive detailed bank transfer information via email after confirming this update.
                    This includes account details, reference numbers, and payment instructions.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-gray-100 rounded-2xl p-6 flex flex-col sm:flex-row gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 inline-flex items-center justify-center px-8 py-4 bg-gray-200 text-gray-700 font-bold rounded-2xl hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-300"
            >
              <FiX className="w-5 h-5 mr-3" />
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 shadow-xl hover:shadow-2xl hover:transform hover:scale-105"
            >
              <FiCheck className="w-5 h-5 mr-3" />
              Update Payment Method
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  )
}

export default PaymentMethodModal