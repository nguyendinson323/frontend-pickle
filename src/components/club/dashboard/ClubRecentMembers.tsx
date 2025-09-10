import React from 'react'
import { useNavigate } from 'react-router-dom'

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
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">New Members</h3>
      {members.length > 0 ? (
        <div className="space-y-4">
          {members.slice(0, 4).map((member) => (
            <div key={member.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                  {member.profile_photo_url ? (
                    <img src={member.profile_photo_url} alt="Member" className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <span className="text-purple-600 text-sm">👤</span>
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{member.full_name}</p>
                  <p className="text-sm text-gray-600">NRTP Level {member.nrtp_level}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">{formatJoinedDate(member.created_at)}</p>
              </div>
            </div>
          ))}
          <button
            onClick={() => navigate('/club/members')}
            className="text-purple-600 hover:text-purple-500 text-sm font-medium"
          >
            View all members →
          </button>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">👥</div>
          <p className="text-gray-600 mb-4">No new members this month</p>
          <button
            onClick={() => navigate('/club/invite')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
          >
            Invite Members
          </button>
        </div>
      )}
    </div>
  )
}

export default ClubRecentMembers