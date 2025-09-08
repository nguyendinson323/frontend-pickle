import React from 'react'
import { Club } from '../../../types'

interface ClubDashboardHeaderProps {
  profile: Club
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