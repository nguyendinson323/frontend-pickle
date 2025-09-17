import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../../store'
import { CourtInfo } from '../../../types/admin'
import { getCourtUtilizationReport } from '../../../store/slices/adminCourtsSlice'
import {
  FiX,
  FiMapPin,
  FiUser,
  FiActivity,
  FiSun,
  FiHome,
  FiDollarSign,
  FiCalendar,
  FiClock,
  FiLoader,
  FiBarChart,
  FiTrendingUp,
  FiInfo,
  FiSettings
} from 'react-icons/fi'

interface CourtDetailProps {
  court: CourtInfo
  onClose: () => void
}

const CourtDetail: React.FC<CourtDetailProps> = ({ court, onClose }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { selectedCourt } = useSelector((state: RootState) => state.adminCourts)
  
  const [utilizationData, setUtilizationData] = useState<any>(null)
  const [loadingUtilization, setLoadingUtilization] = useState(false)

  useEffect(() => {
    const fetchUtilization = async () => {
      setLoadingUtilization(true)
      try {
        const data = await dispatch(getCourtUtilizationReport(court.id))
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
      case 'active': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'maintenance': return 'bg-red-100 text-red-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const courtData = selectedCourt || court

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative mx-auto border max-w-6xl shadow-2xl rounded-2xl bg-white transform transition-all duration-300 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white px-6 py-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mr-4">
                <FiMapPin className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">{courtData.name}</h3>
                <p className="text-indigo-100">Court Details & Analytics</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300 transition-colors bg-white bg-opacity-20 rounded-xl p-2 hover:bg-opacity-30"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">{/* Content container */}

        <div className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
              <h4 className="text-xl font-bold text-gray-900 flex items-center">
                <FiInfo className="mr-2 h-5 w-5" />
                Basic Information
              </h4>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <FiMapPin className="mr-3 h-5 w-5 text-gray-400" />
                    <div>
                      <span className="font-semibold text-gray-700">Court Name:</span>
                      <div className="text-lg font-bold text-gray-900">{courtData.name}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FiUser className="mr-3 h-5 w-5 text-gray-400" />
                    <div>
                      <span className="font-semibold text-gray-700">Owner:</span>
                      <div className="text-lg font-medium text-gray-900">
                        {courtData.owner_name || 'Independent'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FiActivity className="mr-3 h-5 w-5 text-gray-400" />
                    <div>
                      <span className="font-semibold text-gray-700">Surface Type:</span>
                      <div className="text-lg font-medium text-gray-900">{courtData.surface_type}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-3 h-5 w-5 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center text-xs font-bold">
                      {courtData.court_count || 1}
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Court Count:</span>
                      <div className="text-lg font-bold text-gray-900">{courtData.court_count || 1} courts</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <FiSettings className="mr-3 h-5 w-5 text-gray-400" />
                    <div>
                      <span className="font-semibold text-gray-700">Status:</span>
                      <div className="mt-1">
                        <span className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(courtData.status)}`}>
                          <FiActivity className="mr-1 h-3 w-3" />
                          {courtData.status.charAt(0).toUpperCase() + courtData.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700 flex items-center mb-2">
                      <FiActivity className="mr-2 h-4 w-4" />
                      Features:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {courtData.lights && (
                        <div className="flex items-center px-3 py-2 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-lg">
                          <FiSun className="mr-1 h-4 w-4" />
                          Lit
                        </div>
                      )}
                      {courtData.indoor && (
                        <div className="flex items-center px-3 py-2 bg-blue-100 text-blue-800 text-sm font-medium rounded-lg">
                          <FiHome className="mr-1 h-4 w-4" />
                          Indoor
                        </div>
                      )}
                      {!courtData.lights && !courtData.indoor && (
                        <span className="text-gray-500 text-sm italic">No special features</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start">
                    <FiMapPin className="mr-3 h-5 w-5 text-gray-400 mt-1 flex-shrink-0" />
                    <div>
                      <span className="font-semibold text-gray-700">Location:</span>
                      <div className="text-gray-900 mt-1">
                        <div className="font-medium">{courtData.address}</div>
                        <div className="text-sm text-gray-600">{courtData.state_name}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
              <h4 className="text-xl font-bold text-gray-900 flex items-center">
                <FiBarChart className="mr-2 h-5 w-5" />
                Performance Metrics
              </h4>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 text-center border border-blue-200">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white mx-auto mb-4">
                    <FiCalendar className="h-6 w-6" />
                  </div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {courtData.total_reservations || 0}
                  </div>
                  <div className="text-sm font-medium text-blue-700">Total Reservations</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 text-center border border-green-200">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white mx-auto mb-4">
                    <FiDollarSign className="h-6 w-6" />
                  </div>
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    ${(courtData.revenue_generated || 0).toLocaleString()}
                  </div>
                  <div className="text-sm font-medium text-green-700">Revenue Generated</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 text-center border border-purple-200">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white mx-auto mb-4">
                    <FiTrendingUp className="h-6 w-6" />
                  </div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {loadingUtilization ? (
                      <FiLoader className="animate-spin h-8 w-8 mx-auto" />
                    ) : (
                      `${utilizationData?.courts?.[0]?.utilizationRate || 0}%`
                    )}
                  </div>
                  <div className="text-sm font-medium text-purple-700">Utilization Rate</div>
                </div>
              </div>
            </div>
          </div>

          {/* Utilization Report */}
          {utilizationData && (
            <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                <h4 className="text-xl font-bold text-gray-900 flex items-center">
                  <FiTrendingUp className="mr-2 h-5 w-5" />
                  Utilization Report (Last 30 Days)
                </h4>
              </div>
              <div className="p-6">
                {loadingUtilization ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <FiLoader className="animate-spin h-8 w-8 text-indigo-600 mx-auto mb-4" />
                      <p className="text-gray-600">Loading utilization data...</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
                      <div className="flex items-center mb-2">
                        <FiClock className="h-5 w-5 text-orange-600 mr-2" />
                        <span className="text-sm font-medium text-orange-700">Hours Booked</span>
                      </div>
                      <div className="text-2xl font-bold text-orange-600">
                        {utilizationData.courts?.[0]?.totalHours || 0}
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                      <div className="flex items-center mb-2">
                        <FiCalendar className="h-5 w-5 text-blue-600 mr-2" />
                        <span className="text-sm font-medium text-blue-700">Reservations</span>
                      </div>
                      <div className="text-2xl font-bold text-blue-600">
                        {utilizationData.courts?.[0]?.totalReservations || 0}
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                      <div className="flex items-center mb-2">
                        <FiDollarSign className="h-5 w-5 text-green-600 mr-2" />
                        <span className="text-sm font-medium text-green-700">Revenue</span>
                      </div>
                      <div className="text-2xl font-bold text-green-600">
                        ${utilizationData.courts?.[0]?.revenue || 0}
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                      <div className="flex items-center mb-2">
                        <FiActivity className="h-5 w-5 text-purple-600 mr-2" />
                        <span className="text-sm font-medium text-purple-700">Avg Duration</span>
                      </div>
                      <div className="text-2xl font-bold text-purple-600">
                        {utilizationData.courts?.[0]?.averageSessionDuration || 0}h
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Recent Reservations */}
          {selectedCourt?.recent_reservations && selectedCourt.recent_reservations.length > 0 && (
            <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                <h4 className="text-xl font-bold text-gray-900 flex items-center">
                  <FiCalendar className="mr-2 h-5 w-5" />
                  Recent Reservations
                </h4>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {selectedCourt.recent_reservations.map((reservation: any, index: number) => (
                    <div key={index} className="flex justify-between items-center bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold mr-4">
                          {reservation.user_name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{reservation.user_name}</div>
                          <div className="flex items-center text-sm text-gray-600">
                            <FiClock className="mr-1 h-3 w-3" />
                            {new Date(reservation.start_time).toLocaleDateString()} - {new Date(reservation.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center font-bold text-gray-900 mb-1">
                          <FiDollarSign className="mr-1 h-4 w-4" />
                          ${reservation.amount_paid}
                        </div>
                        <div className={`text-sm font-medium px-2 py-1 rounded-full ${reservation.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                          {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Map placeholder */}
          <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
              <h4 className="text-xl font-bold text-gray-900 flex items-center">
                <FiMapPin className="mr-2 h-5 w-5" />
                Location Map
              </h4>
            </div>
            <div className="p-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl h-64 flex items-center justify-center border-2 border-dashed border-blue-200">
                <div className="text-center text-blue-600">
                  <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiMapPin className="h-8 w-8" />
                  </div>
                  <div className="font-semibold text-blue-800 mb-2">Interactive Map View</div>
                  <div className="text-sm text-blue-700">
                    {courtData.latitude && courtData.longitude
                      ? `Coordinates: ${courtData.latitude}, ${courtData.longitude}`
                      : 'Coordinates not available'}
                  </div>
                  <div className="text-xs text-blue-600 mt-2">Map integration would be implemented here</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <FiX className="mr-2 h-4 w-4" />
            Close
          </button>
        </div>
        </div>
      </div>
    </div>
  )
}

export default CourtDetail