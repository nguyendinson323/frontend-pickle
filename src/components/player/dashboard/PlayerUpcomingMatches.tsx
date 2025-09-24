import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FiCalendar,
  FiClock,
  FiUser,
  FiArrowRight,
  FiPlus,
  FiActivity
} from 'react-icons/fi'

interface Match {
  tournamentName: string
  opponent: string
  date: string
  time: string
  status: string
}

interface PlayerUpcomingMatchesProps {
  upcomingMatches: Match[]
}

const PlayerUpcomingMatches: React.FC<PlayerUpcomingMatchesProps> = ({ upcomingMatches }) => {
  const navigate = useNavigate()

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl border-2 border-gray-100 p-8">
      <div className="flex items-center mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mr-4">
          <FiCalendar className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900">Upcoming Matches</h3>
      </div>
      {upcomingMatches.length > 0 ? (
        <div className="space-y-6">
          {upcomingMatches.slice(0, 3).map((match, index) => (
            <div key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-2 border-blue-200 rounded-2xl hover:shadow-lg transition-all duration-300 hover:transform hover:scale-105">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4">
                      <FiActivity className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-blue-900 text-lg">{match.tournamentName}</p>
                      <div className="flex items-center text-blue-700 text-sm font-medium">
                        <FiUser className="w-4 h-4 mr-2" />
                        <span>vs {match.opponent}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center text-blue-600">
                      <FiCalendar className="w-4 h-4 mr-2" />
                      <span className="font-medium">{match.date}</span>
                    </div>
                    <div className="flex items-center text-blue-600">
                      <FiClock className="w-4 h-4 mr-2" />
                      <span className="font-medium">{match.time}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                    {match.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={() => navigate('/player/rankings')}
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700 text-sm font-bold transition-colors duration-200"
          >
            View match history
            <FiArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <FiCalendar className="w-10 h-10 text-white" />
          </div>
          <h4 className="text-xl font-bold text-gray-900 mb-3">No upcoming matches</h4>
          <p className="text-gray-600 mb-6 font-medium">Ready to compete? Join a tournament to get started!</p>
          <button
            onClick={() => navigate('/player/tournament-browse')}
            className="inline-flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl text-sm font-bold transition-all duration-300 shadow-xl hover:shadow-2xl hover:transform hover:scale-105"
          >
            <FiPlus className="w-5 h-5 mr-3" />
            Join a Tournament
          </button>
        </div>
      )}
    </div>
  )
}

export default PlayerUpcomingMatches