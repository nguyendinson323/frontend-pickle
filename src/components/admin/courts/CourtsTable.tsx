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
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Courts Overview</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Court
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Owner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Surface & Features
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {courts.map((court) => (
                <tr key={court.id} className="hover:">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{court.name}</div>
                    <div className="text-sm text-gray-500">ID: {court.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {court.owner_name || 'Independent'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {court.owner_type === 'club' ? 'Club' : court.owner_type === 'partner' ? 'Partner' : 'Private'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{court.address}</div>
                    <div className="text-sm text-gray-500">{court.state_name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col space-y-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSurfaceColor(court.surface_type)}`}>
                        {court.surface_type}
                      </span>
                      <div className="flex space-x-2">
                        {court.lights && (
                          <span className="text-xs text-yellow-600">💡 Lit</span>
                        )}
                        {court.indoor && (
                          <span className="text-xs text-blue-600">🏠 Indoor</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleStatusChange(court)}
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full transition-colors hover:opacity-80 ${getStatusColor(court.status)}`}
                    >
                      {court.status.charAt(0).toUpperCase() + court.status.slice(1)}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ${court.hourly_rate || 'N/A'}/hr
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {court.total_reservations || 0} reservations
                    </div>
                    <div className="text-sm text-green-600 font-medium">
                      ${court.revenue_generated || 0} revenue
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-y-1">
                    <button
                      onClick={() => handleViewDetails(court)}
                      className="text-indigo-600 hover:text-indigo-900 block transition-colors"
                    >
                      View Details
                    </button>
                    {court.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApproveCourt(court.id)}
                          className="text-green-600 hover:text-green-900 block transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectCourt(court.id)}
                          className="text-red-600 hover:text-red-900 block transition-colors"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {courts.length === 0 && !loading && (
          <div className="text-center py-8">
            <p className="text-gray-500">No courts found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Status Update Modal */}
      {showStatusModal && selectedCourt && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border max-w-md shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Update Court Status - {selectedCourt.name}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Status: {selectedCourt.status}
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="status"
                        value="active"
                        checked={newStatus === 'active'}
                        onChange={(e) => setNewStatus(e.target.value as 'active')}
                        className="mr-2"
                      />
                      Active
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="status"
                        value="inactive"
                        checked={newStatus === 'inactive'}
                        onChange={(e) => setNewStatus(e.target.value as 'inactive')}
                        className="mr-2"
                      />
                      Inactive
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="status"
                        value="maintenance"
                        checked={newStatus === 'maintenance'}
                        onChange={(e) => setNewStatus(e.target.value as 'maintenance')}
                        className="mr-2"
                      />
                      Maintenance
                    </label>
                  </div>
                </div>

                <div>
                  <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                    Reason (Optional)
                  </label>
                  <textarea
                    id="reason"
                    value={statusReason}
                    onChange={(e) => setStatusReason(e.target.value)}
                    rows={3}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    placeholder="Explain the reason for this status change..."
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveStatus}
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
                >
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