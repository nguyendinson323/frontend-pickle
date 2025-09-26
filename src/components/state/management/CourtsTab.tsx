import React, { useMemo, useCallback, useState } from 'react'
import { StateCourt } from '../../../store/slices/stateManagementSlice'
import { FiHome, FiEye, FiMapPin, FiUser, FiCalendar, FiZap } from 'react-icons/fi'

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
        <div className="text-center py-16">
          <div className="bg-gradient-to-br from-green-100 to-emerald-200 p-8 rounded-full mx-auto w-24 h-24 flex items-center justify-center shadow-lg">
            <FiHome className="w-12 h-12 text-green-600" />
          </div>
          <h3 className="mt-6 text-xl font-bold text-gray-900">No courts registered</h3>
          <p className="mt-3 text-gray-600 max-w-sm mx-auto leading-relaxed">No courts have been registered by clubs or partners in your state yet.</p>
        </div>
      ) : (
        validCourts.map((court) => (
          <div key={court.id} className="border border-gray-200/50 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm transform hover:scale-[1.02] shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-3">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {court.name || 'Unnamed Court'}
                  </h3>
                  {court.status && (
                    <span className={`inline-flex px-3 py-2 text-sm font-bold rounded-xl shadow-sm ${getStatusColor(court.status)}`}>
                      {court.status.charAt(0).toUpperCase() + court.status.slice(1)}
                    </span>
                  )}
                  {court.owner_type && (
                    <span className={`inline-flex px-3 py-2 text-sm font-bold rounded-xl shadow-sm ${getOwnerColor(court.owner_type)}`}>
                      {court.owner_type.charAt(0).toUpperCase() + court.owner_type.slice(1)}
                    </span>
                  )}
                </div>
                {court.address && (
                  <div className="flex items-center space-x-2">
                    <FiMapPin className="w-4 h-4 text-gray-500" />
                    <p className="text-gray-600 font-medium">{court.address}</p>
                  </div>
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
              <p className="text-gray-700 mb-6 leading-relaxed">{court.description}</p>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-blue-50 p-4 rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <FiUser className="w-4 h-4 text-blue-600" />
                  <div className="text-sm text-blue-700 font-semibold">Owner</div>
                </div>
                <div className="font-bold text-gray-900">{court.owner?.name || 'Unknown Owner'}</div>
                {court.owner?.contact_email && (
                  <div className="text-xs text-blue-600 mt-1">{court.owner.contact_email}</div>
                )}
              </div>
              <div className="bg-green-50 p-4 rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <FiHome className="w-4 h-4 text-green-600" />
                  <div className="text-sm text-green-700 font-semibold">Courts Available</div>
                </div>
                <div className="font-bold text-gray-900">
                  {court.court_count || 1} court{(court.court_count || 1) !== 1 ? 's' : ''}
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <FiMapPin className="w-4 h-4 text-purple-600" />
                  <div className="text-sm text-purple-700 font-semibold">Surface & Type</div>
                </div>
                <div className="font-bold text-gray-900">
                  {court.surface_type || 'Not specified'}
                  {court.indoor !== undefined && (
                    <span className="text-xs ml-1 block text-purple-600">
                      ({court.indoor ? 'Indoor' : 'Outdoor'})
                    </span>
                  )}
                </div>
              </div>
              <div className="bg-orange-50 p-4 rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <FiCalendar className="w-4 h-4 text-orange-600" />
                  <div className="text-sm text-orange-700 font-semibold">Upcoming Reservations</div>
                </div>
                <div className="font-bold text-gray-900">{court.reservations_count || 0}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-indigo-50 p-4 rounded-xl">
                <div className="text-sm text-indigo-700 font-semibold mb-2">Schedule</div>
                <div className="font-bold text-gray-900">{formatSchedule(court.schedules || [])}</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-xl">
                <div className="text-sm text-yellow-700 font-semibold mb-2">Features</div>
                <div className="flex flex-wrap gap-2">
                  {court.lights && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-yellow-200 text-yellow-800 font-semibold">
                      <FiZap className="w-3 h-3 mr-1" />
                      Lighting
                    </span>
                  )}
                  {court.amenities && typeof court.amenities === 'string' && court.amenities.trim() && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-200 text-green-800 font-semibold">
                      Amenities
                    </span>
                  )}
                  {(!court.lights && (!court.amenities || !court.amenities.trim())) && (
                    <span className="text-gray-500 text-sm">No special features</span>
                  )}
                </div>
              </div>
              <div className="bg-teal-50 p-4 rounded-xl">
                <div className="text-sm text-teal-700 font-semibold mb-2">Contact</div>
                {court.owner?.phone ? (
                  <div className="font-bold text-gray-900">{court.owner.phone}</div>
                ) : (
                  <div className="text-sm text-gray-500">No contact info</div>
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
                  className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-xl font-semibold flex items-center space-x-2 transition-all duration-200 hover:scale-105"
                  disabled={changingStatus === court.id}
                >
                  <FiEye className="w-4 h-4" />
                  <span>View Details</span>
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