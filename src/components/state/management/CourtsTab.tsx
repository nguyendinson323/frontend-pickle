import React from 'react'
import { StateCourt } from '../../../store/slices/stateManagementSlice'

interface CourtsTabProps {
  courts: StateCourt[]
  onViewCourt: (court: StateCourt) => void
  onUpdateCourtStatus: (courtId: number, status: string) => void
}

const CourtsTab: React.FC<CourtsTabProps> = ({
  courts,
  onViewCourt,
  onUpdateCourtStatus
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800'
      case 'inactive':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getOwnerColor = (ownerType: string) => {
    switch (ownerType) {
      case 'club':
        return 'bg-blue-100 text-blue-800'
      case 'partner':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusOptions = (currentStatus: string) => {
    const statuses = ['active', 'maintenance', 'inactive']
    return statuses.filter(status => status !== currentStatus)
  }

  const formatSchedule = (schedules: Array<{
    day_of_week: number
    open_time: string
    close_time: string
    is_closed: boolean
  }>) => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const openDays = schedules?.filter(s => !s.is_closed) || []
    
    if (openDays.length === 0) return 'Closed'
    if (openDays.length === 7) return 'Open daily'
    
    return openDays.map(s => dayNames[s.day_of_week]).join(', ')
  }

  return (
    <div className="space-y-4">
      {courts.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No courts registered</h3>
          <p className="mt-1 text-sm text-gray-500">No courts have been registered by clubs or partners in your state yet.</p>
        </div>
      ) : (
        courts.map((court) => (
          <div key={court.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{court.name}</h3>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(court.status)}`}>
                    {court.status.charAt(0).toUpperCase() + court.status.slice(1)}
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getOwnerColor(court.owner_type)}`}>
                    {court.owner_type.charAt(0).toUpperCase() + court.owner_type.slice(1)}
                  </span>
                </div>
                {court.address && (
                  <p className="text-sm text-gray-600">{court.address}</p>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <select
                    value=""
                    onChange={(e) => {
                      if (e.target.value) {
                        onUpdateCourtStatus(court.id, e.target.value)
                        e.target.value = ""
                      }
                    }}
                    className="text-xs border-gray-300 rounded text-gray-600 bg-white cursor-pointer"
                  >
                    <option value="">Change Status</option>
                    {getStatusOptions(court.status).map(status => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {court.description && (
              <p className="text-gray-600 mb-4">{court.description}</p>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <div className="text-sm text-gray-500">Owner</div>
                <div className="font-medium">{court.owner?.name || 'Unknown'}</div>
                {court.owner?.contact_email && (
                  <div className="text-xs text-gray-500">{court.owner.contact_email}</div>
                )}
              </div>
              <div>
                <div className="text-sm text-gray-500">Courts Available</div>
                <div className="font-medium">{court.court_count} court{court.court_count !== 1 ? 's' : ''}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Surface & Type</div>
                <div className="font-medium">
                  {court.surface_type || 'Not specified'}
                  {court.indoor !== null && (
                    <span className="text-xs ml-1">
                      ({court.indoor ? 'Indoor' : 'Outdoor'})
                    </span>
                  )}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Upcoming Reservations</div>
                <div className="font-medium">{court.reservations_count || 0}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <div className="text-sm text-gray-500">Schedule</div>
                <div className="font-medium">{formatSchedule(court.schedules || [])}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Features</div>
                <div className="flex items-center space-x-2">
                  {court.lights && (
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-800">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                      </svg>
                      Lights
                    </span>
                  )}
                  {court.amenities && (
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                      Amenities
                    </span>
                  )}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Contact</div>
                {court.owner?.phone && (
                  <div className="font-medium">{court.owner.phone}</div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">
                Registered on {new Date(court.created_at).toLocaleDateString()}
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => onViewCourt(court)}
                  className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default CourtsTab