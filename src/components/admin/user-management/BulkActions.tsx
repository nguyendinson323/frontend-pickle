import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../../store'
import { bulkUpdateUsers, clearSelectedUsers, sendUserNotification } from '../../../store/slices/adminUserManagementSlice'

const BulkActions: React.FC = () => {
  const dispatch = useDispatch()
  const { selectedUsers, loading } = useSelector((state: RootState) => state.adminUserManagement)
  const [showNotificationModal, setShowNotificationModal] = useState(false)
  const [notificationData, setNotificationData] = useState({ subject: '', message: '' })

  const handleBulkStatusUpdate = async (status: 'active' | 'inactive' | 'suspended') => {
    if (selectedUsers.length === 0) return

    const confirmed = window.confirm(
      `Are you sure you want to ${status} ${selectedUsers.length} selected user(s)?`
    )

    if (confirmed) {
      try {
        await dispatch(bulkUpdateUsers(selectedUsers, 'status', { status }) as any)
      } catch (error) {
        console.error('Failed to update user status:', error)
      }
    }
  }

  const handleBulkVerification = async (verified: boolean) => {
    if (selectedUsers.length === 0) return

    const confirmed = window.confirm(
      `Are you sure you want to ${verified ? 'verify' : 'unverify'} ${selectedUsers.length} selected user(s)?`
    )

    if (confirmed) {
      try {
        await dispatch(bulkUpdateUsers(selectedUsers, 'verification', { verified }) as any)
      } catch (error) {
        console.error('Failed to update user verification:', error)
      }
    }
  }

  const handleBulkPremium = async (premium: boolean) => {
    if (selectedUsers.length === 0) return

    const confirmed = window.confirm(
      `Are you sure you want to ${premium ? 'grant' : 'remove'} premium status for ${selectedUsers.length} selected user(s)?`
    )

    if (confirmed) {
      try {
        await dispatch(bulkUpdateUsers(selectedUsers, 'premium', { premium }) as any)
      } catch (error) {
        console.error('Failed to update user premium status:', error)
      }
    }
  }

  const handleSendNotification = async () => {
    if (selectedUsers.length === 0 || !notificationData.subject || !notificationData.message) return

    try {
      await dispatch(sendUserNotification(selectedUsers, notificationData.subject, notificationData.message) as any)
      setShowNotificationModal(false)
      setNotificationData({ subject: '', message: '' })
    } catch (error) {
      console.error('Failed to send notification:', error)
    }
  }

  const handleClearSelection = () => {
    dispatch(clearSelectedUsers())
  }

  if (selectedUsers.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
        <p className="text-gray-600 text-center">Select users to perform bulk actions</p>
      </div>
    )
  }

  return (
    <>
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-4 sm:mb-0">
            <p className="text-indigo-800 font-medium">
              {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {/* Status Updates */}
            <div className="flex gap-1">
              <button
                onClick={() => handleBulkStatusUpdate('active')}
                disabled={loading}
                className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Activate
              </button>
              <button
                onClick={() => handleBulkStatusUpdate('inactive')}
                disabled={loading}
                className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Deactivate
              </button>
              <button
                onClick={() => handleBulkStatusUpdate('suspended')}
                disabled={loading}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Suspend
              </button>
            </div>

            {/* Verification Updates */}
            <div className="flex gap-1">
              <button
                onClick={() => handleBulkVerification(true)}
                disabled={loading}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Verify
              </button>
              <button
                onClick={() => handleBulkVerification(false)}
                disabled={loading}
                className="px-3 py-1 text-sm bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Unverify
              </button>
            </div>

            {/* Premium Updates */}
            <div className="flex gap-1">
              <button
                onClick={() => handleBulkPremium(true)}
                disabled={loading}
                className="px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Grant Premium
              </button>
              <button
                onClick={() => handleBulkPremium(false)}
                disabled={loading}
                className="px-3 py-1 text-sm bg-yellow-800 text-white rounded hover:bg-yellow-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Remove Premium
              </button>
            </div>

            {/* Communication */}
            <button
              onClick={() => setShowNotificationModal(true)}
              disabled={loading}
              className="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Send Message
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
      </div>

      {/* Notification Modal */}
      {showNotificationModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Send Notification</h3>
              <div className="mb-4">
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  value={notificationData.subject}
                  onChange={(e) => setNotificationData({ ...notificationData, subject: e.target.value })}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  placeholder="Enter notification subject"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  value={notificationData.message}
                  onChange={(e) => setNotificationData({ ...notificationData, message: e.target.value })}
                  rows={4}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  placeholder="Enter notification message"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowNotificationModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendNotification}
                  disabled={!notificationData.subject || !notificationData.message || loading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Sending...' : 'Send'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default BulkActions