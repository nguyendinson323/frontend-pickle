import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../../store'
import { CourtInfo } from '../../../types/admin'
import {
  updateCourtStatusAction,
  approveCourt,
  rejectCourt,
  getCourtDetails
} from '../../../store/slices/adminCourtsSlice'
import {
  FiMapPin,
  FiUser,
  FiEye,
  FiCheck,
  FiX,
  FiEdit,
  FiSettings,
  FiSun,
  FiHome,
  FiDollarSign,
  FiCalendar,
  FiLoader,
  FiFilter
} from 'react-icons/fi'

interface CourtsTableProps {
  onCourtSelect: (court: CourtInfo) => void
}

const CourtsTable: React.FC<CourtsTableProps> = ({ onCourtSelect }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { courts, loading } = useSelector((state: RootState) => state.adminCourts)
  
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [selectedCourt, setSelectedCourt] = useState<CourtInfo | null>(null)
  const [newStatus, setNewStatus] = useState<'active' | 'maintenance' | 'inactive' | 'pending'>('active')
  const [statusReason, setStatusReason] = useState('')

  const handleStatusChange = (court: CourtInfo) => {
    setSelectedCourt(court)
    setNewStatus(court.status)
    setStatusReason('')
    setShowStatusModal(true)
  }

  const handleSaveStatus = async () => {
    if (!selectedCourt) return

    try {
      await dispatch(updateCourtStatusAction(selectedCourt.id, newStatus, statusReason))
      setShowStatusModal(false)
      setSelectedCourt(null)
    } catch (error) {
      console.error('Failed to update court status:', error)
    }
  }

  const handleApproveCourt = async (courtId: number) => {
    const confirmed = window.confirm('Are you sure you want to approve this court?')
    if (confirmed) {
      try {
        await dispatch(approveCourt(courtId))
        alert('Court approved successfully')
      } catch (error) {
        console.error('Failed to approve court:', error)
      }
    }
  }

  const handleRejectCourt = async (courtId: number) => {
    const reason = prompt('Please provide a reason for rejection:')
    if (reason) {
      try {
        await dispatch(rejectCourt(courtId, reason))
        alert('Court rejected successfully')
      } catch (error) {
        console.error('Failed to reject court:', error)
      }
    }
  }

  const handleViewDetails = async (court: CourtInfo) => {
    try {
      await dispatch(getCourtDetails(court.id))
      onCourtSelect(court)
    } catch (error) {
      console.error('Failed to fetch court details:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'maintenance': return 'bg-red-100 text-red-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSurfaceColor = (surface: string) => {
    switch (surface.toLowerCase()) {
      case 'hard': return 'bg-blue-100 text-blue-800'
      case 'clay': return 'bg-orange-100 text-orange-800'
      case 'grass': return 'bg-green-100 text-green-800'
      case 'artificial': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <FiMapPin className="mr-2 h-5 w-5" />
            Courts Overview
          </h3>
        </div>
        <div className="flex items-center justify-center p-16">
          <div className="text-center">
            <FiLoader className="animate-spin h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Loading courts data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
              <FiMapPin className="mr-2 h-5 w-5" />
              Courts Overview
            </h3>
            <div className="flex items-center text-sm text-gray-600">
              <FiFilter className="mr-1 h-4 w-4" />
              {courts.length} courts found
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center">
                    <FiMapPin className="mr-2 h-4 w-4" />
                    Court
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center">
                    <FiUser className="mr-2 h-4 w-4" />
                    Owner
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Surface & Features
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center">
                    <FiSettings className="mr-2 h-4 w-4" />
                    Status
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Court Count
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center">
                    <FiDollarSign className="mr-2 h-4 w-4" />
                    Performance
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {courts.map((court, index) => (
                <tr
                  key={court.id}
                  className="hover:bg-gray-50 transition-colors duration-200"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-sm">
                        {court.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-bold text-gray-900">{court.name}</div>
                        <div className="text-xs text-gray-500">ID: {court.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FiUser className="mr-2 h-4 w-4 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {court.owner_name || 'Independent'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {court.owner_type === 'club' ? 'Club' : court.owner_type === 'partner' ? 'Partner' : 'Private'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-start">
                      <FiMapPin className="mr-2 h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{court.address}</div>
                        <div className="text-xs text-gray-500">{court.state_name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col space-y-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSurfaceColor(court.surface_type)}`}>
                        {court.surface_type}
                      </span>
                      <div className="flex space-x-2">
                        {court.lights && (
                          <div className="flex items-center px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">
                            <FiSun className="mr-1 h-3 w-3" />
                            Lit
                          </div>
                        )}
                        {court.indoor && (
                          <div className="flex items-center px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                            <FiHome className="mr-1 h-3 w-3" />
                            Indoor
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleStatusChange(court)}
                      className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full transition-all duration-200 hover:scale-105 hover:shadow-md ${getStatusColor(court.status)}`}
                    >
                      <FiSettings className="mr-1 h-3 w-3" />
                      {court.status.charAt(0).toUpperCase() + court.status.slice(1)}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                        {court.court_count || 1}
                      </div>
                      <span className="ml-2 text-sm text-gray-600">courts</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-900">
                        <FiCalendar className="mr-1 h-3 w-3 text-gray-400" />
                        {court.total_reservations || 0} reservations
                      </div>
                      <div className="flex items-center text-sm text-green-600 font-medium">
                        <FiDollarSign className="mr-1 h-3 w-3" />
                        ${court.revenue_generated || 0} revenue
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-2">
                      <button
                        onClick={() => handleViewDetails(court)}
                        className="inline-flex items-center px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-lg hover:bg-indigo-200 transition-all duration-200 hover:scale-105"
                      >
                        <FiEye className="mr-1 h-3 w-3" />
                        View Details
                      </button>
                      {court.status === 'pending' && (
                        <div className="flex space-x-1">
                          <button
                            onClick={() => handleApproveCourt(court.id)}
                            className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-lg hover:bg-green-200 transition-all duration-200 hover:scale-105"
                          >
                            <FiCheck className="mr-1 h-3 w-3" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectCourt(court.id)}
                            className="inline-flex items-center px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-lg hover:bg-red-200 transition-all duration-200 hover:scale-105"
                          >
                            <FiX className="mr-1 h-3 w-3" />
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {courts.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiMapPin className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courts found</h3>
            <p className="text-gray-500">No courts found matching your current filter criteria.</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your filters to see more results.</p>
          </div>
        )}
      </div>

      {/* Status Update Modal */}
      {showStatusModal && selectedCourt && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative mx-auto p-6 border border-gray-200 max-w-lg shadow-2xl rounded-2xl bg-white transform transition-all duration-300">
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold mr-4">
                  <FiSettings className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Update Court Status
                  </h3>
                  <p className="text-sm text-gray-600">{selectedCourt.name}</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Current Status:
                    <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusColor(selectedCourt.status)}`}>
                      {selectedCourt.status.charAt(0).toUpperCase() + selectedCourt.status.slice(1)}
                    </span>
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    <label className="flex items-center p-3 border-2 border-gray-200 rounded-xl hover:border-green-300 cursor-pointer transition-all duration-200">
                      <input
                        type="radio"
                        name="status"
                        value="active"
                        checked={newStatus === 'active'}
                        onChange={(e) => setNewStatus(e.target.value as 'active')}
                        className="mr-3 text-green-600 focus:ring-green-500"
                      />
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mr-3">
                          <FiCheck className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">Active</div>
                          <div className="text-xs text-gray-500">Court is operational and available</div>
                        </div>
                      </div>
                    </label>
                    <label className="flex items-center p-3 border-2 border-gray-200 rounded-xl hover:border-gray-400 cursor-pointer transition-all duration-200">
                      <input
                        type="radio"
                        name="status"
                        value="inactive"
                        checked={newStatus === 'inactive'}
                        onChange={(e) => setNewStatus(e.target.value as 'inactive')}
                        className="mr-3 text-gray-600 focus:ring-gray-500"
                      />
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center mr-3">
                          <FiX className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">Inactive</div>
                          <div className="text-xs text-gray-500">Court is temporarily unavailable</div>
                        </div>
                      </div>
                    </label>
                    <label className="flex items-center p-3 border-2 border-gray-200 rounded-xl hover:border-red-300 cursor-pointer transition-all duration-200">
                      <input
                        type="radio"
                        name="status"
                        value="maintenance"
                        checked={newStatus === 'maintenance'}
                        onChange={(e) => setNewStatus(e.target.value as 'maintenance')}
                        className="mr-3 text-red-600 focus:ring-red-500"
                      />
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-red-100 text-red-600 rounded-lg flex items-center justify-center mr-3">
                          <FiSettings className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">Maintenance</div>
                          <div className="text-xs text-gray-500">Court requires maintenance or repairs</div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <label htmlFor="reason" className="block text-sm font-semibold text-gray-700 mb-2">
                    Reason (Optional)
                  </label>
                  <textarea
                    id="reason"
                    value={statusReason}
                    onChange={(e) => setStatusReason(e.target.value)}
                    rows={3}
                    className="w-full border-2 border-gray-200 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200 p-3"
                    placeholder="Explain the reason for this status change..."
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-8 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="inline-flex items-center px-6 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
                >
                  <FiX className="mr-2 h-4 w-4" />
                  Cancel
                </button>
                <button
                  onClick={handleSaveStatus}
                  className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <FiCheck className="mr-2 h-4 w-4" />
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default CourtsTable