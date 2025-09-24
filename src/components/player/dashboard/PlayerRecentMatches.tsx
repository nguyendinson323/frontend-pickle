import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FiActivity,
  FiUser,
  FiCalendar,
  FiArrowRight,
  FiCheck,
  FiX,
  FiMinus
} from 'react-icons/fi'

interface RecentMatch {
  opponent: string
  tournament: string
  date: string
  result: 'win' | 'loss' | 'draw'
  score: string
}

interface PlayerRecentMatchesProps {
  recentMatches: RecentMatch[]
}

const PlayerRecentMatches: React.FC<PlayerRecentMatchesProps> = ({ recentMatches }) => {
  const navigate = useNavigate()

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl border-2 border-gray-100 p-8">
      <div className="flex items-center mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mr-4">
          <FiActivity className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900">Recent Matches</h3>
      </div>
      {recentMatches.length > 0 ? (
        <div className="space-y-5">
          {recentMatches.slice(0, 4).map((match, index) => {
            const getResultIcon = () => {
              if (match.result === 'win') return <FiCheck className="w-5 h-5 text-white" />
              if (match.result === 'loss') return <FiX className="w-5 h-5 text-white" />
              return <FiMinus className="w-5 h-5 text-white" />
            }

            const getResultColor = () => {
              if (match.result === 'win') return 'from-green-500 to-emerald-600'
              if (match.result === 'loss') return 'from-red-500 to-pink-600'
              return 'from-gray-500 to-gray-600'
            }

            const getBgColor = () => {
              if (match.result === 'win') return 'from-green-50 to-emerald-50 border-green-200'
              if (match.result === 'loss') return 'from-red-50 to-pink-50 border-red-200'
              return 'from-gray-50 to-slate-50 border-gray-200'
            }

            return (
              <div key={index} className={`bg-gradient-to-r ${getBgColor()} p-6 border-2 rounded-2xl hover:shadow-lg transition-all duration-300 hover:transform hover:scale-105`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4">
                        <FiUser className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-lg">vs {match.opponent}</p>
                        <p className="text-sm text-gray-700 font-medium">{match.tournament}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <FiCalendar className="w-4 h-4 mr-2" />
                      <span className="font-medium">{match.date}</span>
                      <span className="mx-3 text-gray-400">•</span>
                      <span className="font-medium">Score: {match.score}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`w-12 h-12 bg-gradient-to-br ${getResultColor()} rounded-xl flex items-center justify-center shadow-lg mb-2`}>
                      {getResultIcon()}
                    </div>
                    <span className={`text-xs font-bold uppercase tracking-wide ${
                      match.result === 'win' ? 'text-green-700' :
                      match.result === 'loss' ? 'text-red-700' : 'text-gray-700'
                    }`}>
                      {match.result}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
          <button
            onClick={() => navigate('/player/rankings')}
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700 text-sm font-bold transition-colors duration-200 mt-4"
          >
            View match history
            <FiArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <FiActivity className="w-10 h-10 text-white" />
          </div>
          <h4 className="text-xl font-bold text-gray-900 mb-3">No recent matches</h4>
          <p className="text-gray-600 font-medium">Your match history will appear here</p>
        </div>
      )}
    </div>
  )
}

export default PlayerRecentMatches