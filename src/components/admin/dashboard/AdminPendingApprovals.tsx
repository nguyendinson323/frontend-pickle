import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { PendingApproval, updateApproval } from '../../../store/slices/adminDashboardSlice'
import { AppDispatch } from '../../../store'

interface AdminPendingApprovalsProps {
  pendingApprovals: PendingApproval[]
}

const AdminPendingApprovals: React.FC<AdminPendingApprovalsProps> = ({ pendingApprovals }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()

  const getApprovalIcon = (type: PendingApproval['type']): string => {
    switch (type) {
      case 'user': return '👤'
      case 'court': return '🎾'
      case 'tournament': return '🏆'
      case 'microsite': return '🌐'
      default: return '📋'
    }
  }

  const getApprovalIconColor = (type: PendingApproval['type']): string => {
    switch (type) {
      case 'user': return 'bg-blue-100 text-blue-600'
      case 'court': return 'bg-green-100 text-green-600'
      case 'tournament': return 'bg-yellow-100 text-yellow-600'
      case 'microsite': return 'bg-purple-100 text-purple-600'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  const formatTimeAgo = (timestamp: string): string => {
    const now = new Date()
    const submittedTime = new Date(timestamp)
    const diffInMs = now.getTime() - submittedTime.getTime()
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
    
    if (diffInDays === 0) {
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
      if (diffInHours === 0) {
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
        return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`
      }
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`
    }
    return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`
  }

  const handleApprove = async (id: number) => {
    try {
      await dispatch(updateApproval(id, 'approved'))
    } catch (error) {
      console.error('Failed to approve:', error)
    }
  }

  const handleReject = async (id: number) => {
    try {
      await dispatch(updateApproval(id, 'rejected'))
    } catch (error) {
      console.error('Failed to reject:', error)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Pending Approvals</h3>
        <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
          {pendingApprovals.length} pending
        </span>
      </div>
      <div className="space-y-4">
        {pendingApprovals.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No pending approvals</p>
        ) : (
          pendingApprovals.map((approval) => (
            <div key={approval.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center">
                <div className={`w-10 h-10 ${getApprovalIconColor(approval.type)} rounded-full flex items-center justify-center mr-4`}>
                  <span>{getApprovalIcon(approval.type)}</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{approval.title}</p>
                  <p className="text-sm text-gray-600">{approval.description}</p>
                  <div className="flex items-center mt-1 text-xs text-gray-500">
                    <span>By {approval.submittedBy}</span>
                    <span className="mx-2">•</span>
                    <span>{formatTimeAgo(approval.submittedAt)}</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleApprove(approval.id)}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors duration-200"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(approval.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors duration-200"
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="mt-4">
        <button
          onClick={() => navigate('/admin/approvals')}
          className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
        >
          View all pending approvals →
        </button>
      </div>
    </div>
  )
}

export default AdminPendingApprovals