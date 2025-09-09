import React from 'react'
import { TournamentStats } from '../../../store/slices/clubTournamentsSlice'

interface TournamentsHeaderProps {
  stats: TournamentStats | null
  onCreateTournament: () => void
}

const TournamentsHeader: React.FC<TournamentsHeaderProps> = ({ stats, onCreateTournament }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Club Tournaments</h1>
        <button
          onClick={onCreateTournament}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Tournament
        </button>
      </div>
      
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stats.total_tournaments}</div>
            <div className="text-sm text-gray-600">Total Tournaments</div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{stats.active_tournaments}</div>
            <div className="text-sm text-gray-600">Active Tournaments</div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{stats.completed_tournaments}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{stats.upcoming_tournaments}</div>
            <div className="text-sm text-gray-600">Upcoming</div>
          </div>
          
          <div className="bg-indigo-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-indigo-600">{stats.total_participants}</div>
            <div className="text-sm text-gray-600">Total Participants</div>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">${stats.total_revenue}</div>
            <div className="text-sm text-gray-600">Total Revenue</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TournamentsHeader