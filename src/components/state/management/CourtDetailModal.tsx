import React from 'react'
import { StateCourt } from '../../../store/slices/stateManagementSlice'

interface CourtDetailModalProps {
  isOpen: boolean
  onClose: () => void
  court: StateCourt | null
}

const CourtDetailModal: React.FC<CourtDetailModalProps> = ({
  isOpen,
  onClose,
  court
}) => {
  if (!isOpen || !court) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

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

  const getSurfaceIcon = (surface: string) => {
    switch (surface?.toLowerCase()) {
      case 'indoor':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2v2z" />
          </svg>
        )
      case 'outdoor':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        )
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        )
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-8 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">Court Details</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{court.name}</h2>
                <div className="flex items-center space-x-2 mt-1">
                  {getSurfaceIcon(court.indoor ? 'indoor' : 'outdoor')}
                  <span className="text-gray-600">{court.surface_type} Court</span>
                </div>
              </div>
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(court.status)}`}>
                {court.status.charAt(0).toUpperCase() + court.status.slice(1)}
              </span>
            </div>

            {/* Court Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-3">Court Information</h4>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-gray-500">Surface Type</div>
                    <div className="font-medium">{court.surface_type}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Lighting</div>
                    <div className="font-medium">{court.lights ? 'Available' : 'Not Available'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Indoor</div>
                    <div className="font-medium">{court.indoor ? 'Yes' : 'No'}</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-3">Usage Statistics</h4>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-gray-500">Current Reservations</div>
                    <div className="font-medium">{court.reservations_count || 0}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Court Count</div>
                    <div className="font-medium">{court.court_count || 1}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Availability</div>
                    <div className="font-medium">{court.status === 'active' ? 'Available for Booking' : 'Not Available'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Owner Information */}
            {court.owner && (
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-3">Owner Information</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500">Owner Name</div>
                      <div className="font-medium">{court.owner.name}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Owner Type</div>
                      <div className="font-medium capitalize">{court.owner.type}</div>
                    </div>
                    {court.owner.contact_email && (
                      <div>
                        <div className="text-sm text-gray-500">Contact Email</div>
                        <div className="font-medium">{court.owner.contact_email}</div>
                      </div>
                    )}
                    {court.owner.phone && (
                      <div>
                        <div className="text-sm text-gray-500">Phone</div>
                        <div className="font-medium">{court.owner.phone}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Location Information */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-3">Location</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Address</div>
                    <div className="font-medium">{court.address || 'Not specified'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Coordinates</div>
                    <div className="font-medium">
                      {court.latitude && court.longitude
                        ? `${court.latitude}, ${court.longitude}`
                        : 'Not specified'
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Court Schedules */}
            {court.schedules && court.schedules.length > 0 && (
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-3">Operating Schedules</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {court.schedules.map((schedule, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="font-medium">Day {schedule.day_of_week}</div>
                      <div className="text-sm text-gray-600">
                        {schedule.open_time} - {schedule.close_time}
                      </div>
                      {!schedule.is_closed && (
                        <div className="text-xs text-green-600 mt-1">Open</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Amenities */}
            {court.amenities && (
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-3">Amenities</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600">{court.amenities}</p>
                </div>
              </div>
            )}

            {/* Additional Information */}
            {court.description && (
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-3">Description</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600">{court.description}</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourtDetailModal