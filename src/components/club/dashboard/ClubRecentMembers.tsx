import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FiUsers,
  FiUser,
  FiArrowRight,
  FiUserPlus,
  FiClock,
  FiTrendingUp
} from 'react-icons/fi'

interface Member {
  id: number
  full_name: string
  profile_photo_url: string | null
  nrtp_level: number
  created_at: string
}

interface ClubRecentMembersProps {
  members: Member[]
}

const ClubRecentMembers: React.FC<ClubRecentMembersProps> = ({ members }) => {
  const navigate = useNavigate()

  const formatJoinedDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return '1 day ago'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    return `${Math.ceil(diffDays / 30)} months ago`
  }

  return (
    <div className="bg-white shadow-2xl rounded-3xl border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-green-50 to-emerald-100 p-8 border-b-2 border-green-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white mr-4">
              <FiUsers className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">New Members</h3>
              <p className="text-green-700 font-medium">{members.length} recent addition{members.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <FiTrendingUp className="h-6 w-6 text-green-600" />
        </div>
      </div>

      <div className="p-8">
        {members.length > 0 ? (
          <div className="space-y-4">
            {members.slice(0, 4).map((member, index) => (
              <div key={member.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-green-50 border-2 border-gray-200 hover:border-green-300 rounded-2xl hover:shadow-md transition-all duration-200 animate-table-row" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="flex items-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                    {member.profile_photo_url ? (
                      <img src={member.profile_photo_url} alt="Member" className="w-14 h-14 rounded-2xl object-cover" />
                    ) : (
                      <FiUser className="h-7 w-7 text-white" />
                    )}
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900 mb-1">{member.full_name}</p>
                    <div className="flex items-center text-green-700">
                      <FiTrendingUp className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">NRTP Level {member.nrtp_level}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-gray-600 bg-white rounded-xl px-3 py-2 border border-gray-200 shadow-sm">
                    <FiClock className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">{formatJoinedDate(member.created_at)}</span>
                  </div>
                </div>
              </div>
            ))}
            <div className="pt-4">
              <button
                onClick={() => navigate('/club/members')}
                className="inline-flex items-center w-full justify-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white font-bold rounded-2xl hover:from-green-700 hover:to-emerald-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <FiUsers className="h-5 w-5 mr-2" />
                View All Members
                <FiArrowRight className="h-5 w-5 ml-2" />
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <FiUsers className="h-10 w-10 text-gray-500" />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">No New Members</h4>
            <p className="text-gray-600 mb-6 max-w-sm mx-auto">No new members have joined this month. Start growing your club community!</p>
            <button
              onClick={() => navigate('/club/members')}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white font-bold rounded-2xl hover:from-green-700 hover:to-emerald-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <FiUserPlus className="h-5 w-5 mr-2" />
              Invite Members
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ClubRecentMembers