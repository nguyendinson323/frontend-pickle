import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FiAward,
  FiCalendar,
  FiClock,
  FiUsers,
  FiArrowRight,
  FiPlus,
  FiTarget,
  FiTrendingUp
} from 'react-icons/fi'

interface ClubUpcomingTournament {
  id: number
  name: string
  description: string | null
  start_date: string
  end_date: string
  registration_deadline?: string
  entry_fee: number
  max_participants: number
  status: string
  tournament_type?: string
  created_at: string
}

interface ClubUpcomingTournamentsProps {
  tournaments: ClubUpcomingTournament[]
}

const ClubUpcomingTournaments: React.FC<ClubUpcomingTournamentsProps> = ({ tournaments }) => {
  const navigate = useNavigate()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="bg-white shadow-2xl rounded-3xl border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-yellow-50 to-orange-100 p-8 border-b-2 border-yellow-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center text-white mr-4">
              <FiAward className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Upcoming Tournaments</h3>
              <p className="text-yellow-700 font-medium">{tournaments.length} tournament{tournaments.length !== 1 ? 's' : ''} scheduled</p>
            </div>
          </div>
          <FiTrendingUp className="h-6 w-6 text-yellow-600" />
        </div>
      </div>

      <div className="p-8">
        {tournaments.length > 0 ? (
          <div className="space-y-6">
            {tournaments.slice(0, 3).map((tournament, index) => (
              <div key={tournament.id} className="p-6 bg-gradient-to-r from-gray-50 to-yellow-50 border-2 border-gray-200 hover:border-yellow-300 rounded-2xl hover:shadow-md transition-all duration-200 animate-table-row" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center text-white mr-4 shadow-lg">
                      <FiAward className="h-7 w-7" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-1">{tournament.name}</h4>
                      <div className="flex items-center space-x-4 mb-2">
                        <div className="flex items-center text-yellow-700">
                          <FiTarget className="h-4 w-4 mr-2" />
                          <span className="text-sm font-medium">{tournament.tournament_type || 'Tournament'}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center text-gray-600">
                          <FiCalendar className="h-4 w-4 mr-2" />
                          <span className="text-sm font-medium">{formatDate(tournament.start_date)}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <FiClock className="h-4 w-4 mr-2" />
                          <span className="text-sm font-medium">{formatTime(tournament.start_date)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="inline-flex items-center px-3 py-1 text-sm font-bold rounded-2xl border-2 bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border-yellow-200 shadow-sm">
                      <FiUsers className="h-4 w-4 mr-2" />
                      {tournament.max_participants || 'Unlimited'} max
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="pt-4">
              <button
                onClick={() => navigate('/club/tournaments')}
                className="inline-flex items-center w-full justify-center px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-700 text-white font-bold rounded-2xl hover:from-yellow-700 hover:to-orange-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                <FiAward className="h-5 w-5 mr-2" />
                View All Tournaments
                <FiArrowRight className="h-5 w-5 ml-2" />
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <FiAward className="h-10 w-10 text-gray-500" />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">No Upcoming Tournaments</h4>
            <p className="text-gray-600 mb-6 max-w-sm mx-auto">No tournaments are currently scheduled. Create your first tournament to engage your members!</p>
            <button
              onClick={() => navigate('/club/tournaments')}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-700 text-white font-bold rounded-2xl hover:from-yellow-700 hover:to-orange-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              <FiPlus className="h-5 w-5 mr-2" />
              Create Tournament
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ClubUpcomingTournaments