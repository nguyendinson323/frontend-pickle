import React from 'react'

interface LeaderboardViewProps {
  selectedRankingType: 'overall' | 'state' | 'club' | 'age_group'
  onRankingTypeChange: (rankingType: 'overall' | 'state' | 'club' | 'age_group') => void
  leaderboards: any
  getRankChangeIcon: (change: string) => string
  getRankChangeColor: (change: string) => string
}

const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  selectedRankingType,
  onRankingTypeChange,
  leaderboards,
  getRankChangeIcon,
  getRankChangeColor
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">Leaderboards</h3>
        <select
          value={selectedRankingType}
          onChange={(e) => onRankingTypeChange(e.target.value as any)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
        >
          <option value="overall">Overall</option>
          <option value="state">State</option>
          <option value="club">Club</option>
          <option value="age_group">Age Group</option>
        </select>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="text-md font-medium text-gray-900 capitalize">
            {selectedRankingType.replace('_', ' ')} Rankings
          </h4>
        </div>
        
        <div className="divide-y divide-gray-200">
          {leaderboards[selectedRankingType].map((player: any, index: number) => (
            <div key={player.player_id} className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  index < 3 
                    ? index === 0 ? 'bg-yellow-100 text-yellow-800' 
                      : index === 1 ? 'bg-gray-100 text-gray-800'
                      : 'bg-orange-100 text-orange-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {index + 1}
                </div>
                
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {player.player.full_name.charAt(0)}
                  </span>
                </div>
                
                <div>
                  <p className="font-medium text-gray-900">{player.player.full_name}</p>
                  <p className="text-sm text-gray-500">{player.player.skill_level}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{player.points} pts</p>
                  <p className="text-xs text-gray-500">{player.matches_played_period} matches</p>
                </div>
                
                <div className={`flex items-center ${getRankChangeColor(player.rank_change)}`}>
                  <span className="text-lg">{getRankChangeIcon(player.rank_change)}</span>
                  {player.rank_change_amount > 0 && (
                    <span className="text-sm font-medium ml-1">
                      {player.rank_change_amount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default LeaderboardView