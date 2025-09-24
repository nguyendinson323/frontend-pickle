import React from 'react'
import {
  FiCreditCard,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiRefreshCw,
  FiCalendar,
  FiDollarSign,
  FiArrowRight,
  FiHome,
  FiGift,
  FiInbox
} from 'react-icons/fi'

interface Payment {
  id: number
  user_id: number
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  payment_type: string
  payment_method: string
  reference_type: string
  reference_id: number | null
  stripe_payment_id: string | null
  transaction_date?: string
  created_at: string
  updated_at: string
}

interface PaymentHistoryProps {
  payments: Payment[]
}

const PaymentHistory: React.FC<PaymentHistoryProps> = ({ payments }) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          gradient: 'from-green-500 to-emerald-600',
          bgGradient: 'from-green-50 to-emerald-50',
          border: 'border-green-200',
          icon: FiCheckCircle,
          textColor: 'text-green-800'
        }
      case 'pending':
        return {
          gradient: 'from-yellow-500 to-orange-600',
          bgGradient: 'from-yellow-50 to-orange-50',
          border: 'border-yellow-200',
          icon: FiClock,
          textColor: 'text-yellow-800'
        }
      case 'failed':
        return {
          gradient: 'from-red-500 to-pink-600',
          bgGradient: 'from-red-50 to-pink-50',
          border: 'border-red-200',
          icon: FiXCircle,
          textColor: 'text-red-800'
        }
      case 'refunded':
        return {
          gradient: 'from-gray-500 to-gray-600',
          bgGradient: 'from-gray-50 to-slate-50',
          border: 'border-gray-200',
          icon: FiRefreshCw,
          textColor: 'text-gray-800'
        }
      default:
        return {
          gradient: 'from-gray-500 to-gray-600',
          bgGradient: 'from-gray-50 to-slate-50',
          border: 'border-gray-200',
          icon: FiClock,
          textColor: 'text-gray-800'
        }
    }
  }

  const getPaymentMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case 'credit card':
      case 'card':
        return FiCreditCard
      case 'bank transfer':
        return FiHome
      case 'paypal':
        return FiGift
      default:
        return FiCreditCard
    }
  }

  if (payments.length === 0) {
    return (
      <div className="bg-gradient-to-br from-white to-gray-50 shadow-xl rounded-3xl border-2 border-gray-100 p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiCreditCard className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment History</h2>
          <p className="text-gray-600 font-medium">Track all your membership payments</p>
        </div>
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <FiInbox className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">No Payment History</h3>
          <p className="text-gray-600 font-medium">Your payment transactions will appear here once you make a purchase.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 shadow-xl rounded-3xl border-2 border-gray-100 p-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <FiCreditCard className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment History</h2>
        <p className="text-gray-600 font-medium">Track all your membership payments</p>
      </div>

      <div className="space-y-6">
        {payments.map((payment) => {
          const statusConfig = getStatusConfig(payment.status)
          const StatusIcon = statusConfig.icon
          const PaymentMethodIcon = getPaymentMethodIcon(payment.payment_method)

          return (
            <div
              key={payment.id}
              className={`bg-gradient-to-r ${statusConfig.bgGradient} border-2 ${statusConfig.border} rounded-3xl p-6 hover:shadow-lg transition-all duration-300 hover:transform hover:scale-105`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className={`w-16 h-16 bg-gradient-to-r ${statusConfig.gradient} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                    <PaymentMethodIcon className="w-8 h-8 text-white" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-lg font-bold text-gray-900">
                        {payment.payment_type.charAt(0).toUpperCase() + payment.payment_type.slice(1)} Payment
                      </h3>
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r ${statusConfig.gradient} text-white shadow-lg`}>
                        <StatusIcon className="w-4 h-4 mr-2" />
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center text-gray-700">
                        <FiCreditCard className="w-4 h-4 mr-2 text-indigo-500" />
                        <span className="font-medium">Method:</span>
                        <span className="ml-1">{payment.payment_method}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <FiCalendar className="w-4 h-4 mr-2 text-blue-500" />
                        <span className="font-medium">Date:</span>
                        <span className="ml-1">{formatDate(payment.created_at)}</span>
                      </div>
                      {payment.reference_type && (
                        <div className="flex items-center text-gray-700">
                          <FiArrowRight className="w-4 h-4 mr-2 text-green-500" />
                          <span className="font-medium">Reference:</span>
                          <span className="ml-1">
                            {payment.reference_type}
                            {payment.reference_id && ` #${payment.reference_id}`}
                          </span>
                        </div>
                      )}
                      {payment.stripe_payment_id && (
                        <div className="flex items-start text-gray-500 col-span-full">
                          <span className="text-xs font-mono bg-gray-100 border border-gray-200 rounded-lg px-2 py-1 break-all">
                            ID: {payment.stripe_payment_id}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right flex-shrink-0 ml-4">
                  <div className="flex items-center justify-end mb-2">
                    <FiDollarSign className="w-5 h-5 text-green-500 mr-1" />
                    <div className="text-2xl font-bold text-gray-900">
                      {payment.amount.toFixed(2)}
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-600 bg-gray-100 border border-gray-200 rounded-full px-3 py-1">
                    {payment.currency.toUpperCase()}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {payments.length >= 10 && (
        <div className="mt-8 text-center">
          <button className="inline-flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 border border-transparent rounded-2xl shadow-xl py-3 px-6 text-base font-bold text-white hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 hover:transform hover:scale-105">
            <FiArrowRight className="w-5 h-5 mr-2" />
            View All Payments
          </button>
        </div>
      )}
    </div>
  )
}

export default PaymentHistory