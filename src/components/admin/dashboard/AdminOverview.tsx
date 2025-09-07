import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'

const AdminOverview: React.FC = () => {
  const { statistics, users, loading } = useSelector((state: RootState) => state.admin)

  if (loading) {
    return <div className="p-4">Loading overview...</div>
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">System Overview</h2>
        <p className="text-gray-600">Complete federation statistics and recent activity</p>
      </div>

      {/* User Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-blue-50 rounded-lg p-6">
          <div className="flex items-center">
            <div className="text-3xl text-blue-600">🎾</div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-blue-900">
                {statistics?.totalUsers.players || 0}
              </div>
              <div className="text-sm text-blue-700">Players</div>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-6">
          <div className="flex items-center">
            <div className="text-3xl text-green-600">👨‍🏫</div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-green-900">
                {statistics?.totalUsers.coaches || 0}
              </div>
              <div className="text-sm text-green-700">Coaches</div>
            </div>
          </div>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-6">
          <div className="flex items-center">
            <div className="text-3xl text-purple-600">🏢</div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-purple-900">
                {statistics?.totalUsers.clubs || 0}
              </div>
              <div className="text-sm text-purple-700">Clubs</div>
            </div>
          </div>
        </div>
        
        <div className="bg-orange-50 rounded-lg p-6">
          <div className="flex items-center">
            <div className="text-3xl text-orange-600">🤝</div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-orange-900">
                {statistics?.totalUsers.partners || 0}
              </div>
              <div className="text-sm text-orange-700">Partners</div>
            </div>
          </div>
        </div>
        
        <div className="bg-red-50 rounded-lg p-6">
          <div className="flex items-center">
            <div className="text-3xl text-red-600">🏛️</div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-red-900">
                {statistics?.totalUsers.states || 0}
              </div>
              <div className="text-sm text-red-700">State Committees</div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent User Activity</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">New Registrations (24h)</span>
              <span className="font-semibold text-gray-900">
                {statistics?.activeUsers.daily || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Weekly Active Users</span>
              <span className="font-semibold text-gray-900">
                {statistics?.activeUsers.weekly || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Monthly Active Users</span>
              <span className="font-semibold text-gray-900">
                {statistics?.activeUsers.monthly || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Premium Subscriptions</span>
              <span className="font-semibold text-green-600">
                {statistics?.financials.premiumSubscriptions || 0}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tournament Status</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Active Tournaments</span>
              <span className="font-semibold text-green-600">
                {statistics?.tournaments.active || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Upcoming Tournaments</span>
              <span className="font-semibold text-blue-600">
                {statistics?.tournaments.upcoming || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Completed This Month</span>
              <span className="font-semibold text-gray-600">
                {statistics?.tournaments.completed || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Participants</span>
              <span className="font-semibold text-purple-600">
                {statistics?.tournaments.totalParticipants || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {users && users.length > 0 ? users.slice(0, 5).map((user) => (
            <div key={user.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-blue-600">
                    {user.username?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{user.username || 'Unknown'}</p>
                  <p className="text-xs text-gray-500">
                    {user.role || 'N/A'} • Joined {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  user.is_active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {user.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          )) : (
            <div className="text-gray-500 text-center py-4">No recent activity</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminOverview