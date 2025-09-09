import React from 'react'
import { Payment } from '../../../store/slices/adminPaymentsSlice'

interface PaymentDetailsModalProps {
  payment: Payment
  onClose: () => void
}

const PaymentDetailsModal: React.FC<PaymentDetailsModalProps> = ({ payment, onClose }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      case 'refunded':
        return 'bg-purple-100 text-purple-800'
      case 'cancelled':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Payment Details</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          {/* Basic Payment Info */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Transaction Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Payment ID</p>
                <p className="text-lg font-semibold text-gray-900">#{payment.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full capitalize ${getStatusColor(payment.status)}`}>
                  {payment.status}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Amount</p>
                <p className="text-lg font-semibold text-gray-900">{formatCurrency(payment.amount)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Currency</p>
                <p className="text-lg font-semibold text-gray-900">{payment.currency || 'USD'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Payment Method</p>
                <p className="text-lg font-semibold text-gray-900 capitalize">
                  {payment.payment_method.replace('_', ' ')}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Transaction ID</p>
                <p className="text-sm text-gray-900 font-mono">
                  {payment.transaction_id || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          {payment.user && (
            <div className="bg-blue-50 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Name</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {payment.user.first_name} {payment.user.last_name}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-lg font-semibold text-gray-900">{payment.user.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">User ID</p>
                  <p className="text-lg font-semibold text-gray-900">#{payment.user.id}</p>
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          {payment.description && (
            <div className="bg-green-50 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Description</h4>
              <p className="text-gray-700">{payment.description}</p>
            </div>
          )}

          {/* Timestamps */}
          <div className="bg-purple-50 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Created</p>
                <p className="text-lg font-semibold text-gray-900">{formatDate(payment.created_at)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Last Updated</p>
                <p className="text-lg font-semibold text-gray-900">{formatDate(payment.updated_at)}</p>
              </div>
            </div>
          </div>

          {/* Metadata */}
          {payment.metadata && Object.keys(payment.metadata).length > 0 && (
            <div className="bg-yellow-50 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h4>
              <div className="space-y-3">
                {Object.entries(payment.metadata).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-start">
                    <p className="text-sm font-medium text-gray-500 capitalize">
                      {key.replace('_', ' ')}:
                    </p>
                    <p className="text-sm text-gray-900 text-right max-w-xs break-words">
                      {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Refund Information */}
          {payment.status === 'refunded' && payment.metadata?.refund && (
            <div className="bg-red-50 rounded-lg p-6 border border-red-200">
              <h4 className="text-lg font-semibold text-red-900 mb-4">Refund Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-red-700">Refund Amount</p>
                  <p className="text-lg font-semibold text-red-900">
                    {formatCurrency(payment.metadata.refund.amount)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-red-700">Reason</p>
                  <p className="text-sm text-red-900">{payment.metadata.refund.reason}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-red-700">Processed At</p>
                  <p className="text-sm text-red-900">
                    {formatDate(payment.metadata.refund.processed_at)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default PaymentDetailsModal