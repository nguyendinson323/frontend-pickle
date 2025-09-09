import React from 'react'

interface EventCardProps {
  title: string
  type?: string
  date: string
  time?: string
  location?: string
  participants?: number
  status?: 'upcoming' | 'active' | 'completed' | 'cancelled'
  description?: string
  onClick?: () => void
  actions?: React.ReactNode
}

export const EventCard: React.FC<EventCardProps> = ({
  title,
  type,
  date,
  time,
  location,
  participants,
  status = 'upcoming',
  description,
  onClick,
  actions
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800'
      case 'active': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-blue-100 text-blue-800'
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'upcoming': return '📅'
      case 'active': return '🔴'
      case 'completed': return '✅'
      case 'cancelled': return '❌'
      default: return '📅'
    }
  }

  return (
    <div
      className={`p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200 ${
        onClick ? 'cursor-pointer hover:' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
          {type && <p className="text-sm text-gray-600 mb-2">{type}</p>}
          {description && <p className="text-sm text-gray-700 mb-3">{description}</p>}
        </div>
        <div className="flex items-center ml-4">
          <span className="text-xl mr-2">{getStatusIcon()}</span>
          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getStatusColor()}`}>
            {status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
        <div className="flex items-center">
          <span className="mr-2">📅</span>
          <span>{date}</span>
        </div>
        {time && (
          <div className="flex items-center">
            <span className="mr-2">🕐</span>
            <span>{time}</span>
          </div>
        )}
        {location && (
          <div className="flex items-center">
            <span className="mr-2">📍</span>
            <span>{location}</span>
          </div>
        )}
        {participants !== undefined && (
          <div className="flex items-center">
            <span className="mr-2">👥</span>
            <span>{participants} participants</span>
          </div>
        )}
      </div>

      {actions && (
        <div className="flex justify-end pt-3 border-t border-gray-200">
          {actions}
        </div>
      )}
    </div>
  )
}