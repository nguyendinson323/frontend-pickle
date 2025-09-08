import React from 'react'
import { useNavigate } from 'react-router-dom'

interface Approval {
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

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Pending Approvals</h3>
        {pendingApprovals.length > 0 && (
          <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {pendingApprovals.length} pending
          </span>
        )}
      </div>
      {pendingApprovals.length > 0 ? (
        <div className="space-y-4">
          {pendingApprovals.slice(0, 3).map((approval, index) => (
            <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{approval.type}: {approval.name}</p>
                <p className="text-sm text-gray-600">{approval.location}</p>
                <p className="text-xs text-gray-500">Submitted {approval.submittedDate}</p>
              </div>
              <div className="flex space-x-2">
                <button className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs transition-colors duration-200">
                  Approve
                </button>
                <button className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs transition-colors duration-200">
                  Reject
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={() => navigate('/state/approvals')}
            className="text-red-600 hover:text-red-500 text-sm font-medium"
          >
            View all pending approvals →
          </button>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">✅</div>
          <p className="text-gray-600">No pending approvals</p>
        </div>
      )}
    </div>
  )
}

export default StatePendingApprovals