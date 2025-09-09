import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'

const MessageStats: React.FC = () => {
  const { messageStats } = useSelector((state: RootState) => state.adminMessaging)

  const statsConfig = [
    { 
      label: 'Total Sent', 
      value: messageStats.totalSent, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      icon: '📤'
    },
    { 
      label: 'Total Delivered', 
      value: messageStats.totalDelivered, 
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      icon: '✅'
    },
    { 
      label: 'Total Failed', 
      value: messageStats.totalFailed, 
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      icon: '❌'
    },
    { 
      label: 'Total Pending', 
      value: messageStats.totalPending, 
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      icon: '⏳'
    },
  ]

  const deliveryMethodsConfig = [
    { 
      label: 'Emails Sent', 
      value: messageStats.emailsSent, 
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      icon: '📧'
    },
    { 
      label: 'SMS Sent', 
      value: messageStats.smsSent, 
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      icon: '📱'
    },
    { 
      label: 'In-App Sent', 
      value: messageStats.inAppSent, 
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-200',
      icon: '🔔'
    },
  ]

  const calculateDeliveryRate = () => {
    const total = messageStats.totalDelivered + messageStats.totalFailed + messageStats.totalPending
    return total > 0 ? ((messageStats.totalDelivered / total) * 100).toFixed(1) : 0
  }

  return (
    <div className="mb-6">
      {/* Main Statistics */}
      <div className="bg-white shadow-sm rounded-lg p-6 mb-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Messaging Statistics</h3>
          <div className="text-sm text-gray-600">
            Overall delivery rate: <span className="font-semibold text-green-600">{calculateDeliveryRate()}%</span>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statsConfig.map((stat) => (
            <div
              key={stat.label}
              className={`p-4 rounded-lg border ${stat.bgColor} ${stat.borderColor}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{stat.icon}</span>
                <div className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value.toLocaleString()}
                </div>
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Methods Statistics */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Messages by Delivery Method</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {deliveryMethodsConfig.map((method) => (
            <div
              key={method.label}
              className={`p-4 rounded-lg border ${method.bgColor} ${method.borderColor}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{method.icon}</span>
                <div className={`text-2xl font-bold ${method.color}`}>
                  {method.value.toLocaleString()}
                </div>
              </div>
              <div className="text-sm text-gray-600">{method.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MessageStats