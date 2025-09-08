import React from 'react'

interface PlayerRankingCardProps {
  rank: number
  name: string
  nrtpLevel: number
  points: number
  wins: number
  losses: number
  avatar?: string
  state: string
  isCurrentUser?: boolean
  onClick?: () => void
}

export const PlayerRankingCard: React.FC<PlayerRankingCardProps> = ({
  rank,
  name,
  nrtpLevel,
  points,
  wins,
  losses,
  avatar,
  state,
  isCurrentUser = false,
  onClick
}) => {
  const getRankColor = () => {
    if (rank === 1) return 'text-yellow-600'
    if (rank === 2) return 'text-gray-500'
    if (rank === 3) return 'text-orange-600'
    return 'text-gray-700'
  }

  const getRankIcon = () => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return '📍'
  }

  return (
    <div
      className={`flex items-center justify-between p-4 border-2 rounded-lg transition-all duration-200 ${
        isCurrentUser 
          ? 'border-indigo-300 bg-indigo-50' 
          : 'border-gray-200 bg-white hover:border-gray-300'
      } ${onClick ? 'cursor-pointer hover:shadow-md' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center">
        <div className="flex items-center mr-4">
          <span className="text-2xl mr-2">{getRankIcon()}</span>
          <span className={`text-xl font-bold ${getRankColor()}`}>#{rank}</span>
        </div>
        
        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-4">
          {avatar ? (
            <img src={avatar} alt={name} className="w-12 h-12 rounded-full object-cover" />
          ) : (
            <span className="text-gray-500">🏓</span>
          )}
        </div>
        
        <div>
          <h4 className={`font-semibold ${isCurrentUser ? 'text-indigo-900' : 'text-gray-900'}`}>
            {name}
            {isCurrentUser && <span className="ml-2 text-sm text-indigo-600">(You)</span>}
          </h4>
          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <span>NRTP {nrtpLevel}</span>
            <span>•</span>
            <span>{state}</span>
          </div>
        </div>
      </div>
      
      <div className="text-right">
        <div className="text-lg font-bold text-gray-900">{points} pts</div>
        <div className="text-sm text-gray-600">
          {wins}W - {losses}L
        </div>
        <div className="text-xs text-green-600">
          {wins > 0 ? Math.round((wins / (wins + losses)) * 100) : 0}% win rate
        </div>
      </div>
    </div>
  )
}