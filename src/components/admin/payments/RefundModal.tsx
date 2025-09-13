import React, { useState } from 'react'
import { Payment } from '../../../store/slices/adminPaymentsSlice'

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
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">Process Refund</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
            disabled={processing}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Payment Info */}
          <div className=" rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Payment Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Payment ID:</span>
                <span className="font-medium">#{payment.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Original Amount:</span>
                <span className="font-medium">{formatCurrency(payment.amount)}</span>
              </div>
              {payment.user && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Customer:</span>
                  <span className="font-medium">
                    {payment.user.username}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Refund Amount */}
          <div>
            <label htmlFor="refundAmount" className="block text-sm font-medium text-gray-700 mb-2">
              Refund Amount
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                id="refundAmount"
                step="0.01"
                min="0"
                max={payment.amount}
                value={refundAmount}
                onChange={(e) => setRefundAmount(parseFloat(e.target.value) || 0)}
                className="block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                required
                disabled={processing}
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Maximum refundable: {formatCurrency(payment.amount)}
            </p>
          </div>

          {/* Refund Reason */}
          <div>
            <label htmlFor="refundReason" className="block text-sm font-medium text-gray-700 mb-2">
              Refund Reason
            </label>
            <select
              id="refundReason"
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              required
              disabled={processing}
            >
              <option value="">Select a reason</option>
              <option value="duplicate_payment">Duplicate Payment</option>
              <option value="customer_request">Customer Request</option>
              <option value="fraudulent_transaction">Fraudulent Transaction</option>
              <option value="service_not_provided">Service Not Provided</option>
              <option value="tournament_cancelled">Tournament Cancelled</option>
              <option value="court_unavailable">Court Unavailable</option>
              <option value="technical_error">Technical Error</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Custom Reason */}
          {refundReason === 'other' && (
            <div>
              <label htmlFor="customReason" className="block text-sm font-medium text-gray-700 mb-2">
                Custom Reason
              </label>
              <textarea
                id="customReason"
                rows={3}
                placeholder="Please specify the reason for this refund..."
                onChange={(e) => setRefundReason(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                required
                disabled={processing}
              />
            </div>
          )}

          {/* Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Refund Warning
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    This action cannot be undone. The refund will be processed immediately
                    and the customer will be notified automatically.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={processing}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={processing || refundAmount <= 0 || refundAmount > payment.amount}
            >
              {processing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                `Process Refund (${formatCurrency(refundAmount)})`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RefundModal