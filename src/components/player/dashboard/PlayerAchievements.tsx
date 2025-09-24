import React from 'react'
import {
  FiAward,
  FiStar,
  FiCheckCircle,
  FiTarget
} from 'react-icons/fi'

interface PlayerData {
  tournamentWins: number
  totalMatches: number
  currentRanking: number
}

interface PlayerAchievementsProps {
  playerData: PlayerData
}

const PlayerAchievements: React.FC<PlayerAchievementsProps> = ({ playerData }) => {
  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl border-2 border-gray-100 p-8">
      <div className="flex items-center mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center mr-4">
          <FiAward className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900">Recent Achievements</h3>
      </div>
      <div className="space-y-6">
        {playerData.tournamentWins > 0 && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 border-2 border-yellow-200 rounded-2xl hover:shadow-lg transition-all duration-300 hover:transform hover:scale-105">
            <div className="flex items-center">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center mr-6 shadow-lg">
                <FiAward className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-yellow-900 text-lg mb-1">Tournament Champion</p>
                <p className="text-yellow-700 font-medium">{playerData.tournamentWins} tournament wins</p>
              </div>
              <div className="text-yellow-600">
                <FiTarget className="w-8 h-8" />
              </div>
            </div>
          </div>
        )}

        {playerData.totalMatches >= 10 && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-2 border-blue-200 rounded-2xl hover:shadow-lg transition-all duration-300 hover:transform hover:scale-105">
            <div className="flex items-center">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mr-6 shadow-lg">
                <FiAward className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-blue-900 text-lg mb-1">Experienced Player</p>
                <p className="text-blue-700 font-medium">{playerData.totalMatches} matches played</p>
              </div>
              <div className="text-blue-600">
                <FiTarget className="w-8 h-8" />
              </div>
            </div>
          </div>
        )}

        {playerData.currentRanking > 0 && playerData.currentRanking <= 100 && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 border-2 border-purple-200 rounded-2xl hover:shadow-lg transition-all duration-300 hover:transform hover:scale-105">
            <div className="flex items-center">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mr-6 shadow-lg">
                <FiStar className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-purple-900 text-lg mb-1">Top 100 Player</p>
                <p className="text-purple-700 font-medium">Ranked #{playerData.currentRanking}</p>
              </div>
              <div className="text-purple-600">
                <FiTarget className="w-8 h-8" />
              </div>
            </div>
          </div>
        )}

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 border-2 border-green-200 rounded-2xl hover:shadow-lg transition-all duration-300 hover:transform hover:scale-105">
          <div className="flex items-center">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mr-6 shadow-lg">
              <FiCheckCircle className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-green-900 text-lg mb-1">Verified Player</p>
              <p className="text-green-700 font-medium">Active federation member</p>
            </div>
            <div className="text-green-600">
              <FiTarget className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlayerAchievements