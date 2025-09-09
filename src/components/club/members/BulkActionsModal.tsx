import React, { useState } from 'react'

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
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Bulk Actions</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <span className="font-medium">{selectedCount}</span> member{selectedCount !== 1 ? 's' : ''} selected
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Action
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="activate"
                    checked={selectedAction === 'activate'}
                    onChange={(e) => setSelectedAction(e.target.value as 'activate')}
                    className="mr-2 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-900">Activate Members</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="deactivate"
                    checked={selectedAction === 'deactivate'}
                    onChange={(e) => setSelectedAction(e.target.value as 'deactivate')}
                    className="mr-2 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-900">Deactivate Members</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="extend_membership"
                    checked={selectedAction === 'extend_membership'}
                    onChange={(e) => setSelectedAction(e.target.value as 'extend_membership')}
                    className="mr-2 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-900">Extend Membership</span>
                </label>
              </div>
            </div>

            {selectedAction === 'extend_membership' && (
              <div>
                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
                  New Expiry Date *
                </label>
                <input
                  type="date"
                  id="expiryDate"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  min={getMinDate()}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Select the new expiry date for all selected members
                </p>
              </div>
            )}

            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
              <div className="flex">
                <svg className="flex-shrink-0 h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    This action will affect {selectedCount} member{selectedCount !== 1 ? 's' : ''}. 
                    {selectedAction === 'deactivate' && ' Deactivated members will not be able to access their accounts.'}
                    {selectedAction === 'activate' && ' Activated members will regain access to their accounts.'}
                    {selectedAction === 'extend_membership' && ' All selected members will have their membership extended to the specified date.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || (selectedAction === 'extend_membership' && !expiryDate)}
                className="px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Apply Action'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default BulkActionsModal