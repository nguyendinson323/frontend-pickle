import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'
import {
  FiSend,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiMail,
  FiSmartphone,
  FiBell,
  FiBarChart,
  FiTrendingUp
} from 'react-icons/fi'

const MessageStats: React.FC = () => {
  const { messageStats } = useSelector((state: RootState) => state.adminMessaging)

  const statsConfig = [
    {
      label: 'Total Sent',
      value: messageStats.totalSent,
      color: 'from-blue-500 to-blue-600',
      bgGradient: 'bg-gradient-to-br from-blue-50 to-blue-100',
      borderColor: 'border-blue-200',
      icon: FiSend,
      change: '+12%',
      changeType: 'increase'
    },
    {
      label: 'Total Delivered',
      value: messageStats.totalDelivered,
      color: 'from-green-500 to-green-600',
      bgGradient: 'bg-gradient-to-br from-green-50 to-green-100',
      borderColor: 'border-green-200',
      icon: FiCheckCircle,
      change: '+8%',
      changeType: 'increase'
    },
    {
      label: 'Total Failed',
      value: messageStats.totalFailed,
      color: 'from-red-500 to-red-600',
      bgGradient: 'bg-gradient-to-br from-red-50 to-red-100',
      borderColor: 'border-red-200',
      icon: FiXCircle,
      change: '-3%',
      changeType: 'decrease'
    },
    {
      label: 'Total Pending',
      value: messageStats.totalPending,
      color: 'from-yellow-500 to-yellow-600',
      bgGradient: 'bg-gradient-to-br from-yellow-50 to-yellow-100',
      borderColor: 'border-yellow-200',
      icon: FiClock,
      change: '+5%',
      changeType: 'increase'
    },
  ]

  const deliveryMethodsConfig = [
    {
      label: 'Emails Sent',
      value: messageStats.emailsSent,
      color: 'from-purple-500 to-purple-600',
      bgGradient: 'bg-gradient-to-br from-purple-50 to-purple-100',
      borderColor: 'border-purple-200',
      icon: FiMail,
      percentage: messageStats.totalSent > 0 ? ((messageStats.emailsSent / messageStats.totalSent) * 100).toFixed(1) : 0
    },
    {
      label: 'SMS Sent',
      value: messageStats.smsSent,
      color: 'from-indigo-500 to-indigo-600',
      bgGradient: 'bg-gradient-to-br from-indigo-50 to-indigo-100',
      borderColor: 'border-indigo-200',
      icon: FiSmartphone,
      percentage: messageStats.totalSent > 0 ? ((messageStats.smsSent / messageStats.totalSent) * 100).toFixed(1) : 0
    },
    {
      label: 'In-App Sent',
      value: messageStats.inAppSent,
      color: 'from-teal-500 to-teal-600',
      bgGradient: 'bg-gradient-to-br from-teal-50 to-teal-100',
      borderColor: 'border-teal-200',
      icon: FiBell,
      percentage: messageStats.totalSent > 0 ? ((messageStats.inAppSent / messageStats.totalSent) * 100).toFixed(1) : 0
    },
  ]

  const calculateDeliveryRate = () => {
    const total = messageStats.totalDelivered + messageStats.totalFailed + messageStats.totalPending
    return total > 0 ? ((messageStats.totalDelivered / total) * 100).toFixed(1) : 0
  }

  return (
    <div className="mb-8">
      {/* Main Statistics */}
      <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
              <FiBarChart className="mr-2 h-5 w-5" />
              Messaging Statistics
            </h3>
            <div className="flex items-center bg-green-100 px-4 py-2 rounded-xl">
              <FiTrendingUp className="mr-2 h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">
                Delivery Rate: <span className="font-bold">{calculateDeliveryRate()}%</span>
              </span>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsConfig.map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <div
                  key={stat.label}
                  className={`relative p-6 rounded-2xl border-2 ${stat.borderColor} ${stat.bgGradient} transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                      {stat.value.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-gray-700 mb-2">{stat.label}</div>
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

      {/* Delivery Methods Statistics */}
      <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <FiSend className="mr-2 h-5 w-5" />
            Messages by Delivery Method
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {deliveryMethodsConfig.map((method, index) => {
              const IconComponent = method.icon
              return (
                <div
                  key={method.label}
                  className={`relative p-6 rounded-2xl border-2 ${method.borderColor} ${method.bgGradient} transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${method.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div className={`text-3xl font-bold bg-gradient-to-r ${method.color} bg-clip-text text-transparent`}>
                      {method.value.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-gray-700 mb-2">{method.label}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">of total messages</span>
                    <span className="text-sm font-bold text-gray-700">{method.percentage}%</span>
                  </div>
                  <div className="mt-3 bg-gray-200 rounded-full h-2">
                    <div
                      className={`bg-gradient-to-r ${method.color} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${method.percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MessageStats