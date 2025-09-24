import React from 'react'
import { useNavigate } from 'react-router-dom'
import { User } from '../../../types'
import {
  FiUser,
  FiAward,
  FiMapPin,
  FiCalendar,
  FiCreditCard,
  FiArrowRight
} from 'react-icons/fi'

interface PlayerProfile {
  fullName: string
  nrtpLevel: string
  profilePhotoUrl?: string
}

interface PlayerData {
  currentRanking: number
}

interface PlayerCredentialPreviewProps {
  profile: PlayerProfile
  playerData: PlayerData
  user: User
}

const PlayerCredentialPreview: React.FC<PlayerCredentialPreviewProps> = ({ 
  profile, 
  playerData, 
  user 
}) => {
  const navigate = useNavigate()

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl border-2 border-gray-100 p-8">
      <div className="flex items-center mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4">
          <FiCreditCard className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900">Your Digital Credential</h3>
      </div>

      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center mb-6 lg:mb-0">
            <div className="relative mr-6">
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-3xl flex items-center justify-center shadow-lg">
                {profile.profilePhotoUrl ? (
                  <img src={profile.profilePhotoUrl} alt="Profile" className="w-20 h-20 rounded-3xl object-cover" />
                ) : (
                  <FiUser className="w-10 h-10 text-white" />
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                <FiAward className="w-4 h-4 text-white" />
              </div>
            </div>
            <div>
              <h4 className="text-2xl font-bold mb-2">{profile.fullName}</h4>
              <div className="space-y-1">
                <div className="flex items-center text-indigo-100">
                  <FiAward className="w-4 h-4 mr-2" />
                  <span className="font-medium">NRTP Level {profile.nrtpLevel}</span>
                </div>
                <div className="flex items-center text-indigo-100">
                  <FiMapPin className="w-4 h-4 mr-2" />
                  <span className="font-medium">Ranking: {playerData.currentRanking > 0 ? `#${playerData.currentRanking}` : 'Unranked'}</span>
                </div>
                <div className="flex items-center text-indigo-100">
                  <FiCalendar className="w-4 h-4 mr-2" />
                  <span className="font-medium">Member since {user.created_at ? new Date(user.created_at).getFullYear() : new Date().getFullYear()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center lg:items-end">
            <div className="w-28 h-28 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm border border-white border-opacity-30">
              <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-xs text-gray-600 font-medium">QR Code</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/player/profile')}
              className="inline-flex items-center bg-white bg-opacity-20 backdrop-blur-sm px-6 py-3 rounded-2xl text-white font-bold border border-white border-opacity-30 hover:bg-opacity-30 transition-all duration-300 hover:transform hover:scale-105 shadow-lg"
            >
              View Full Credential
              <FiArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlayerCredentialPreview