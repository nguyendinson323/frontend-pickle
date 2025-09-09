import React from 'react'
import { MembershipStats } from '../../../store/slices/clubMembersSlice'

interface MembersHeaderProps {
  stats: MembershipStats | null
  onInviteMember: () => void
  onBulkActions: () => void
}

const MembersHeader: React.FC<MembersHeaderProps> = ({ stats, onInviteMember, onBulkActions }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Club Members</h1>
        <div className="flex space-x-3">
          <button
            onClick={onBulkActions}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
            Bulk Actions
          </button>
          <button
            onClick={onInviteMember}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Invite Member
          </button>
        </div>
      </div>
      
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stats.total_members}</div>
            <div className="text-sm text-gray-600">Total Members</div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{stats.active_members}</div>
            <div className="text-sm text-gray-600">Active Members</div>
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{stats.expired_members}</div>
            <div className="text-sm text-gray-600">Expired Members</div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{stats.average_level}</div>
            <div className="text-sm text-gray-600">Average NRTP Level</div>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">${stats.membership_revenue}</div>
            <div className="text-sm text-gray-600">Monthly Revenue</div>
          </div>
          
          <div className="bg-indigo-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-indigo-600">{stats.new_members_this_month}</div>
            <div className="text-sm text-gray-600">New This Month</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MembersHeader