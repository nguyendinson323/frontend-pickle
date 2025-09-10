import React from 'react'
import { MembershipStats } from '../../../store/slices/clubMembersSlice'

interface MembersHeaderProps {
  stats: MembershipStats | null
  onInviteMember: () => void
  onBulkActions: () => void
  searchQuery: string
  onSearchChange: (query: string) => void
  statusFilter: 'all' | 'active' | 'inactive' | 'expired'
  onStatusFilterChange: (filter: 'all' | 'active' | 'inactive' | 'expired') => void
  membershipFilter: 'all' | 'active' | 'expired' | 'expiring_soon'
  onMembershipFilterChange: (filter: 'all' | 'active' | 'expired' | 'expiring_soon') => void
}

const MembersHeader: React.FC<MembersHeaderProps> = ({ 
  stats, 
  onInviteMember, 
  onBulkActions, 
  searchQuery, 
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  membershipFilter,
  onMembershipFilterChange
}) => {
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

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search members by name, email, or username..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value as 'all' | 'active' | 'inactive' | 'expired')}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            
            <select
              value={membershipFilter}
              onChange={(e) => onMembershipFilterChange(e.target.value as 'all' | 'active' | 'expired' | 'expiring_soon')}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Memberships</option>
              <option value="active">Active Memberships</option>
              <option value="expired">Expired Memberships</option>
              <option value="expiring_soon">Expiring Soon</option>
            </select>
          </div>
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