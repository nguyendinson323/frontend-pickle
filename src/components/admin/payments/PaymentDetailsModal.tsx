import React from 'react'
import { Payment } from '../../../store/slices/adminPaymentsSlice'
import {
  FiX,
  FiCreditCard,
  FiDollarSign,
  FiUser,
  FiFileText,
  FiCalendar,
  FiInfo,
  FiRefreshCw,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiAlertCircle
} from 'react-icons/fi'

interface PaymentDetailsModalProps {
  payment: Payment
  onClose: () => void
}

const PaymentDetailsModal: React.FC<PaymentDetailsModalProps> = ({ payment, onClose }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-2 border-green-300'
      case 'pending':
        return 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-2 border-yellow-300'
      case 'failed':
        return 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-2 border-red-300'
      case 'refunded':
        return 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border-2 border-purple-300'
      case 'cancelled':
        return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-2 border-gray-300'
      default:
        return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-2 border-gray-300'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return FiCheckCircle
      case 'pending':
        return FiClock
      case 'failed':
        return FiXCircle
      case 'refunded':
        return FiRefreshCw
      case 'cancelled':
        return FiXCircle
      default:
        return FiClock
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl bg-white shadow-2xl rounded-3xl border border-gray-100 max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-6 rounded-t-3xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <FiCreditCard className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Payment Details</h3>
                <p className="text-indigo-100 font-medium">Transaction #{payment.id}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-xl flex items-center justify-center transition-all duration-200 transform hover:scale-105"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Basic Payment Info */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-2xl p-6 border-2 border-blue-200 shadow-lg">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white mr-3">
                <FiCreditCard className="h-5 w-5" />
              </div>
              <h4 className="text-xl font-bold text-gray-900">Transaction Information</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-4 shadow-md border border-blue-200">
                <p className="text-sm font-bold text-blue-600 mb-2">Payment ID</p>
                <p className="text-2xl font-bold text-gray-900">#{payment.id}</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-md border border-blue-200">
                <p className="text-sm font-bold text-blue-600 mb-2">Status</p>
                {(() => {
                  const StatusIcon = getStatusIcon(payment.status)
                  return (
                    <span className={`inline-flex items-center px-4 py-2 text-sm font-bold rounded-xl capitalize shadow-lg ${getStatusColor(payment.status)}`}>
                      <StatusIcon className="mr-2 h-4 w-4" />
                      {payment.status}
                    </span>
                  )
                })()}
              </div>
              <div className="bg-white rounded-xl p-4 shadow-md border border-blue-200">
                <p className="text-sm font-bold text-blue-600 mb-2">Amount</p>
                <div className="flex items-center space-x-2">
                  <FiDollarSign className="h-5 w-5 text-green-600" />
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(payment.amount)}</p>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-md border border-blue-200">
                <p className="text-sm font-bold text-blue-600 mb-2">Currency</p>
                <p className="text-2xl font-bold text-gray-900">{payment.currency || 'MXN'}</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-md border border-blue-200">
                <p className="text-sm font-bold text-blue-600 mb-2">Payment Method</p>
                <p className="text-lg font-bold text-gray-900 capitalize">
                  {payment.payment_method ? payment.payment_method.replace('_', ' ') : 'N/A'}
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-md border border-blue-200">
                <p className="text-sm font-bold text-blue-600 mb-2">Transaction ID</p>
                <p className="text-sm text-gray-900 font-mono break-all">
                  {payment.transaction_id || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          {payment.user && (
            <div className="bg-gradient-to-r from-purple-50 to-pink-100 rounded-2xl p-6 border-2 border-purple-200 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white mr-3">
                  <FiUser className="h-5 w-5" />
                </div>
                <h4 className="text-xl font-bold text-gray-900">Customer Information</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-4 shadow-md border border-purple-200">
                  <p className="text-sm font-bold text-purple-600 mb-2">Name</p>
                  <p className="text-xl font-bold text-gray-900">
                    {payment.user.username}
                  </p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-md border border-purple-200">
                  <p className="text-sm font-bold text-purple-600 mb-2">Email</p>
                  <p className="text-lg font-bold text-gray-900 break-all">{payment.user.email}</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-md border border-purple-200 md:col-span-2">
                  <p className="text-sm font-bold text-purple-600 mb-2">User ID</p>
                  <p className="text-xl font-bold text-gray-900">#{payment.user.id}</p>
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          {payment.description && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-100 rounded-2xl p-6 border-2 border-green-200 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white mr-3">
                  <FiFileText className="h-5 w-5" />
                </div>
                <h4 className="text-xl font-bold text-gray-900">Description</h4>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-md border border-green-200">
                <p className="text-gray-700 font-medium leading-relaxed">{payment.description}</p>
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="bg-gradient-to-r from-orange-50 to-yellow-100 rounded-2xl p-6 border-2 border-orange-200 shadow-lg">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white mr-3">
                <FiCalendar className="h-5 w-5" />
              </div>
              <h4 className="text-xl font-bold text-gray-900">Timeline</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-4 shadow-md border border-orange-200">
                <p className="text-sm font-bold text-orange-600 mb-2">Created</p>
                <p className="text-lg font-bold text-gray-900">{formatDate(payment.created_at)}</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-md border border-orange-200">
                <p className="text-sm font-bold text-orange-600 mb-2">Last Updated</p>
                <p className="text-lg font-bold text-gray-900">{formatDate(payment.updated_at)}</p>
              </div>
            </div>
          </div>

          {/* Metadata */}
          {payment.metadata && Object.keys(payment.metadata).length > 0 && (
            <div className="bg-gradient-to-r from-cyan-50 to-blue-100 rounded-2xl p-6 border-2 border-cyan-200 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center text-white mr-3">
                  <FiInfo className="h-5 w-5" />
                </div>
                <h4 className="text-xl font-bold text-gray-900">Additional Information</h4>
              </div>
              <div className="space-y-4">
                {Object.entries(payment.metadata).map(([key, value]) => (
                  <div key={key} className="bg-white rounded-xl p-4 shadow-md border border-cyan-200">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-2 sm:space-y-0">
                      <p className="text-sm font-bold text-cyan-600 capitalize">
                        {key.replace('_', ' ')}:
                      </p>
                      <p className="text-sm text-gray-900 font-medium break-all max-w-xs">
                        {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Refund Information */}
          {payment.status === 'refunded' && payment.metadata?.refund && (
            <div className="bg-gradient-to-r from-red-50 to-pink-100 rounded-2xl p-6 border-2 border-red-200 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center text-white mr-3">
                  <FiAlertCircle className="h-5 w-5" />
                </div>
                <h4 className="text-xl font-bold text-red-900">Refund Information</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-4 shadow-md border border-red-200">
                  <p className="text-sm font-bold text-red-600 mb-2">Refund Amount</p>
                  <div className="flex items-center space-x-2">
                    <FiRefreshCw className="h-5 w-5 text-red-600" />
                    <p className="text-xl font-bold text-red-900">
                      {formatCurrency(payment.metadata.refund.amount)}
                    </p>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-md border border-red-200">
                  <p className="text-sm font-bold text-red-600 mb-2">Reason</p>
                  <p className="text-lg font-bold text-red-900">{payment.metadata.refund.reason}</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-md border border-red-200 md:col-span-2">
                  <p className="text-sm font-bold text-red-600 mb-2">Processed At</p>
                  <p className="text-lg font-bold text-red-900">
                    {formatDate(payment.metadata.refund.processed_at)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        </div>

        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-t-2 border-gray-200 rounded-b-3xl">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-200 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <FiX className="mr-2 h-4 w-4" />
              Close
            </button>
          </div>
        </div>
      </div>
  )
}

export default PaymentDetailsModal