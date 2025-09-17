import React from 'react'
import { MembershipStats } from '../../../store/slices/clubMembersSlice'
import {
  FiUsers,
  FiUserPlus,
  FiSettings,
  FiSearch,
  FiFilter,
  FiTrendingUp,
  FiDollarSign,
  FiCalendar,
  FiActivity,
  FiUser,
  FiUserX
} from 'react-icons/fi'

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
    <div className="bg-white shadow-2xl rounded-3xl border border-gray-100 overflow-hidden mb-8">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-100 p-8 border-b-2 border-blue-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white mr-4">
              <FiUsers className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Club Members</h1>
              <p className="text-blue-700 font-medium">Manage your club community</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onBulkActions}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold rounded-2xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiSettings className="h-5 w-5 mr-2" />
              Bulk Actions
            </button>
            <button
              onClick={onInviteMember}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white font-bold rounded-2xl hover:from-green-700 hover:to-emerald-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <FiUserPlus className="h-5 w-5 mr-2" />
              Invite Member
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-8 space-y-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search members by name, email, or username..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="block w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-2xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:border-gray-300"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => onStatusFilterChange(e.target.value as 'all' | 'active' | 'inactive' | 'expired')}
                className="pl-10 pr-8 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:border-gray-300 bg-white appearance-none cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="relative">
              <FiActivity className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={membershipFilter}
                onChange={(e) => onMembershipFilterChange(e.target.value as 'all' | 'active' | 'expired' | 'expiring_soon')}
                className="pl-10 pr-8 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:border-gray-300 bg-white appearance-none cursor-pointer"
              >
                <option value="all">All Memberships</option>
                <option value="active">Active Memberships</option>
                <option value="expired">Expired Memberships</option>
                <option value="expiring_soon">Expiring Soon</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {stats && (
        <div className="px-8 pb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 p-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <FiUsers className="h-5 w-5 text-white" />
                </div>
                <FiTrendingUp className="h-4 w-4 text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-blue-900 mb-1">{stats.total_members}</div>
              <div className="text-sm font-medium text-blue-700">Total Members</div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 p-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <FiUser className="h-5 w-5 text-white" />
                </div>
                <FiTrendingUp className="h-4 w-4 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-green-900 mb-1">{stats.active_members}</div>
              <div className="text-sm font-medium text-green-700">Active Members</div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 p-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                  <FiUserX className="h-5 w-5 text-white" />
                </div>
                <FiTrendingUp className="h-4 w-4 text-red-500" />
              </div>
              <div className="text-2xl font-bold text-red-900 mb-1">{stats.expired_members}</div>
              <div className="text-sm font-medium text-red-700">Expired Members</div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 p-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <FiActivity className="h-5 w-5 text-white" />
                </div>
                <FiTrendingUp className="h-4 w-4 text-purple-500" />
              </div>
              <div className="text-2xl font-bold text-purple-900 mb-1">{stats.average_level}</div>
              <div className="text-sm font-medium text-purple-700">Average NRTP Level</div>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-200 p-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
                  <FiDollarSign className="h-5 w-5 text-white" />
                </div>
                <FiTrendingUp className="h-4 w-4 text-yellow-500" />
              </div>
              <div className="text-2xl font-bold text-yellow-900 mb-1">${stats.membership_revenue}</div>
              <div className="text-sm font-medium text-yellow-700">Monthly Revenue</div>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-2 border-indigo-200 p-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <FiCalendar className="h-5 w-5 text-white" />
                </div>
                <FiTrendingUp className="h-4 w-4 text-indigo-500" />
              </div>
              <div className="text-2xl font-bold text-indigo-900 mb-1">{stats.new_members_this_month}</div>
              <div className="text-sm font-medium text-indigo-700">New This Month</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MembersHeader