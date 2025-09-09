import React from 'react'

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      case 'refunded':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case 'credit card':
      case 'card':
        return '💳'
      case 'bank transfer':
        return '🏦'
      case 'paypal':
        return '💰'
      default:
        return '💳'
    }
  }

  if (payments.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Payment History</h2>
        <div className="text-center py-8">
          <div className="text-gray-500">
            <div className="text-4xl mb-2">💳</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Payment History</h3>
            <p className="text-gray-600">Your payment transactions will appear here once you make a purchase.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Payment History</h2>
      
      <div className="overflow-hidden">
        <div className="divide-y divide-gray-200">
          {payments.map((payment) => (
            <div key={payment.id} className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">{getPaymentMethodIcon(payment.payment_method)}</div>
                  
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-medium text-gray-900">
                        {payment.payment_type.charAt(0).toUpperCase() + payment.payment_type.slice(1)} Payment
                      </h3>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>
                        <span className="font-medium">Method:</span> {payment.payment_method}
                      </div>
                      <div>
                        <span className="font-medium">Date:</span> {formatDate(payment.created_at)}
                      </div>
                      {payment.reference_type && (
                        <div>
                          <span className="font-medium">Reference:</span> {payment.reference_type}
                          {payment.reference_id && ` #${payment.reference_id}`}
                        </div>
                      )}
                      {payment.stripe_payment_id && (
                        <div className="font-mono text-xs text-gray-500">
                          ID: {payment.stripe_payment_id}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-lg font-semibold text-gray-900">
                    ${payment.amount.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {payment.currency.toUpperCase()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {payments.length >= 10 && (
        <div className="mt-4 text-center">
          <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
            View All Payments
          </button>
        </div>
      )}
    </div>
  )
}

export default PaymentHistory