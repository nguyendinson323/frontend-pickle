import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../../../store'
import { fetchStateMemberData, updatePlayerStatus, updateCoachVerification, updateClubStatus, updatePartnerStatus } from '../../../../store/slices/stateMemberManagementSlice'

export const StateMemberManagementTab: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const {
    players,
    coaches,
    clubs,
    partners,
    stats,
    error
  } = useSelector((state: RootState) => state.stateMemberManagement)
  const { isLoading } = useSelector((state: RootState) => state.loading)

  const [selectedFilter, setSelectedFilter] = useState<string>('all')

  useEffect(() => {
    dispatch(fetchStateMemberData())
  }, [dispatch])

  const getMemberStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-gray-100 text-gray-800'
      case 'suspended':
        return 'bg-red-100 text-red-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getMemberTypeIcon = (memberType: string) => {
    switch (memberType?.toLowerCase()) {
      case 'club':
        return '🏟️'
      case 'player':
        return '🏓'
      case 'tournament_director':
        return '🎯'
      case 'referee':
        return '👨‍⚖️'
      default:
        return '👤'
    }
  }


  // Combine all member types into a unified array
  const allMembers = [
    ...players.map(p => ({ ...p, member_type: 'player' as const, name: p.full_name, status: p.membership_status })),
    ...coaches.map(c => ({ ...c, member_type: 'coach' as const, name: c.full_name, status: c.membership_status })),
    ...clubs.map(cl => ({ ...cl, member_type: 'club' as const, name: cl.name, status: cl.membership_status })),
    ...partners.map(pa => ({ ...pa, member_type: 'partner' as const, name: pa.business_name, status: pa.membership_status }))
  ]

  const handleMemberAction = async (memberId: number, memberType: string, action: 'suspend' | 'activate') => {
    try {
      switch (memberType) {
        case 'player':
          dispatch(updatePlayerStatus(memberId, action === 'activate' ? 'active' : 'inactive'))
          break
        case 'coach':
          dispatch(updateCoachVerification(memberId, action === 'activate'))
          break
        case 'club':
          dispatch(updateClubStatus(memberId, action === 'activate'))
          break
        case 'partner':
          dispatch(updatePartnerStatus(memberId, action === 'activate'))
          break
      }
    } catch (error) {
      console.error('Failed to update member:', error)
    }
  }

  const filteredMembers = selectedFilter === 'all'
    ? allMembers
    : allMembers.filter(member => member.status === selectedFilter)

  if (isLoading && !allMembers.length) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
          ))}
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Member Management</h3>
          <p className="text-sm text-gray-600">Manage members, applications, and membership status</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => navigate('/state/members?action=invite')}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Invite Members
          </button>
          <button
            onClick={() => navigate('/state/members')}
            className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Manage All
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Member Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Total Members</p>
              <p className="text-2xl font-bold text-blue-900">{allMembers.length}</p>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Active Members</p>
              <p className="text-2xl font-bold text-green-900">{allMembers.filter(m => m.status === 'active').length}</p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-700">Pending Applications</p>
              <p className="text-2xl font-bold text-yellow-900">0</p>
            </div>
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">New This Month</p>
              <p className="text-2xl font-bold text-purple-900">{stats?.recent_registrations || 0}</p>
            </div>
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
          </div>
        </div>
      </div>


      {/* Member Status Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {['all', 'active', 'inactive', 'suspended', 'pending'].map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                selectedFilter === filter
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter === 'all' ? 'All Members' : filter}
            </button>
          ))}
        </div>
      </div>

      {/* Members List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h4 className="font-medium text-gray-900">
            {selectedFilter === 'all' ? 'All Members' : `${selectedFilter.charAt(0).toUpperCase() + selectedFilter.slice(1)} Members`}
          </h4>
        </div>

        {filteredMembers.length === 0 ? (
          <div className="text-center py-8">
            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">No Members Found</h4>
            <p className="text-gray-600 mb-4">
              {selectedFilter === 'all'
                ? "You don't have any members yet."
                : `No ${selectedFilter} members found.`
              }
            </p>
            <button
              onClick={() => navigate('/state/members?action=invite')}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Invite Members
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredMembers.slice(0, 6).map((member) => (
              <div key={member.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {(member.member_type === 'player' || member.member_type === 'coach') && (member as any).profile_photo_url ? (
                        <img
                          src={(member as any).profile_photo_url}
                          alt={member.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (member.member_type === 'club' || member.member_type === 'partner') && (member as any).logo_url ? (
                        <img
                          src={(member as any).logo_url}
                          alt={member.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-lg">{getMemberTypeIcon(member.member_type)}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-gray-900 truncate">{member.name}</p>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getMemberStatusColor(member.status)}`}>
                          {member.status}
                        </span>
                      </div>
                      <div className="flex items-center mt-1 space-x-4 text-xs text-gray-500">
                        <span>{member.member_type}</span>
                        <span>Joined: {new Date(member.created_at).toLocaleDateString()}</span>
                        {member.user?.email && <span>{member.user.email}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => navigate(`/state/members/${member.id}`)}
                      className="text-blue-600 hover:text-blue-700 text-sm"
                      title="View Details"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    {member.status === 'active' ? (
                      <button
                        onClick={() => handleMemberAction(member.id, member.member_type, 'suspend')}
                        className="text-red-600 hover:text-red-700 text-sm"
                        title="Suspend Member"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                        </svg>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleMemberAction(member.id, member.member_type, 'activate')}
                        className="text-green-600 hover:text-green-700 text-sm"
                        title="Activate Member"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredMembers.length > 6 && (
          <div className="p-4 border-t border-gray-200 text-center">
            <button
              onClick={() => navigate('/state/members')}
              className="inline-flex items-center px-4 py-2 text-red-600 hover:text-red-700 font-medium"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              View All {filteredMembers.length} Members
            </button>
          </div>
        )}
      </div>


      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => navigate('/state/members?action=invite')}
          className="flex items-center justify-center px-4 py-3 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          Invite Members
        </button>
        <button
          onClick={() => navigate('/state/members?export=csv')}
          className="flex items-center justify-center px-4 py-3 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export Members
        </button>
        <button
          onClick={() => navigate('/state/members?bulk=true')}
          className="flex items-center justify-center px-4 py-3 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          Bulk Actions
        </button>
      </div>
    </div>
  )
}