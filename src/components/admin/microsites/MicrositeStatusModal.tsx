import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../../store'
import { MicrositeAdmin } from '../../../types/admin'
import { 
  updateMicrositeStatusAction,
  approveMicrosite,
  rejectMicrosite,
  suspendMicrosite
} from '../../../store/slices/adminMicrositesSlice'

interface MicrositeStatusModalProps {
  microsite: MicrositeAdmin
  onClose: () => void
}

const MicrositeStatusModal: React.FC<MicrositeStatusModalProps> = ({ microsite, onClose }) => {
  const dispatch = useDispatch<AppDispatch>()
  const [action, setAction] = useState<'update' | 'approve' | 'reject' | 'suspend'>('update')
  const [newStatus, setNewStatus] = useState(microsite.status)
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'suspended', label: 'Suspended' },
    { value: 'pending', label: 'Pending' }
  ]

  const handleSubmit = async () => {
    if (!action) return

    setLoading(true)
    try {
      switch (action) {
        case 'update':
          await dispatch(updateMicrositeStatusAction(microsite.id, newStatus, reason))
          break
        case 'approve':
          await dispatch(approveMicrosite(microsite.id))
          break
        case 'reject':
          if (!reason.trim()) {
            alert('Rejection reason is required')
            setLoading(false)
            return
          }
          await dispatch(rejectMicrosite(microsite.id, reason))
          break
        case 'suspend':
          if (!reason.trim()) {
            alert('Suspension reason is required')
            setLoading(false)
            return
          }
          await dispatch(suspendMicrosite(microsite.id, reason))
          break
      }
      onClose()
    } catch (error) {
      console.error('Failed to update microsite status:', error)
    } finally {
      setLoading(false)
    }
  }

  const getActionTitle = () => {
    switch (action) {
      case 'approve': return 'Approve Microsite'
      case 'reject': return 'Reject Microsite'
      case 'suspend': return 'Suspend Microsite'
      default: return 'Update Microsite Status'
    }
  }

  const getActionButton = () => {
    switch (action) {
      case 'approve': return { text: 'Approve', class: 'bg-green-600 hover:bg-green-700' }
      case 'reject': return { text: 'Reject', class: 'bg-red-600 hover:bg-red-700' }
      case 'suspend': return { text: 'Suspend', class: 'bg-red-600 hover:bg-red-700' }
      default: return { text: 'Update', class: 'bg-indigo-600 hover:bg-indigo-700' }
    }
  }

  const actionButton = getActionButton()

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900">{getActionTitle()}</h3>
          <p className="text-sm text-gray-500 mt-1">Site: {microsite.title}</p>
          <p className="text-sm text-gray-500">Owner: {microsite.owner_name} ({microsite.owner_type})</p>
        </div>

        <div className="space-y-6">
          {/* Action Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Action Type
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="action"
                  value="update"
                  checked={action === 'update'}
                  onChange={(e) => setAction(e.target.value as 'update' | 'approve' | 'reject' | 'suspend')}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Update Status</span>
              </label>
              
              {microsite.status === 'pending' && (
                <>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="action"
                      value="approve"
                      checked={action === 'approve'}
                      onChange={(e) => setAction(e.target.value as 'update' | 'approve' | 'reject' | 'suspend')}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Approve Microsite</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="action"
                      value="reject"
                      checked={action === 'reject'}
                      onChange={(e) => setAction(e.target.value as 'update' | 'approve' | 'reject' | 'suspend')}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Reject Microsite</span>
                  </label>
                </>
              )}
              
              {['active', 'approved'].includes(microsite.status) && (
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="action"
                    value="suspend"
                    checked={action === 'suspend'}
                    onChange={(e) => setAction(e.target.value as 'update' | 'approve' | 'reject' | 'suspend')}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Suspend Microsite</span>
                </label>
              )}
            </div>
          </div>

          {/* Status Selection (only for update action) */}
          {action === 'update' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Status
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Reason (required for reject/suspend, optional for update) */}
          {(action === 'reject' || action === 'suspend' || action === 'update') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {action === 'reject' ? 'Rejection Reason *' : 
                 action === 'suspend' ? 'Suspension Reason *' : 'Reason (Optional)'}
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                placeholder={
                  action === 'reject' ? 'Please provide a reason for rejecting this microsite...' :
                  action === 'suspend' ? 'Please provide a reason for suspending this microsite...' :
                  'Optional reason for status change...'
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          )}

          {/* Microsite Info */}
          <div className=" rounded-md p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Microsite Details</h4>
            <div className="text-sm text-gray-700 space-y-1">
              <div>Domain: {microsite.domain_name}</div>
              <div>Current Status: {microsite.status}</div>
              <div>Visibility: {microsite.visibility_status}</div>
              <div>Content Score: {microsite.content_score}/100</div>
              <div>Page Views: {microsite.page_views.toLocaleString()}</div>
              {microsite.has_inappropriate_content && (
                <div className="text-red-600">⚠️ Contains flagged content</div>
              )}
            </div>
          </div>

          {/* Warning for destructive actions */}
          {(action === 'reject' || action === 'suspend') && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Warning</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    {action === 'reject' && 'Rejecting this microsite will make it inactive and notify the owner.'}
                    {action === 'suspend' && 'Suspending this microsite will immediately make it inaccessible to visitors.'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 mt-8">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover: focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || (action === 'reject' && !reason.trim()) || (action === 'suspend' && !reason.trim())}
            className={`px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 ${actionButton.class}`}
          >
            {loading ? 'Processing...' : actionButton.text}
          </button>
        </div>
      </div>
    </div>
  )
}

export default MicrositeStatusModal