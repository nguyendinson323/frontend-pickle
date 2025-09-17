import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../../store'
import { fetchPaymentMethods } from '../../../store/slices/adminPaymentsSlice'
import {
  FiCreditCard,
  FiLoader,
  FiUser,
  FiSettings,
  FiCalendar,
  FiStar,
  FiCheckCircle,
  FiUsers,
  FiBarChart2
} from 'react-icons/fi'

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
      case 'visa':
      case 'mastercard':
      case 'amex':
        return FiCreditCard
      case 'paypal':
        return FiSettings
      default:
        return FiSettings
    }
  }

  const getBrandColor = (brand: string) => {
    switch (brand?.toLowerCase()) {
      case 'visa':
        return 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-2 border-blue-300'
      case 'mastercard':
        return 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-2 border-red-300'
      case 'amex':
        return 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-2 border-green-300'
      case 'discover':
        return 'bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 border-2 border-orange-300'
      default:
        return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-2 border-gray-300'
    }
  }

  const getBrandGradient = (brand: string) => {
    switch (brand?.toLowerCase()) {
      case 'visa':
        return 'from-blue-500 to-blue-600'
      case 'mastercard':
        return 'from-red-500 to-red-600'
      case 'amex':
        return 'from-green-500 to-green-600'
      case 'discover':
        return 'from-orange-500 to-orange-600'
      default:
        return 'from-gray-500 to-gray-600'
    }
  }

  if (isLoading && paymentMethods.length === 0) {
    return (
      <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <FiSettings className="mr-2 h-5 w-5" />
            Payment Methods
          </h3>
        </div>
        <div className="p-12">
          <div className="flex items-center justify-center text-center">
            <div>
              <FiLoader className="animate-spin h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <p className="text-xl font-semibold text-gray-700">Loading payment methods...</p>
              <p className="text-sm text-gray-500 mt-2">Please wait while we fetch the payment methods</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white mr-3">
              <FiSettings className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Payment Methods</h3>
          </div>
          <div className="flex items-center space-x-3">
            <div className="bg-white rounded-xl px-4 py-2 shadow-md border border-gray-200">
              <span className="text-sm font-bold text-indigo-600">
                {paymentMethods.length} registered methods
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {paymentMethods.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-lg">
            <FiSettings className="h-10 w-10" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No payment methods found</h3>
          <p className="text-lg text-gray-600 font-medium">
            No registered payment methods found in the system.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Payment methods will appear here once users add them to their accounts.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-100 to-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                  Provider
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                  Card Details
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                  Added
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paymentMethods.map((method, index) => (
                <tr key={method.id} className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-200" style={{ animationDelay: `${index * 50}ms` }}>
                  <td className="px-6 py-6 whitespace-nowrap">
                    {method.user ? (
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                          <FiUser className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-lg font-bold text-gray-900">
                            {method.user.username}
                          </div>
                          <div className="text-sm text-gray-500 font-medium">
                            {method.user.email}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-500 rounded-xl flex items-center justify-center text-white">
                          <FiUser className="h-5 w-5" />
                        </div>
                        <span className="text-lg font-medium text-gray-500">Unknown User</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                        {(() => {
                          const IconComponent = getProviderIcon(method.provider)
                          return <IconComponent className="h-5 w-5" />
                        })()}
                      </div>
                      <div>
                        <div className="text-lg font-bold text-gray-900 capitalize">
                          {method.provider}
                        </div>
                        <div className="text-sm text-gray-500 font-medium">
                          ID: {method.provider_id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 bg-gradient-to-br ${getBrandGradient(method.card_brand)} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                        <FiCreditCard className="h-5 w-5" />
                      </div>
                      <div>
                        <span className={`inline-flex items-center px-3 py-1 rounded-xl text-sm font-bold shadow-md ${getBrandColor(method.card_brand)}`}>
                          {method.card_brand?.toUpperCase() || 'UNKNOWN'}
                        </span>
                        <div className="text-lg font-bold text-gray-900 font-mono mt-1">
                          •••• •••• •••• {method.card_last_four}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    <div className="flex items-center">
                      {method.is_default ? (
                        <span className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-2 border-yellow-300 shadow-lg">
                          <FiStar className="mr-2 h-4 w-4" />
                          Default
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-2 border-green-300 shadow-lg">
                          <FiCheckCircle className="mr-2 h-4 w-4" />
                          Active
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center text-white">
                        <FiCalendar className="h-4 w-4" />
                      </div>
                      <div className="text-sm font-bold text-gray-900">
                        {formatDate(method.created_at)}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Stats Summary */}
      {paymentMethods.length > 0 && (
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-6 border-t-2 border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-200 transform hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white mx-auto mb-3 shadow-lg">
                <FiBarChart2 className="h-6 w-6" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {paymentMethods.length}
              </div>
              <div className="text-sm font-semibold text-gray-600">Total Methods</div>
            </div>
            <div className="text-center bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-200 transform hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white mx-auto mb-3 shadow-lg">
                <FiUsers className="h-6 w-6" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {new Set(paymentMethods.map(m => m.user_id)).size}
              </div>
              <div className="text-sm font-semibold text-gray-600">Unique Users</div>
            </div>
            <div className="text-center bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-200 transform hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center text-white mx-auto mb-3 shadow-lg">
                <FiStar className="h-6 w-6" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {paymentMethods.filter(m => m.is_default).length}
              </div>
              <div className="text-sm font-semibold text-gray-600">Default Methods</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PaymentMethods