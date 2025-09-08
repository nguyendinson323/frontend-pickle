import React from 'react'

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
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Achievements</h3>
      <div className="space-y-4">
        {playerData.tournamentWins > 0 && (
          <div className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="text-3xl mr-4">🏆</div>
            <div>
              <p className="font-medium text-yellow-800">Tournament Champion</p>
              <p className="text-sm text-yellow-600">{playerData.tournamentWins} tournament wins</p>
            </div>
          </div>
        )}
        
        {playerData.totalMatches >= 10 && (
          <div className="flex items-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-3xl mr-4">🎖️</div>
            <div>
              <p className="font-medium text-blue-800">Experienced Player</p>
              <p className="text-sm text-blue-600">{playerData.totalMatches} matches played</p>
            </div>
          </div>
        )}
        
        {playerData.currentRanking <= 100 && (
          <div className="flex items-center p-3 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="text-3xl mr-4">⭐</div>
            <div>
              <p className="font-medium text-purple-800">Top 100 Player</p>
              <p className="text-sm text-purple-600">Ranked #{playerData.currentRanking}</p>
            </div>
          </div>
        )}

        <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="text-3xl mr-4">✅</div>
          <div>
            <p className="font-medium text-green-800">Verified Player</p>
            <p className="text-sm text-green-600">Active federation member</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlayerAchievements