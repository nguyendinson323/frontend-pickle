import React from 'react'

interface AdminApprovalCardProps {
  type: 'club' | 'partner' | 'state' | 'player' | 'coach'
  name: string
  submittedDate: string
  location?: string
  details?: string
  onApprove: () => void
  onReject: () => void
  onViewDetails?: () => void
}

export const AdminApprovalCard: React.FC<AdminApprovalCardProps> = ({
  type,
  name,
  submittedDate,
  location,
  details,
  onApprove,
  onReject,
  onViewDetails
}) => {
  const getTypeIcon = () => {
    switch (type) {
      case 'club': return '🏢'
      case 'partner': return '🏨'
      case 'state': return '🏛️'
      case 'player': return '🏓'
      case 'coach': return '👨‍🏫'
      default: return '📋'
    }
  }

  const getTypeColor = () => {
    switch (type) {
      case 'club': return 'text-purple-600'
      case 'partner': return 'text-orange-600'
      case 'state': return 'text-red-600'
      case 'player': return 'text-green-600'
      case 'coach': return 'text-blue-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mr-4">
          <span className={`text-2xl ${getTypeColor()}`}>{getTypeIcon()}</span>
        </div>
        <div>
          <p className="font-medium text-gray-900">
            {type.charAt(0).toUpperCase() + type.slice(1)} Registration: {name}
          </p>
          {location && <p className="text-sm text-gray-600">{location}</p>}
          {details && <p className="text-xs text-gray-500">{details}</p>}
          <p className="text-xs text-gray-500">Submitted {submittedDate}</p>
        </div>
      </div>
      
      <div className="flex space-x-2">
        {onViewDetails && (
          <button
            onClick={onViewDetails}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm transition-colors duration-200"
          >
            View Details
          </button>
        )}
        <button
          onClick={onApprove}
          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors duration-200"
        >
          Approve
        </button>
        <button
          onClick={onReject}
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors duration-200"
        >
          Reject
        </button>
      </div>
    </div>
  )
}