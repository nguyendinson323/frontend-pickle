import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'

const PaymentStats: React.FC = () => {
  const { paymentStats } = useSelector((state: RootState) => state.adminPayments)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const stats = [
    {
      name: 'Total Revenue',
      value: formatCurrency(paymentStats.totalRevenue),
      icon: '💰',
      color: 'bg-green-50 border-green-200 text-green-800'
    },
    {
      name: 'Total Transactions',
      value: paymentStats.totalTransactions.toLocaleString(),
      icon: '📊',
      color: 'bg-blue-50 border-blue-200 text-blue-800'
    },
    {
      name: 'Successful Payments',
      value: paymentStats.successfulPayments.toLocaleString(),
      icon: '✅',
      color: 'bg-green-50 border-green-200 text-green-800'
    },
    {
      name: 'Failed Payments',
      value: paymentStats.failedPayments.toLocaleString(),
      icon: '❌',
      color: 'bg-red-50 border-red-200 text-red-800'
    },
    {
      name: 'Pending Payments',
      value: paymentStats.pendingPayments.toLocaleString(),
      icon: '⏳',
      color: 'bg-yellow-50 border-yellow-200 text-yellow-800'
    },
    {
      name: 'Average Transaction',
      value: formatCurrency(paymentStats.averageTransactionValue),
      icon: '📈',
      color: 'bg-purple-50 border-purple-200 text-purple-800'
    }
  ]

  const periodStats = [
    {
      name: 'Today',
      value: formatCurrency(paymentStats.todayRevenue),
      icon: '📅'
    },
    {
      name: 'This Week',
      value: formatCurrency(paymentStats.thisWeekRevenue),
      icon: '📅'
    },
    {
      name: 'This Month',
      value: formatCurrency(paymentStats.thisMonthRevenue),
      icon: '📅'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.name} className={`rounded-lg border p-4 ${stat.color}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-75">{stat.name}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
              <span className="text-3xl">{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Period Revenue */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Period</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {periodStats.map((stat) => (
            <div key={stat.name} className=" rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.name}</p>
                  <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <span className="text-2xl">{stat.icon}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Methods */}
      {paymentStats.topPaymentMethods.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Payment Methods</h3>
          <div className="space-y-3">
            {paymentStats.topPaymentMethods.slice(0, 5).map((method) => (
              <div key={method.method} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-medium text-indigo-800">
                        {method.method.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 capitalize">
                      {method.method.replace('_', ' ')}
                    </p>
                    <p className="text-sm text-gray-500">
                      {method.count.toLocaleString()} transactions
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {method.percentage.toFixed(1)}%
                  </p>
                  <div className="w-20 h-2 bg-gray-200 rounded-full mt-1">
                    <div 
                      className="h-2 bg-indigo-600 rounded-full"
                      style={{ width: `${method.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Revenue Trend */}
      {paymentStats.revenueByPeriod.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend (Last 12 Months)</h3>
          <div className="space-y-3">
            {paymentStats.revenueByPeriod.slice(-6).map((period) => (
              <div key={period.period} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{period.period}</p>
                  <p className="text-sm text-gray-500">
                    {period.transactions.toLocaleString()} transactions
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">
                    {formatCurrency(period.revenue)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default PaymentStats