import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../../store'
import { approveUser, rejectUser } from '../../../store/slices/stateDashboardSlice'
import { FiUserCheck, FiCheck, FiX, FiClock, FiInbox, FiChevronRight } from 'react-icons/fi'

interface Approval {
  userId: number
  type: string
  name: string
  location: string
  submittedDate: string
}

interface StatePendingApprovalsProps {
  pendingApprovals: Approval[]
}

const StatePendingApprovals: React.FC<StatePendingApprovalsProps> = ({ pendingApprovals }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()

  const handleApprove = async (userId: number, name: string) => {
    if (window.confirm(`Are you sure you want to approve ${name}?`)) {
      try {
        await dispatch(approveUser(userId))
      } catch (error) {
        console.error('Approval failed:', error)
      }
    }
  }

  const handleReject = async (userId: number, name: string) => {
    if (window.confirm(`Are you sure you want to reject ${name}? This will deactivate their account.`)) {
      try {
        await dispatch(rejectUser(userId))
      } catch (error) {
        console.error('Rejection failed:', error)
      }
    }
  }

  return (
    <div className="bg-white rounded-3xl shadow-2xl border-2 border-gray-100 p-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-red-600 rounded-full flex items-center justify-center mr-4 shadow-xl">
            <FiUserCheck className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Pending Approvals</h3>
        </div>
        {pendingApprovals.length > 0 && (
          <span className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white text-sm font-bold px-4 py-2 rounded-2xl shadow-lg">
            {pendingApprovals.length} pending
          </span>
        )}
      </div>
      {pendingApprovals.length > 0 ? (
        <div className="space-y-6">
          {pendingApprovals.slice(0, 3).map((approval, index) => (
            <div key={index} className="bg-gradient-to-r from-gray-50 to-white p-6 border-2 border-gray-200 rounded-3xl hover:shadow-xl transition-all duration-300">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-3 shadow-lg">
                      <FiUserCheck className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-lg">{approval.type}: {approval.name}</p>
                      <p className="text-sm text-gray-600 font-medium">{approval.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <FiClock className="w-4 h-4 mr-2" />
                    <p className="text-sm font-medium">Submitted {approval.submittedDate}</p>
                  </div>
                </div>
                <div className="flex space-x-3 ml-4">
                  <button
                    onClick={() => handleApprove(approval.userId, approval.name)}
                    className="flex items-center bg-gradient-to-r from-green-600 to-emerald-600 hover:shadow-xl text-white px-4 py-2 rounded-2xl text-sm font-bold transition-all duration-300 transform hover:scale-105"
                  >
                    <FiCheck className="w-4 h-4 mr-2" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(approval.userId, approval.name)}
                    className="flex items-center bg-gradient-to-r from-red-600 to-pink-600 hover:shadow-xl text-white px-4 py-2 rounded-2xl text-sm font-bold transition-all duration-300 transform hover:scale-105"
                  >
                    <FiX className="w-4 h-4 mr-2" />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={() => navigate('/state/approvals')}
            className="flex items-center text-indigo-600 hover:text-indigo-700 text-sm font-bold group transition-colors duration-300"
          >
            View all pending approvals
            <FiChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
            <FiInbox className="w-10 h-10 text-white" />
          </div>
          <h4 className="text-xl font-bold text-gray-900 mb-2">All Caught Up!</h4>
          <p className="text-gray-600 font-medium">No pending approvals at this time</p>
        </div>
      )}
    </div>
  )
}

export default StatePendingApprovals