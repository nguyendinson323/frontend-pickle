import React from 'react'

interface UserCardProps {
  name: string
  role?: string
  avatar?: string
  subtitle?: string
  badge?: string
  badgeColor?: string
  onClick?: () => void
  actions?: React.ReactNode
}

export const UserCard: React.FC<UserCardProps> = ({
  name,
  role,
  avatar,
  subtitle,
  badge,
  badgeColor = 'blue',
  onClick,
  actions
}) => {
  const getBadgeColorClasses = () => {
    const colorMap = {
      blue: 'bg-blue-100 text-blue-800',
      green: 'bg-green-100 text-green-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      red: 'bg-red-100 text-red-800',
      purple: 'bg-purple-100 text-purple-800',
      gray: 'bg-gray-100 text-gray-800'
    }
    return colorMap[badgeColor as keyof typeof colorMap] || colorMap.blue
  }

  return (
    <div
      className={`flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200 ${
        onClick ? 'cursor-pointer hover:' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-center">
        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-4">
          {avatar ? (
            <img src={avatar} alt={name} className="w-12 h-12 rounded-full object-cover" />
          ) : (
            <span className="text-gray-500 text-lg">👤</span>
          )}
        </div>
        <div>
          <h4 className="font-semibold text-gray-900">{name}</h4>
          {role && <p className="text-sm text-gray-600">{role}</p>}
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
      </div>
      <div className="flex items-center space-x-2">
        {badge && (
          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getBadgeColorClasses()}`}>
            {badge}
          </span>
        )}
        {actions}
      </div>
    </div>
  )
}