import React from 'react'
import {
  FiUser,
  FiMapPin,
  FiAward,
  FiStar
} from 'react-icons/fi'

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
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center mb-6 lg:mb-0">
            <div className="relative">
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-3xl flex items-center justify-center mr-6 shadow-lg">
                {profile.profilePhotoUrl ? (
                  <img src={profile.profilePhotoUrl} alt="Profile" className="w-20 h-20 rounded-3xl object-cover" />
                ) : (
                  <FiUser className="w-10 h-10 text-white" />
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                <FiStar className="w-4 h-4 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Welcome back, {profile.fullName}!</h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center">
                  <FiAward className="w-5 h-5 mr-2 text-indigo-200" />
                  <span className="text-lg font-medium text-indigo-100">NRTP Level {profile.nrtpLevel}</span>
                </div>
                <div className="flex items-center">
                  <FiMapPin className="w-5 h-5 mr-2 text-indigo-200" />
                  <span className="text-lg font-medium text-indigo-100">{profile.state}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white bg-opacity-10 rounded-2xl p-6 backdrop-blur-sm border border-white border-opacity-20">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                <FiAward className="w-8 h-8 text-white" />
              </div>
              <p className="text-sm font-medium text-indigo-100 mb-1">Player Status</p>
              <p className="text-lg font-bold text-white">Active Member</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlayerDashboardHeader