import React, { useState } from 'react'
import { Payment } from '../../../store/slices/adminPaymentsSlice'
import {
  FiX,
  FiRefreshCw,
  FiDollarSign,
  FiUser,
  FiCreditCard,
  FiAlertTriangle,
  FiLoader,
  FiCheck
} from 'react-icons/fi'

interface RefundModalProps {
  payment: Payment
  onClose: () => void
  onRefund: (amount?: number, reason?: string) => void
}

const RefundModal: React.FC<RefundModalProps> = ({ payment, onClose, onRefund }) => {
  const [refundAmount, setRefundAmount] = useState(payment.amount)
  const [refundReason, setRefundReason] = useState('')
  const [processing, setProcessing] = useState(false)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProcessing(true)
    
    try {
      await onRefund(refundAmount, refundReason)
    } catch (error) {
      // Error handled by parent
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white shadow-2xl rounded-3xl border border-gray-100 max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-8 py-6 rounded-t-3xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <FiRefreshCw className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Process Refund</h3>
                <p className="text-red-100 font-medium">Payment #{payment.id}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-xl flex items-center justify-center transition-all duration-200 transform hover:scale-105"
              disabled={processing}
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Payment Info */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-2xl p-6 border-2 border-blue-200 shadow-lg">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white mr-3">
                <FiCreditCard className="h-5 w-5" />
              </div>
              <h4 className="text-xl font-bold text-gray-900">Payment Details</h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4 shadow-md border border-blue-200">
                <span className="text-sm font-bold text-blue-600">Payment ID</span>
                <div className="text-xl font-bold text-gray-900">#{payment.id}</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-md border border-blue-200">
                <span className="text-sm font-bold text-blue-600">Original Amount</span>
                <div className="flex items-center space-x-2 text-xl font-bold text-gray-900">
                  <FiDollarSign className="h-5 w-5 text-green-600" />
                  <span>{formatCurrency(payment.amount)}</span>
                </div>
              </div>
              {payment.user && (
                <div className="bg-white rounded-xl p-4 shadow-md border border-blue-200 sm:col-span-2">
                  <span className="text-sm font-bold text-blue-600">Customer</span>
                  <div className="flex items-center space-x-2 text-xl font-bold text-gray-900">
                    <FiUser className="h-5 w-5 text-purple-600" />
                    <span>{payment.user.username}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Refund Amount */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-100 rounded-2xl p-6 border-2 border-green-200 shadow-lg">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white mr-3">
                <FiDollarSign className="h-4 w-4" />
              </div>
              <label htmlFor="refundAmount" className="text-lg font-bold text-gray-900">
                Refund Amount
              </label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FiDollarSign className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                id="refundAmount"
                step="0.01"
                min="0"
                max={payment.amount}
                value={refundAmount}
                onChange={(e) => setRefundAmount(parseFloat(e.target.value) || 0)}
                className="block w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg font-bold bg-white hover:border-gray-400 transition-all duration-200"
                required
                disabled={processing}
              />
            </div>
            <p className="mt-3 text-sm font-bold text-green-600 bg-white rounded-xl px-4 py-2 shadow-md border border-green-200">
              Maximum refundable: {formatCurrency(payment.amount)}
            </p>
          </div>

          {/* Refund Reason */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-100 rounded-2xl p-6 border-2 border-purple-200 shadow-lg">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white mr-3">
                <FiRefreshCw className="h-4 w-4" />
              </div>
              <label htmlFor="refundReason" className="text-lg font-bold text-gray-900">
                Refund Reason
              </label>
            </div>
            <div className="relative">
              <select
                id="refundReason"
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                className="block w-full px-4 py-4 border-2 border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-lg font-bold bg-white hover:border-gray-400 transition-all duration-200 appearance-none cursor-pointer"
                required
                disabled={processing}
              >
                <option value="">🔄 Select a reason</option>
                <option value="duplicate_payment">🔁 Duplicate Payment</option>
                <option value="customer_request">🙋 Customer Request</option>
                <option value="fraudulent_transaction">⚠️ Fraudulent Transaction</option>
                <option value="service_not_provided">❌ Service Not Provided</option>
                <option value="tournament_cancelled">🏆 Tournament Cancelled</option>
                <option value="court_unavailable">🏈 Court Unavailable</option>
                <option value="technical_error">🔧 Technical Error</option>
                <option value="other">📝 Other</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <FiRefreshCw className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Custom Reason */}
          {refundReason === 'other' && (
            <div className="bg-gradient-to-r from-orange-50 to-yellow-100 rounded-2xl p-6 border-2 border-orange-200 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white mr-3">
                  <FiRefreshCw className="h-4 w-4" />
                </div>
                <label htmlFor="customReason" className="text-lg font-bold text-gray-900">
                  Custom Reason
                </label>
              </div>
              <textarea
                id="customReason"
                rows={4}
                placeholder="Please specify the reason for this refund..."
                onChange={(e) => setRefundReason(e.target.value)}
                className="block w-full px-4 py-4 border-2 border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg font-medium bg-white hover:border-gray-400 transition-all duration-200 resize-none"
                required
                disabled={processing}
              />
            </div>
          )}

          {/* Warning */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-100 rounded-2xl p-6 border-2 border-yellow-200 shadow-lg">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                <FiAlertTriangle className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-yellow-800 mb-3">
                  Refund Warning
                </h3>
                <div className="bg-white rounded-xl p-4 shadow-md border border-yellow-200">
                  <p className="text-yellow-700 font-medium leading-relaxed">
                    This action cannot be undone. The refund will be processed immediately
                    and the customer will be notified automatically.
                  </p>
                </div>
              </div>
            </div>
          </div>

          </form>

          {/* Action Buttons */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-t-2 border-gray-200 rounded-b-3xl">
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center px-8 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
                disabled={processing}
              >
                <FiX className="mr-2 h-4 w-4" />
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl hover:from-red-700 hover:to-pink-700 transition-all duration-200 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                disabled={processing || refundAmount <= 0 || refundAmount > payment.amount}
              >
                {processing ? (
                  <>
                    <FiLoader className="animate-spin mr-2 h-4 w-4" />
                    Processing...
                  </>
                ) : (
                  <>
                    <FiCheck className="mr-2 h-4 w-4" />
                    Process Refund ({formatCurrency(refundAmount)})
                  </>
                )}
              </button>
            </div>
          </div>
      </div>
    </div>
  )
}

export default RefundModal