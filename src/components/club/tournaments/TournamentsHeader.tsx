import React from 'react'
import { TournamentStats } from '../../../store/slices/clubTournamentsSlice'
import {
  FiPlus,
  FiAward,
  FiCalendar,
  FiClock,
  FiCheckCircle,
  FiUsers,
  FiDollarSign
} from 'react-icons/fi'

interface TournamentsHeaderProps {
  stats: TournamentStats | null
  onCreateTournament: () => void
}

const TournamentsHeader: React.FC<TournamentsHeaderProps> = ({ stats, onCreateTournament }) => {
  return (
    <div className="bg-gradient-to-br from-white to-purple-50 border border-purple-200 rounded-3xl shadow-2xl p-8 mb-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3 flex items-center">
            <FiAward className="h-10 w-10 mr-4 text-purple-600" />
            Club Tournaments
          </h1>
          <p className="text-lg text-gray-600 font-medium">Manage and organize your club tournaments</p>
        </div>
        <button
          onClick={onCreateTournament}
          className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white px-6 py-3 rounded-2xl flex items-center font-bold shadow-lg hover:shadow-xl transition-all duration-200 hover:transform hover:scale-105"
        >
          <FiPlus className="w-5 h-5 mr-2" />
          Create Tournament
        </button>
      </div>
      
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:transform hover:scale-105">
            <div className="flex items-center justify-between mb-2">
              <FiAward className="h-8 w-8 text-blue-500" />
              <div className="text-3xl font-bold text-blue-600">{stats.total_tournaments}</div>
            </div>
            <div className="text-sm font-bold text-gray-700">Total Tournaments</div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-100 border border-green-200 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:transform hover:scale-105">
            <div className="flex items-center justify-between mb-2">
              <FiClock className="h-8 w-8 text-green-500" />
              <div className="text-3xl font-bold text-green-600">{stats.active_tournaments}</div>
            </div>
            <div className="text-sm font-bold text-gray-700">Active Tournaments</div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-100 border border-purple-200 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:transform hover:scale-105">
            <div className="flex items-center justify-between mb-2">
              <FiCheckCircle className="h-8 w-8 text-purple-500" />
              <div className="text-3xl font-bold text-purple-600">{stats.completed_tournaments}</div>
            </div>
            <div className="text-sm font-bold text-gray-700">Completed</div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-red-100 border border-orange-200 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:transform hover:scale-105">
            <div className="flex items-center justify-between mb-2">
              <FiCalendar className="h-8 w-8 text-orange-500" />
              <div className="text-3xl font-bold text-orange-600">{stats.upcoming_tournaments}</div>
            </div>
            <div className="text-sm font-bold text-gray-700">Upcoming</div>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-blue-100 border border-indigo-200 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:transform hover:scale-105">
            <div className="flex items-center justify-between mb-2">
              <FiUsers className="h-8 w-8 text-indigo-500" />
              <div className="text-3xl font-bold text-indigo-600">{stats.total_participants}</div>
            </div>
            <div className="text-sm font-bold text-gray-700">Total Participants</div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-orange-100 border border-yellow-200 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:transform hover:scale-105">
            <div className="flex items-center justify-between mb-2">
              <FiDollarSign className="h-8 w-8 text-yellow-600" />
              <div className="text-3xl font-bold text-yellow-600">${stats.total_revenue}</div>
            </div>
            <div className="text-sm font-bold text-gray-700">Total Revenue</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TournamentsHeader