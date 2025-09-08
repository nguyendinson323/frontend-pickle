import React from 'react'
import { useNavigate } from 'react-router-dom'

interface PendingApproval {
  id: string
  type: string
  title: string
  submittedTime: string
  icon: string
  iconColor: string
}

const AdminPendingApprovals: React.FC = () => {
  const navigate = useNavigate()

  // This would normally come from props or API call
  const pendingApprovals: PendingApproval[] = [
    {
      id: '1',
      type: 'club',
      title: 'Club Registration: Pickleball Tijuana',
      submittedTime: 'Submitted 2 days ago',
      icon: '🏢',
      iconColor: 'bg-purple-100 text-purple-600'
    },
    {
      id: '2',
      type: 'partner',
      title: 'Partner Registration: Resort Cancún',
      submittedTime: 'Submitted 1 day ago',
      icon: '🏨',
      iconColor: 'bg-orange-100 text-orange-600'
    }
  ]

  const handleApprove = (id: string) => {
    console.log('Approve approval:', id)
    // Handle approval logic here
  }

  const handleReject = (id: string) => {
    console.log('Reject approval:', id)
    // Handle rejection logic here
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
        {pendingApprovals.map((approval) => (
          <div key={approval.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center">
              <div className={`w-10 h-10 ${approval.iconColor} rounded-full flex items-center justify-center mr-4`}>
                <span>{approval.icon}</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">{approval.title}</p>
                <p className="text-sm text-gray-600">{approval.submittedTime}</p>
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
        ))}
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