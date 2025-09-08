import React from 'react'

interface TournamentCardProps {
  name: string
  date: string
  location: string
  registrationEnd: string
  categories: string[]
  prizePool?: number
  maxParticipants: number
  currentParticipants: number
  status: 'upcoming' | 'registration_open' | 'registration_closed' | 'in_progress' | 'completed'
  organizer: string
  description?: string
  onRegister?: () => void
  onViewDetails?: () => void
  isRegistered?: boolean
}

export const TournamentCard: React.FC<TournamentCardProps> = ({
  name,
  date,
  location,
  registrationEnd,
  categories,
  prizePool,
  maxParticipants,
  currentParticipants,
  status,
  organizer,
  description,
  onRegister,
  onViewDetails,
  isRegistered = false
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'registration_open': return 'bg-green-100 text-green-800'
      case 'registration_closed': return 'bg-red-100 text-red-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-yellow-100 text-yellow-800'
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'registration_open': return 'Registration Open'
      case 'registration_closed': return 'Registration Closed'
      case 'in_progress': return 'In Progress'
      case 'completed': return 'Completed'
      default: return 'Upcoming'
    }
  }

  const registrationPercentage = Math.round((currentParticipants / maxParticipants) * 100)

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{name}</h3>
            <p className="text-sm text-gray-600">Organized by {organizer}</p>
          </div>
          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>

        {description && (
          <p className="text-gray-700 text-sm mb-4 line-clamp-2">{description}</p>
        )}

        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div className="flex items-center text-gray-600">
            <span className="mr-2">📅</span>
            <span>{date}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <span className="mr-2">📍</span>
            <span>{location}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <span className="mr-2">⏰</span>
            <span>Reg. ends {registrationEnd}</span>
          </div>
          {prizePool && (
            <div className="flex items-center text-gray-600">
              <span className="mr-2">💰</span>
              <span>${prizePool.toLocaleString()}</span>
            </div>
          )}
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Participants</span>
            <span>{currentParticipants}/{maxParticipants}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${registrationPercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Categories</h4>
          <div className="flex flex-wrap gap-2">
            {categories.map((category, index) => (
              <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                {category}
              </span>
            ))}
          </div>
        </div>

        <div className="flex space-x-2">
          {onViewDetails && (
            <button
              onClick={onViewDetails}
              className="flex-1 border border-indigo-600 text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            >
              View Details
            </button>
          )}
          
          {onRegister && (
            <button
              onClick={onRegister}
              disabled={status === 'registration_closed' || currentParticipants >= maxParticipants}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                isRegistered
                  ? 'bg-green-600 text-white cursor-default'
                  : status === 'registration_open' && currentParticipants < maxParticipants
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isRegistered ? 'Registered ✓' : 'Register'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}