import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'
import {
  FiDollarSign,
  FiBarChart2,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiTrendingUp,
  FiCalendar,
  FiCreditCard,
  FiLoader
} from 'react-icons/fi'

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
      icon: FiDollarSign,
      color: 'from-green-500 to-green-600',
      bgGradient: 'bg-gradient-to-br from-green-50 to-green-100',
      borderColor: 'border-green-200',
      change: '+15.3%',
      changeType: 'increase'
    },
    {
      name: 'Total Transactions',
      value: paymentStats.totalTransactions.toLocaleString(),
      icon: FiBarChart2,
      color: 'from-blue-500 to-blue-600',
      bgGradient: 'bg-gradient-to-br from-blue-50 to-blue-100',
      borderColor: 'border-blue-200',
      change: '+8.2%',
      changeType: 'increase'
    },
    {
      name: 'Successful Payments',
      value: paymentStats.successfulPayments.toLocaleString(),
      icon: FiCheckCircle,
      color: 'from-emerald-500 to-emerald-600',
      bgGradient: 'bg-gradient-to-br from-emerald-50 to-emerald-100',
      borderColor: 'border-emerald-200',
      change: '+12.1%',
      changeType: 'increase'
    },
    {
      name: 'Failed Payments',
      value: paymentStats.failedPayments.toLocaleString(),
      icon: FiXCircle,
      color: 'from-red-500 to-red-600',
      bgGradient: 'bg-gradient-to-br from-red-50 to-red-100',
      borderColor: 'border-red-200',
      change: '-5.7%',
      changeType: 'decrease'
    },
    {
      name: 'Pending Payments',
      value: paymentStats.pendingPayments.toLocaleString(),
      icon: FiClock,
      color: 'from-yellow-500 to-yellow-600',
      bgGradient: 'bg-gradient-to-br from-yellow-50 to-yellow-100',
      borderColor: 'border-yellow-200',
      change: '+2.1%',
      changeType: 'increase'
    },
    {
      name: 'Average Transaction',
      value: formatCurrency(paymentStats.averageTransactionValue),
      icon: FiTrendingUp,
      color: 'from-purple-500 to-purple-600',
      bgGradient: 'bg-gradient-to-br from-purple-50 to-purple-100',
      borderColor: 'border-purple-200',
      change: '+9.8%',
      changeType: 'increase'
    }
  ]

  const periodStats = [
    {
      name: 'Today',
      value: formatCurrency(paymentStats.todayRevenue),
      icon: FiCalendar,
      color: 'from-cyan-500 to-cyan-600',
      change: '+12.5%'
    },
    {
      name: 'This Week',
      value: formatCurrency(paymentStats.thisWeekRevenue),
      icon: FiCalendar,
      color: 'from-indigo-500 to-indigo-600',
      change: '+8.7%'
    },
    {
      name: 'This Month',
      value: formatCurrency(paymentStats.thisMonthRevenue),
      icon: FiCalendar,
      color: 'from-pink-500 to-pink-600',
      change: '+15.2%'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Main Stats */}
      <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <FiBarChart2 className="mr-2 h-5 w-5" />
            Payment Statistics
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <div
                  key={stat.name}
                  className={`relative p-6 rounded-2xl border-2 ${stat.borderColor} ${stat.bgGradient} transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                      {stat.value}
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-gray-700 mb-2">{stat.name}</div>
                  <div className={`flex items-center text-xs font-medium ${
                    stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <FiTrendingUp className={`mr-1 h-3 w-3 ${
                      stat.changeType === 'decrease' ? 'transform rotate-180' : ''
                    }`} />
                    {stat.change} from last week
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Period Revenue */}
      <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <FiCalendar className="mr-2 h-5 w-5" />
            Revenue by Period
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {periodStats.map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <div key={stat.name} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div className="flex items-center text-xs font-medium text-green-600">
                      <FiTrendingUp className="mr-1 h-3 w-3" />
                      {stat.change}
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-gray-600 mb-2">{stat.name}</div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      {paymentStats.topPaymentMethods.length > 0 && (
        <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
              <FiCreditCard className="mr-2 h-5 w-5" />
              Popular Payment Methods
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {paymentStats.topPaymentMethods.slice(0, 5).map((method, index) => (
                <div key={method.method} className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-4 border border-gray-200 hover:shadow-lg transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                          <span className="text-lg font-bold text-white">
                            {method.method.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-gray-900 capitalize">
                          {method.method.replace('_', ' ')}
                        </p>
                        <p className="text-sm text-gray-600 font-medium">
                          {method.count.toLocaleString()} transactions
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-indigo-600">
                        {method.percentage.toFixed(1)}%
                      </p>
                      <div className="w-24 h-3 bg-gray-200 rounded-full mt-2 shadow-inner">
                        <div
                          className="h-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full shadow-lg transition-all duration-500"
                          style={{ width: `${method.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Revenue Trend */}
      {paymentStats.revenueByPeriod.length > 0 && (
        <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
              <FiTrendingUp className="mr-2 h-5 w-5" />
              Revenue Trend (Last 6 Months)
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {paymentStats.revenueByPeriod.slice(-6).map((period, index) => (
                <div key={period.period} className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-4 border border-gray-200 hover:shadow-lg transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-lg font-bold text-gray-900">{period.period}</p>
                        <p className="text-sm text-gray-600 font-medium">
                          {period.transactions.toLocaleString()} transactions
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-emerald-600">
                        {formatCurrency(period.revenue)}
                      </p>
                      <div className="flex items-center text-xs text-green-600 font-medium mt-1">
                        <FiTrendingUp className="mr-1 h-3 w-3" />
                        Growth trend
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PaymentStats