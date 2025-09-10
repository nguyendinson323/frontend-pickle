import React from 'react'

interface ClubProfile {
  id: number
  user_id: number
  name: string
  rfc: string | null
  manager_name: string
  manager_title: string
  state_id: number
  club_type: string
  website: string | null
  social_media: string | null
  logo_url: string | null
  has_courts: boolean
  premium_expires_at: string | null
  affiliation_expires_at: string | null
  created_at: string
  updated_at: string
  state: {
    id: number
    name: string
    code: string
  }
}

interface ClubDashboardHeaderProps {
  profile: ClubProfile
}

const ClubDashboardHeader: React.FC<ClubDashboardHeaderProps> = ({ profile }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center">
        <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mr-4">
          {profile.logo_url ? (
            <img src={profile.logo_url} alt="Club Logo" className="w-16 h-16 rounded-full object-cover" />
          ) : (
            <span className="text-2xl text-white">🏢</span>
          )}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
          <p className="text-gray-600">{profile.club_type} Club{profile.state?.name && ` • ${profile.state.name}`}</p>
          <p className="text-sm text-gray-500">Manager: {profile.manager_name || 'Not specified'}</p>
        </div>
      </div>
    </div>
  )
}

export default ClubDashboardHeader