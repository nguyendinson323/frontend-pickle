import React from 'react'
import { Coach } from '../../../types'

interface CoachDashboardHeaderProps {
  profile: Coach
}

const CoachDashboardHeader: React.FC<CoachDashboardHeaderProps> = ({ profile }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center">
        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mr-4">
          {profile.profile_photo_url ? (
            <img src={profile.profile_photo_url} alt="Profile" className="w-16 h-16 rounded-full object-cover" />
          ) : (
            <span className="text-2xl text-white">👨‍🏫</span>
          )}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome, Coach {profile.full_name}</h1>
          <p className="text-gray-600">Certified Pickleball Coach{profile.state?.name && ` • ${profile.state.name}`}</p>
        </div>
      </div>
    </div>
  )
}

export default CoachDashboardHeader