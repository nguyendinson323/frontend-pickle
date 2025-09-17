import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../../store'
import { bulkUpdateReservations, clearSelectedReservations } from '../../../store/slices/adminCourtsSlice'
import {
  FiCheck,
  FiX,
  FiUserX,
  FiLayers,
  FiRefreshCw,
  FiInfo,
  FiZap,
  FiCalendar
} from 'react-icons/fi'

const BulkReservationActions: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { selectedReservations, loading } = useSelector((state: RootState) => state.adminCourts)

  const handleBulkAction = async (action: string) => {
    if (selectedReservations.length === 0) return

    let confirmMessage = ''
    switch (action) {
      case 'cancel':
        confirmMessage = `Are you sure you want to cancel ${selectedReservations.length} selected reservation(s)? Refunds will be processed automatically.`
        break
      case 'complete':
        confirmMessage = `Are you sure you want to mark ${selectedReservations.length} selected reservation(s) as completed?`
        break
      case 'no_show':
        confirmMessage = `Are you sure you want to mark ${selectedReservations.length} selected reservation(s) as no-show?`
        break
      default:
        return
    }

    const confirmed = window.confirm(confirmMessage)

    if (confirmed) {
      try {
        await dispatch(bulkUpdateReservations(selectedReservations, action))
        alert(`Successfully updated ${selectedReservations.length} reservations`)
      } catch (error) {
        console.error('Failed to update reservations:', error)
      }
    }
  }

  const handleClearSelection = () => {
    dispatch(clearSelectedReservations())
  }

  if (selectedReservations.length === 0) {
    return (
      <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <FiLayers className="mr-2 h-5 w-5" />
            Bulk Actions
          </h3>
        </div>
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiCalendar className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No reservations selected</h3>
          <p className="text-gray-600">Select one or more reservations from the table below to perform bulk actions.</p>
          <p className="text-sm text-gray-400 mt-1">Actions include completing, canceling, or marking as no-show.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden mb-8">
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <FiZap className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-xl font-bold text-gray-900">Bulk Actions</h3>
              <p className="text-sm text-indigo-700 font-medium">
                {selectedReservations.length} reservation{selectedReservations.length !== 1 ? 's' : ''} selected
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* Reservation Actions */}
            <button
              onClick={() => handleBulkAction('complete')}
              disabled={loading}
              className="inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-medium rounded-xl hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <FiCheck className="mr-2 h-4 w-4" />
              {loading ? 'Processing...' : 'Mark Completed'}
            </button>

            <button
              onClick={() => handleBulkAction('cancel')}
              disabled={loading}
              className="inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-medium rounded-xl hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <FiX className="mr-2 h-4 w-4" />
              {loading ? 'Processing...' : 'Cancel & Refund'}
            </button>

            <button
              onClick={() => handleBulkAction('no_show')}
              disabled={loading}
              className="inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white text-sm font-medium rounded-xl hover:from-gray-600 hover:to-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <FiUserX className="mr-2 h-4 w-4" />
              {loading ? 'Processing...' : 'Mark No-Show'}
            </button>

            {/* Clear Selection */}
            <button
              onClick={handleClearSelection}
              className="inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-medium rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <FiRefreshCw className="mr-2 h-4 w-4" />
              Clear Selection
            </button>
          </div>
        </div>
      </div>

        {/* Action Descriptions */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mt-6 border border-blue-200">
          <div className="flex items-start mb-3">
            <FiInfo className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
            <h4 className="text-sm font-semibold text-blue-900">Action Descriptions</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-start">
              <div className="w-6 h-6 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                <FiCheck className="h-3 w-3" />
              </div>
              <div>
                <div className="font-medium text-green-900">Complete</div>
                <div className="text-green-700 text-xs">Mark reservations as successfully finished and ready for checkout</div>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 bg-red-100 text-red-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                <FiX className="h-3 w-3" />
              </div>
              <div>
                <div className="font-medium text-red-900">Cancel & Refund</div>
                <div className="text-red-700 text-xs">Cancel reservations and automatically process refunds to customers</div>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                <FiUserX className="h-3 w-3" />
              </div>
              <div>
                <div className="font-medium text-gray-900">No-Show</div>
                <div className="text-gray-700 text-xs">Mark as no-show when customers don't arrive (no refund processed)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}

export default BulkReservationActions