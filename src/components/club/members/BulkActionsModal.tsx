import React, { useState } from 'react'
import {
  FiSettings,
  FiX,
  FiUserCheck,
  FiUserX,
  FiClock,
  FiCalendar,
  FiAlertTriangle,
  FiPlay,
  FiUsers
} from 'react-icons/fi'

interface BulkActionsModalProps {
  isOpen: boolean
  onClose: () => void
  selectedCount: number
  onBulkAction: (action: 'activate' | 'deactivate' | 'extend_membership', expiryDate?: string) => Promise<void>
  loading: boolean
}

const BulkActionsModal: React.FC<BulkActionsModalProps> = ({
  isOpen,
  onClose,
  selectedCount,
  onBulkAction,
  loading
}) => {
  const [selectedAction, setSelectedAction] = useState<'activate' | 'deactivate' | 'extend_membership'>('activate')
  const [expiryDate, setExpiryDate] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await onBulkAction(
        selectedAction,
        selectedAction === 'extend_membership' ? expiryDate : undefined
      )
      
      setExpiryDate('')
      onClose()
    } catch (error) {
      console.error('Error performing bulk action:', error)
    }
  }

  const getMinDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white shadow-2xl rounded-3xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-100 p-6 border-b-2 border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white mr-4">
                <FiSettings className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Bulk Actions</h3>
                <p className="text-blue-700 font-medium">Manage multiple members at once</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white hover:bg-opacity-50 rounded-xl transition-all duration-200"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl">
            <div className="flex items-center">
              <FiUsers className="h-5 w-5 text-blue-600 mr-3" />
              <p className="text-sm font-bold text-blue-800">
                <span className="text-lg">{selectedCount}</span> member{selectedCount !== 1 ? 's' : ''} selected
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-4">
                Select Action
              </label>
              <div className="space-y-3">
                <label className={`flex items-center p-4 border-2 rounded-2xl cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedAction === 'activate'
                    ? 'border-green-500 bg-gradient-to-r from-green-50 to-emerald-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    value="activate"
                    checked={selectedAction === 'activate'}
                    onChange={(e) => setSelectedAction(e.target.value as 'activate')}
                    className="mr-3 text-green-600 focus:ring-green-500 w-4 h-4"
                  />
                  <FiUserCheck className="h-5 w-5 text-green-600 mr-3" />
                  <span className="text-sm font-bold text-gray-900">Activate Members</span>
                </label>

                <label className={`flex items-center p-4 border-2 rounded-2xl cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedAction === 'deactivate'
                    ? 'border-red-500 bg-gradient-to-r from-red-50 to-pink-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    value="deactivate"
                    checked={selectedAction === 'deactivate'}
                    onChange={(e) => setSelectedAction(e.target.value as 'deactivate')}
                    className="mr-3 text-red-600 focus:ring-red-500 w-4 h-4"
                  />
                  <FiUserX className="h-5 w-5 text-red-600 mr-3" />
                  <span className="text-sm font-bold text-gray-900">Deactivate Members</span>
                </label>

                <label className={`flex items-center p-4 border-2 rounded-2xl cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedAction === 'extend_membership'
                    ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-indigo-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    value="extend_membership"
                    checked={selectedAction === 'extend_membership'}
                    onChange={(e) => setSelectedAction(e.target.value as 'extend_membership')}
                    className="mr-3 text-purple-600 focus:ring-purple-500 w-4 h-4"
                  />
                  <FiClock className="h-5 w-5 text-purple-600 mr-3" />
                  <span className="text-sm font-bold text-gray-900">Extend Membership</span>
                </label>
              </div>
            </div>

            {selectedAction === 'extend_membership' && (
              <div>
                <label htmlFor="expiryDate" className="block text-sm font-bold text-gray-700 mb-2">
                  <div className="flex items-center">
                    <FiCalendar className="h-4 w-4 mr-2" />
                    New Expiry Date *
                  </div>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiCalendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="expiryDate"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    min={getMinDate()}
                    required
                    className="block w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-2xl leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 shadow-sm hover:border-gray-300"
                  />
                </div>
                <p className="mt-2 text-sm font-medium text-gray-500 flex items-center">
                  <FiClock className="h-4 w-4 mr-1" />
                  Select the new expiry date for all selected members
                </p>
              </div>
            )}

            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl p-4 shadow-sm">
              <div className="flex">
                <FiAlertTriangle className="flex-shrink-0 h-5 w-5 text-yellow-500 mt-0.5" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-yellow-800">
                    This action will affect <span className="font-bold">{selectedCount}</span> member{selectedCount !== 1 ? 's' : ''}.
                    {selectedAction === 'deactivate' && ' Deactivated members will not be able to access their accounts.'}
                    {selectedAction === 'activate' && ' Activated members will regain access to their accounts.'}
                    {selectedAction === 'extend_membership' && ' All selected members will have their membership extended to the specified date.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border-2 border-gray-300 rounded-2xl shadow-sm text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 hover:shadow-md"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || (selectedAction === 'extend_membership' && !expiryDate)}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 border border-transparent rounded-2xl shadow-lg text-sm font-bold text-white hover:from-blue-700 hover:to-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <FiPlay className="h-4 w-4 mr-2" />
                    Apply Action
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default BulkActionsModal