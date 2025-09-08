import React from 'react'

interface NotificationCardProps {
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  timestamp: string
  isRead?: boolean
  onRead?: () => void
  onDismiss?: () => void
  onClick?: () => void
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  title,
  message,
  type,
  timestamp,
  isRead = false,
  onRead,
  onDismiss,
  onClick
}) => {
  const getTypeStyles = () => {
    switch (type) {
      case 'success': return {
        bg: 'bg-green-50 border-green-200',
        icon: '✅',
        iconColor: 'text-green-600',
        titleColor: 'text-green-800'
      }
      case 'warning': return {
        bg: 'bg-yellow-50 border-yellow-200',
        icon: '⚠️',
        iconColor: 'text-yellow-600',
        titleColor: 'text-yellow-800'
      }
      case 'error': return {
        bg: 'bg-red-50 border-red-200',
        icon: '❌',
        iconColor: 'text-red-600',
        titleColor: 'text-red-800'
      }
      default: return {
        bg: 'bg-blue-50 border-blue-200',
        icon: 'ℹ️',
        iconColor: 'text-blue-600',
        titleColor: 'text-blue-800'
      }
    }
  }

  const styles = getTypeStyles()

  return (
    <div
      className={`relative p-4 border rounded-lg transition-all duration-200 ${styles.bg} ${
        !isRead ? 'border-l-4' : ''
      } ${onClick ? 'cursor-pointer hover:shadow-md' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-start">
        <div className={`text-xl mr-3 ${styles.iconColor}`}>
          {styles.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className={`font-semibold ${styles.titleColor} ${!isRead ? 'font-bold' : ''}`}>
              {title}
            </h4>
            <div className="flex items-center space-x-2 ml-2">
              {!isRead && (
                <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
              )}
              <span className="text-xs text-gray-500 whitespace-nowrap">
                {timestamp}
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-700 mt-1">{message}</p>
        </div>
      </div>

      <div className="flex justify-end space-x-2 mt-3">
        {!isRead && onRead && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onRead()
            }}
            className="text-xs text-indigo-600 hover:text-indigo-500 font-medium"
          >
            Mark as read
          </button>
        )}
        {onDismiss && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDismiss()
            }}
            className="text-xs text-gray-500 hover:text-gray-700 font-medium"
          >
            Dismiss
          </button>
        )}
      </div>
    </div>
  )
}