import React from 'react'

interface PlayerProfile {
  fullName: string
  nrtpLevel: string
  state: string
  profilePhotoUrl?: string
}

interface PlayerDashboardHeaderProps {
  profile: PlayerProfile
}

const PlayerDashboardHeader: React.FC<PlayerDashboardHeaderProps> = ({ profile }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center">
        <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mr-4">
          {profile.profilePhotoUrl ? (
            <img src={profile.profilePhotoUrl} alt="Profile" className="w-16 h-16 rounded-full object-cover" />
          ) : (
            <span className="text-2xl text-white">🏓</span>
          )}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {profile.fullName}</h1>
          <p className="text-gray-600">NRTP Level {profile.nrtpLevel} • {profile.state}</p>
        </div>
      </div>
    </div>
  )
}

export default PlayerDashboardHeader