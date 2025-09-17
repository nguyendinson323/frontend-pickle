import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../../store'
import { bulkUpdateUsers, clearSelectedUsers, sendUserNotification } from '../../../store/slices/adminUserManagementSlice'
import {
  FiUserCheck,
  FiUserX,
  FiShield,
  FiCheckCircle,
  FiXCircle,
  FiStar,
  FiMail,
  FiTrash2,
  FiLoader,
  FiX,
  FiEdit,
  FiUsers,
  FiSettings
} from 'react-icons/fi'

const BulkActions: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { selectedUsers, loading } = useSelector((state: RootState) => state.adminUserManagement)
  const [showNotificationModal, setShowNotificationModal] = useState(false)
  const [notificationData, setNotificationData] = useState({ subject: '', message: '' })

  const handleBulkStatusUpdate = async (status: 'active' | 'inactive' | 'suspended') => {
    if (selectedUsers.length === 0) return

    const actionName = status === 'active' ? 'activate' : 'deactivate'
    const confirmed = window.confirm(
      `Are you sure you want to ${status === 'active' ? 'activate' : 'deactivate'} ${selectedUsers.length} selected user(s)?`
    )

    if (confirmed) {
      try {
        await dispatch(bulkUpdateUsers(selectedUsers, actionName, {}))
      } catch (error) {
        console.error('Failed to update user status:', error)
      }
    }
  }

  const handleBulkVerification = async (verified: boolean) => {
    if (selectedUsers.length === 0) return

    const actionName = verified ? 'verify' : 'unverify'
    const confirmed = window.confirm(
      `Are you sure you want to ${verified ? 'verify' : 'unverify'} ${selectedUsers.length} selected user(s)?`
    )

    if (confirmed) {
      try {
        await dispatch(bulkUpdateUsers(selectedUsers, actionName, {}))
      } catch (error) {
        console.error('Failed to update user verification:', error)
      }
    }
  }

  const handleBulkPremium = async (premium: boolean) => {
    if (selectedUsers.length === 0) return

    const actionName = premium ? 'premium' : 'unpremium'
    const confirmed = window.confirm(
      `Are you sure you want to ${premium ? 'grant' : 'remove'} premium status for ${selectedUsers.length} selected user(s)?`
    )

    if (confirmed) {
      try {
        await dispatch(bulkUpdateUsers(selectedUsers, actionName, {}))
      } catch (error) {
        console.error('Failed to update user premium status:', error)
      }
    }
  }

  const handleSendNotification = async () => {
    if (selectedUsers.length === 0 || !notificationData.subject || !notificationData.message) return

    try {
      await dispatch(sendUserNotification(selectedUsers, notificationData.subject, notificationData.message))
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
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 rounded-2xl p-8 mb-8 shadow-lg">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiUsers className="h-8 w-8 text-gray-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">No Users Selected</h3>
          <p className="text-gray-600 font-medium">Select users from the table below to perform bulk actions</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="bg-gradient-to-r from-indigo-50 to-blue-100 border-2 border-indigo-200 rounded-2xl p-8 mb-8 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="mb-6 lg:mb-0">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center text-white mr-4">
                <FiSettings className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-indigo-900">
                  {selectedUsers.length} User{selectedUsers.length !== 1 ? 's' : ''} Selected
                </h3>
                <p className="text-indigo-700 font-medium">Perform bulk actions on selected users</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Status Updates */}
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow">
              <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center">
                <FiShield className="h-4 w-4 mr-2" />
                Account Status
              </h4>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleBulkStatusUpdate('active')}
                  disabled={loading}
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  {loading ? <FiLoader className="animate-spin mr-2 h-4 w-4" /> : <FiUserCheck className="mr-2 h-4 w-4" />}
                  Activate
                </button>
                <button
                  onClick={() => handleBulkStatusUpdate('inactive')}
                  disabled={loading}
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  {loading ? <FiLoader className="animate-spin mr-2 h-4 w-4" /> : <FiUserX className="mr-2 h-4 w-4" />}
                  Deactivate
                </button>
              </div>
            </div>

            {/* Verification Updates */}
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow">
              <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center">
                <FiCheckCircle className="h-4 w-4 mr-2" />
                Verification
              </h4>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleBulkVerification(true)}
                  disabled={loading}
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {loading ? <FiLoader className="animate-spin mr-2 h-4 w-4" /> : <FiCheckCircle className="mr-2 h-4 w-4" />}
                  Verify
                </button>
                <button
                  onClick={() => handleBulkVerification(false)}
                  disabled={loading}
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  {loading ? <FiLoader className="animate-spin mr-2 h-4 w-4" /> : <FiXCircle className="mr-2 h-4 w-4" />}
                  Unverify
                </button>
              </div>
            </div>

            {/* Premium Updates */}
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow">
              <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center">
                <FiStar className="h-4 w-4 mr-2" />
                Premium Status
              </h4>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleBulkPremium(true)}
                  disabled={loading}
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                >
                  {loading ? <FiLoader className="animate-spin mr-2 h-4 w-4" /> : <FiStar className="mr-2 h-4 w-4" />}
                  Grant Premium
                </button>
                <button
                  onClick={() => handleBulkPremium(false)}
                  disabled={loading}
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-yellow-800 to-yellow-900 hover:from-yellow-900 hover:to-yellow-950 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-700"
                >
                  {loading ? <FiLoader className="animate-spin mr-2 h-4 w-4" /> : <FiXCircle className="mr-2 h-4 w-4" />}
                  Remove Premium
                </button>
              </div>
            </div>

            {/* Communication & Management */}
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow">
              <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center">
                <FiMail className="h-4 w-4 mr-2" />
                Actions
              </h4>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setShowNotificationModal(true)}
                  disabled={loading}
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  {loading ? <FiLoader className="animate-spin mr-2 h-4 w-4" /> : <FiMail className="mr-2 h-4 w-4" />}
                  Send Message
                </button>
                <button
                  onClick={handleClearSelection}
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-bold text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                >
                  <FiX className="mr-2 h-4 w-4" />
                  Clear Selection
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Modal */}
      {showNotificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
          <div className="relative top-8 mx-auto p-0 w-full max-w-2xl min-h-[calc(100vh-4rem)] flex items-center justify-center">
            <div className="bg-white shadow-2xl rounded-3xl border border-gray-200 overflow-hidden w-full m-4 animate-modal-scale">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-700 px-8 py-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center text-white mr-4">
                      <FiMail className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">Send Notification</h3>
                      <p className="text-purple-100 font-medium">Send a message to {selectedUsers.length} selected user{selectedUsers.length !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowNotificationModal(false)}
                    className="w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-xl flex items-center justify-center text-white transition-all duration-200 hover:scale-105"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="p-8">
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-2xl p-6 border border-blue-200">
                    <label htmlFor="subject" className="block text-lg font-bold text-gray-900 mb-3 flex items-center">
                      <FiEdit className="h-5 w-5 mr-2" />
                      Subject
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiEdit className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="subject"
                        value={notificationData.subject}
                        onChange={(e) => setNotificationData({ ...notificationData, subject: e.target.value })}
                        className="w-full pl-12 rounded-2xl border-2 border-gray-300 px-4 py-4 text-lg font-medium focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200 bg-white hover:border-gray-400"
                        placeholder="Enter notification subject"
                      />
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-emerald-100 rounded-2xl p-6 border border-green-200">
                    <label htmlFor="message" className="block text-lg font-bold text-gray-900 mb-3 flex items-center">
                      <FiMail className="h-5 w-5 mr-2" />
                      Message
                    </label>
                    <textarea
                      id="message"
                      value={notificationData.message}
                      onChange={(e) => setNotificationData({ ...notificationData, message: e.target.value })}
                      rows={6}
                      className="w-full rounded-2xl border-2 border-gray-300 px-4 py-4 text-lg font-medium focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:ring-opacity-50 transition-all duration-200 bg-white hover:border-gray-400 resize-none"
                      placeholder="Enter your message for the selected users..."
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-8 bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-t border-gray-200">
                  <button
                    onClick={() => setShowNotificationModal(false)}
                    className="inline-flex items-center px-8 py-4 text-lg font-bold text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:transform-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    <FiX className="mr-2 h-5 w-5" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSendNotification}
                    disabled={!notificationData.subject || !notificationData.message || loading}
                    className="inline-flex items-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 border-2 border-transparent rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:transform-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    {loading ? (
                      <>
                        <FiLoader className="animate-spin mr-2 h-5 w-5" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <FiMail className="mr-2 h-5 w-5" />
                        Send Notification
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default BulkActions