import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'

const MembershipOverview: React.FC = () => {
  const { members, stats, loading } = useSelector((state: RootState) => state.state)

  if (loading) {
    return <div className="p-4">Loading membership data...</div>
  }

  const totalMembers = stats?.totalMembers || 0
  const totalClubs = stats?.totalClubs || 0
  const activeTournaments = stats?.activeTournaments || 0

  const membersByType = members.reduce((acc, member) => {
    acc[member.member_type] = (acc[member.member_type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Membership Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Total Members</h3>
          <p className="text-3xl font-bold text-blue-600">{totalMembers}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Total Clubs</h3>
          <p className="text-3xl font-bold text-green-600">{totalClubs}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Active Tournaments</h3>
          <p className="text-3xl font-bold text-purple-600">{activeTournaments}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">State Ranking</h3>
          <p className="text-3xl font-bold text-orange-600">
            {stats?.stateRanking ? `#${stats.stateRanking}` : 'N/A'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Membership by Type</h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            {Object.entries(membersByType).map(([type, count]) => (
              <div key={type} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 capitalize">{type}</h4>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{count}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Members</h3>
          </div>
          
          <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
            {members.slice(0, 10).map((member) => (
              <div key={member.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      {member.name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {member.member_type} • Joined: {new Date(member.joined_date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      {member.club_name || 'No club affiliation'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      member.status === 'active' 
                        ? 'bg-green-100 text-green-800'
                        : member.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {member.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MembershipOverview