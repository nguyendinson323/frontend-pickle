import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../../store'
import { bulkUpdateReservations, clearSelectedReservations } from '../../../store/slices/adminCourtsSlice'

const BulkReservationActions: React.FC = () => {
  const dispatch = useDispatch()
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
        await dispatch(bulkUpdateReservations(selectedReservations, action) as any)
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
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
        <p className="text-gray-600 text-center">Select reservations to perform bulk actions</p>
      </div>
    )
  }

  return (
    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="mb-4 sm:mb-0">
          <p className="text-indigo-800 font-medium">
            {selectedReservations.length} reservation{selectedReservations.length !== 1 ? 's' : ''} selected
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Reservation Actions */}
          <button
            onClick={() => handleBulkAction('complete')}
            disabled={loading}
            className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Mark Completed
          </button>
          
          <button
            onClick={() => handleBulkAction('cancel')}
            disabled={loading}
            className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel & Refund
          </button>
          
          <button
            onClick={() => handleBulkAction('no_show')}
            disabled={loading}
            className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Mark No-Show
          </button>

          {/* Clear Selection */}
          <button
            onClick={handleClearSelection}
            className="px-3 py-1 text-sm bg-gray-400 text-white rounded hover:bg-gray-500 transition-colors"
          >
            Clear Selection
          </button>
        </div>
      </div>

      {/* Action Descriptions */}
      <div className="mt-3 text-xs text-indigo-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div>
            <strong>Complete:</strong> Mark as successfully finished
          </div>
          <div>
            <strong>Cancel:</strong> Cancel and process automatic refunds
          </div>
          <div>
            <strong>No-Show:</strong> Mark as no-show (no refund)
          </div>
        </div>
      </div>
    </div>
  )
}

export default BulkReservationActions