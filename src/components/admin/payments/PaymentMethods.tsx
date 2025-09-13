import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../../store'
import { fetchPaymentMethods } from '../../../store/slices/adminPaymentsSlice'

const PaymentMethods: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { paymentMethods } = useSelector((state: RootState) => state.adminPayments)
  const { isLoading } = useSelector((state: RootState) => state.loading)

  useEffect(() => {
    dispatch(fetchPaymentMethods())
  }, [dispatch])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const getProviderIcon = (provider: string) => {
    switch (provider.toLowerCase()) {
      case 'stripe':
        return '💳'
      case 'paypal':
        return '💰'
      case 'visa':
        return '💳'
      case 'mastercard':
        return '💳'
      case 'amex':
        return '💳'
      default:
        return '🔧'
    }
  }

  const getBrandColor = (brand: string) => {
    switch (brand?.toLowerCase()) {
      case 'visa':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'mastercard':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'amex':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'discover':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (isLoading && paymentMethods.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="ml-2 text-gray-600">Loading payment methods...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Payment Methods</h3>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600">
              {paymentMethods.length} registered methods
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      {paymentMethods.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No payment methods found</h3>
          <p className="mt-1 text-sm text-gray-500">
            No registered payment methods found in the system.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Provider
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Card Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Added
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paymentMethods.map((method) => (
                <tr key={method.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {method.user ? (
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {method.user.username}
                        </div>
                        <div className="text-sm text-gray-500">
                          {method.user.email}
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">Unknown User</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="mr-2 text-xl">
                        {getProviderIcon(method.provider)}
                      </span>
                      <div>
                        <div className="text-sm font-medium text-gray-900 capitalize">
                          {method.provider}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {method.provider_id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getBrandColor(method.card_brand)}`}>
                        {method.card_brand?.toUpperCase() || 'UNKNOWN'}
                      </span>
                      <span className="ml-2 text-sm text-gray-900 font-mono">
                        •••• •••• •••• {method.card_last_four}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {method.is_default ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <span className="mr-1">⭐</span>
                          Default
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Active
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(method.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Stats Summary */}
      {paymentMethods.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {paymentMethods.length}
              </div>
              <div className="text-sm text-gray-600">Total Methods</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {new Set(paymentMethods.map(m => m.user_id)).size}
              </div>
              <div className="text-sm text-gray-600">Unique Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {paymentMethods.filter(m => m.is_default).length}
              </div>
              <div className="text-sm text-gray-600">Default Methods</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PaymentMethods