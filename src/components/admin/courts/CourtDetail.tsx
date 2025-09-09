import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../../store'
import { CourtInfo } from '../../../types/admin'
import { getCourtUtilizationReport } from '../../../store/slices/adminCourtsSlice'

interface CourtDetailProps {
  court: CourtInfo
  onClose: () => void
}

const CourtDetail: React.FC<CourtDetailProps> = ({ court, onClose }) => {
  const dispatch = useDispatch()
  const { selectedCourt } = useSelector((state: RootState) => state.adminCourts)
  
  const [utilizationData, setUtilizationData] = useState<any>(null)
  const [loadingUtilization, setLoadingUtilization] = useState(false)

  useEffect(() => {
    const fetchUtilization = async () => {
      setLoadingUtilization(true)
      try {
        const data = await dispatch(getCourtUtilizationReport(court.id) as any)
        setUtilizationData(data)
      } catch (error) {
        console.error('Failed to fetch utilization data:', error)
      } finally {
        setLoadingUtilization(false)
      }
    }

    fetchUtilization()
  }, [dispatch, court.id])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800'
      case 'occupied': return 'bg-yellow-100 text-yellow-800'
      case 'maintenance': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const courtData = selectedCourt || court

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border max-w-4xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">Court Details</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-700">Court Name:</span>
                  <span className="ml-2 text-gray-900">{courtData.name}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Owner:</span>
                  <span className="ml-2 text-gray-900">
                    {courtData.club_name || courtData.partner_name || 'Independent'}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Surface Type:</span>
                  <span className="ml-2 text-gray-900">{courtData.surface_type}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Hourly Rate:</span>
                  <span className="ml-2 text-gray-900 font-semibold">${courtData.hourly_rate}/hour</span>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-700">Status:</span>
                  <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(courtData.status)}`}>
                    {courtData.status.charAt(0).toUpperCase() + courtData.status.slice(1)}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Features:</span>
                  <div className="ml-2 flex space-x-2 mt-1">
                    {courtData.lighting && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">Lit</span>
                    )}
                    {courtData.indoor && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Indoor</span>
                    )}
                    {!courtData.lighting && !courtData.indoor && (
                      <span className="text-gray-500 text-xs">No special features</span>
                    )}
                  </div>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Location:</span>
                  <div className="ml-2 text-gray-900">
                    <div>{courtData.location.address}</div>
                    <div>{courtData.location.city}, {courtData.location.state}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Performance Metrics</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {courtData.total_reservations}
                </div>
                <div className="text-sm text-gray-600">Total Reservations</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  ${courtData.revenue_generated.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Revenue Generated</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {loadingUtilization ? '...' : utilizationData?.courts?.[0]?.utilizationRate || 0}%
                </div>
                <div className="text-sm text-gray-600">Utilization Rate</div>
              </div>
            </div>
          </div>

          {/* Utilization Report */}
          {utilizationData && (
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Utilization Report (Last 30 Days)</h4>
              {loadingUtilization ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-lg font-semibold text-gray-900">
                      {utilizationData.courts?.[0]?.totalHours || 0}
                    </div>
                    <div className="text-sm text-gray-600">Total Hours Booked</div>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-lg font-semibold text-gray-900">
                      {utilizationData.courts?.[0]?.totalReservations || 0}
                    </div>
                    <div className="text-sm text-gray-600">Total Reservations</div>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-lg font-semibold text-gray-900">
                      ${utilizationData.courts?.[0]?.revenue || 0}
                    </div>
                    <div className="text-sm text-gray-600">Revenue (30 Days)</div>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-lg font-semibold text-gray-900">
                      {utilizationData.courts?.[0]?.averageSessionDuration || 0}h
                    </div>
                    <div className="text-sm text-gray-600">Avg Session Duration</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Recent Reservations */}
          {selectedCourt?.recent_reservations && selectedCourt.recent_reservations.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Recent Reservations</h4>
              <div className="space-y-2">
                {selectedCourt.recent_reservations.map((reservation: any, index: number) => (
                  <div key={index} className="flex justify-between items-center bg-white rounded p-3">
                    <div>
                      <div className="font-medium text-gray-900">{reservation.user_name}</div>
                      <div className="text-sm text-gray-600">
                        {new Date(reservation.start_time).toLocaleDateString()} - {new Date(reservation.start_time).toLocaleTimeString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900">${reservation.amount_paid}</div>
                      <div className={`text-sm ${reservation.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                        {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Map placeholder */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Location</h4>
            <div className="bg-gray-200 rounded h-48 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <svg className="mx-auto h-12 w-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>Map View</div>
                <div className="text-sm">
                  {courtData.location.latitude && courtData.location.longitude 
                    ? `${courtData.location.latitude}, ${courtData.location.longitude}`
                    : 'Coordinates not available'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end mt-6 pt-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default CourtDetail