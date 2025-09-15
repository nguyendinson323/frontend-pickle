import React, { useMemo, useCallback, useState } from 'react'
import { StateCourt } from '../../../store/slices/stateManagementSlice'

interface CourtsTabProps {
  courts: StateCourt[]
  onViewCourt: (court: StateCourt) => void
  onUpdateCourtStatus: (courtId: number, status: string) => void
}

const CourtsTab: React.FC<CourtsTabProps> = React.memo(({
  courts,
  onViewCourt,
  onUpdateCourtStatus
}) => {
  const [changingStatus, setChangingStatus] = useState<number | null>(null)

  // Memoized utility functions
  const getStatusColor = useCallback((status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800'
      case 'inactive':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }, [])

  const getOwnerColor = useCallback((ownerType: string) => {
    switch (ownerType?.toLowerCase()) {
      case 'club':
        return 'bg-blue-100 text-blue-800'
      case 'partner':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }, [])

  const getStatusOptions = useCallback((currentStatus: string) => {
    const statuses = ['active', 'maintenance', 'inactive']
    return statuses.filter(status => status !== currentStatus?.toLowerCase())
  }, [])

  // Handle status change with proper error handling
  const handleStatusChange = useCallback(async (courtId: number, newStatus: string) => {
    setChangingStatus(courtId)
    try {
      await onUpdateCourtStatus(courtId, newStatus)
    } catch (error) {
      console.error('Failed to update court status:', error)
    } finally {
      setChangingStatus(null)
    }
  }, [onUpdateCourtStatus])

  // Improved schedule formatting with better type safety
  const formatSchedule = useCallback((schedules: any[]) => {
    if (!Array.isArray(schedules) || schedules.length === 0) {
      return 'No schedule available'
    }

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    try {
      // Handle different schedule data structures
      const openDays = schedules.filter(s => {
        if (!s) return false
        // Handle both is_closed and is_available properties
        return s.is_available !== false && s.is_closed !== true
      })

      if (openDays.length === 0) return 'Closed'
      if (openDays.length === 7) return 'Open daily'

      // Handle both day_of_week (number) and day (string) properties
      return openDays.map(s => {
        if (typeof s.day_of_week === 'number' && s.day_of_week >= 0 && s.day_of_week <= 6) {
          return dayNames[s.day_of_week]
        }
        if (typeof s.day === 'string') {
          return s.day.substring(0, 3) // Truncate to 3 chars
        }
        return 'Unknown'
      }).join(', ')
    } catch (error) {
      console.error('Error formatting schedule:', error)
      return 'Schedule unavailable'
    }
  }, [])

  // Safe date formatting
  const formatDate = useCallback((dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString()
    } catch (error) {
      console.error('Invalid date string:', dateString)
      return 'Invalid Date'
    }
  }, [])

  // Memoize valid courts list
  const validCourts = useMemo(() => {
    return Array.isArray(courts) ? courts.filter(c => c && c.id) : []
  }, [courts])

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
        validCourts.map((court) => (
          <div key={court.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {court.name || 'Unnamed Court'}
                  </h3>
                  {court.status && (
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(court.status)}`}>
                      {court.status.charAt(0).toUpperCase() + court.status.slice(1)}
                    </span>
                  )}
                  {court.owner_type && (
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getOwnerColor(court.owner_type)}`}>
                      {court.owner_type.charAt(0).toUpperCase() + court.owner_type.slice(1)}
                    </span>
                  )}
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
                        handleStatusChange(court.id, e.target.value)
                        e.target.selectedIndex = 0
                      }
                    }}
                    disabled={changingStatus === court.id}
                    className={`text-xs border-gray-300 rounded text-gray-600 bg-white cursor-pointer ${
                      changingStatus === court.id ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <option value="">
                      {changingStatus === court.id ? 'Updating...' : 'Change Status'}
                    </option>
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
                <div className="font-medium">{court.owner?.name || 'Unknown Owner'}</div>
                {court.owner?.contact_email && (
                  <div className="text-xs text-gray-500">{court.owner.contact_email}</div>
                )}
              </div>
              <div>
                <div className="text-sm text-gray-500">Courts Available</div>
                <div className="font-medium">
                  {court.court_count || 1} court{(court.court_count || 1) !== 1 ? 's' : ''}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Surface & Type</div>
                <div className="font-medium">
                  {court.surface_type || 'Not specified'}
                  {court.indoor !== undefined && (
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
                      Lighting
                    </span>
                  )}
                  {court.amenities && typeof court.amenities === 'string' && court.amenities.trim() && (
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                      Amenities
                    </span>
                  )}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Contact</div>
                {court.owner?.phone ? (
                  <div className="font-medium">{court.owner.phone}</div>
                ) : (
                  <div className="text-sm text-gray-400">No contact info</div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">
                {court.created_at ? (
                  `Registered on ${formatDate(court.created_at)}`
                ) : (
                  'Registration date unknown'
                )}
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => onViewCourt(court)}
                  className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                  disabled={changingStatus === court.id}
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
})

export default CourtsTab