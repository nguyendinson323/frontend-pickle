import React from 'react'

interface StateProfile {
  committeeName: string
  stateCoverage: string
  presidentName: string
  committeeLogoUrl?: string
}

interface StateDashboardHeaderProps {
  profile: StateProfile
}

const StateDashboardHeader: React.FC<StateDashboardHeaderProps> = ({ profile }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center">
        <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mr-4">
          {profile.committeeLogoUrl ? (
            <img src={profile.committeeLogoUrl} alt="Committee Logo" className="w-16 h-16 rounded-full object-cover" />
          ) : (
            <span className="text-2xl text-white">🏛️</span>
          )}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{profile.committeeName}</h1>
          <p className="text-gray-600">State Committee • {profile.stateCoverage}</p>
          <p className="text-sm text-gray-500">President: {profile.presidentName}</p>
        </div>
      </div>
    </div>
  )
}

export default StateDashboardHeader