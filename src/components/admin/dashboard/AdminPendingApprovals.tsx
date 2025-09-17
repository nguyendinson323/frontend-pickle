import React, { useState } from 'react'
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
  const [processingId, setProcessingId] = useState<number | null>(null)

  const getApprovalIcon = (type: PendingApproval['type']): JSX.Element => {
    switch (type) {
      case 'user':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        )
      case 'court':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        )
      case 'tournament':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        )
      case 'microsite':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9" />
          </svg>
        )
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        )
    }
  }

  const getApprovalIconColor = (type: PendingApproval['type']): string => {
    switch (type) {
      case 'user': return 'bg-blue-100 text-blue-600 border-blue-200'
      case 'court': return 'bg-green-100 text-green-600 border-green-200'
      case 'tournament': return 'bg-yellow-100 text-yellow-600 border-yellow-200'
      case 'microsite': return 'bg-purple-100 text-purple-600 border-purple-200'
      default: return 'bg-gray-100 text-gray-600 border-gray-200'
    }
  }

  const getApprovalTypeName = (type: PendingApproval['type']): string => {
    switch (type) {
      case 'user': return 'User Registration'
      case 'court': return 'Court Registration'
      case 'tournament': return 'Tournament Creation'
      case 'microsite': return 'Microsite Request'
      default: return 'General Approval'
    }
  }

  const getPriorityLevel = (type: PendingApproval['type']): { level: string; color: string } => {
    switch (type) {
      case 'user': return { level: 'High', color: 'bg-red-100 text-red-700' }
      case 'tournament': return { level: 'High', color: 'bg-red-100 text-red-700' }
      case 'court': return { level: 'Medium', color: 'bg-yellow-100 text-yellow-700' }
      case 'microsite': return { level: 'Low', color: 'bg-green-100 text-green-700' }
      default: return { level: 'Medium', color: 'bg-yellow-100 text-yellow-700' }
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
    setProcessingId(id)
    try {
      await dispatch(updateApproval(id, 'approved'))
    } catch (error) {
      console.error('Failed to approve:', error)
    } finally {
      setProcessingId(null)
    }
  }

  const handleReject = async (id: number) => {
    setProcessingId(id)
    try {
      await dispatch(updateApproval(id, 'rejected'))
    } catch (error) {
      console.error('Failed to reject:', error)
    } finally {
      setProcessingId(null)
    }
  }

  const urgentApprovals = pendingApprovals.filter(approval =>
    ['user', 'tournament'].includes(approval.type)
  ).length

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">Pending Approvals</h3>
          <div className="flex items-center space-x-3">
            {urgentApprovals > 0 && (
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-red-100 text-red-700">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {urgentApprovals} urgent
              </span>
            )}
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              {pendingApprovals.length} total pending
            </span>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {pendingApprovals.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-500 font-medium">No pending approvals</p>
              <p className="text-gray-400 text-sm mt-1">All items have been processed</p>
            </div>
          ) : (
            pendingApprovals.map((approval) => {
              const priority = getPriorityLevel(approval.type)
              return (
                <div
                  key={approval.id}
                  className="group p-4 border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 ${getApprovalIconColor(approval.type)} rounded-xl border flex items-center justify-center flex-shrink-0`}>
                        {getApprovalIcon(approval.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                            {getApprovalTypeName(approval.type)}
                          </span>
                          <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${priority.color}`}>
                            {priority.level}
                          </span>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-gray-800">
                          {approval.title}
                        </h4>
                        <p className="text-sm text-gray-600 leading-relaxed mb-2">
                          {approval.description}
                        </p>
                        <div className="flex items-center space-x-3 text-xs text-gray-500">
                          <div className="flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                            <span className="font-medium">{approval.submittedBy}</span>
                          </div>
                          <div className="flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            <span>{formatTimeAgo(approval.submittedAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-end space-x-3 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => handleReject(approval.id)}
                      disabled={processingId === approval.id}
                      className="inline-flex items-center px-4 py-2 border border-red-300 text-red-700 bg-red-50 rounded-lg text-sm font-medium hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processingId === approval.id ? (
                        <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                      Reject
                    </button>
                    <button
                      onClick={() => handleApprove(approval.id)}
                      disabled={processingId === approval.id}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-white bg-green-600 rounded-lg text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processingId === approval.id ? (
                        <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      Approve
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
        <div className="mt-6 pt-4 border-t border-gray-100">
          <button
            onClick={() => navigate('/admin/approvals')}
            className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            View All Pending Approvals
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminPendingApprovals