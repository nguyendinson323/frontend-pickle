import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FiAward, FiMapPin, FiCalendar, FiUsers, FiChevronRight, FiPlus, FiInbox } from 'react-icons/fi'

interface Tournament {
  name: string
  location: string
  date: string
  categories: string
  registrations: number
}

interface StateUpcomingTournamentsProps {
  upcomingTournaments: Tournament[]
}

const StateUpcomingTournaments: React.FC<StateUpcomingTournamentsProps> = ({ upcomingTournaments }) => {
  const navigate = useNavigate()

  return (
    <div className="bg-white rounded-3xl shadow-2xl border-2 border-gray-100 p-8">
      <div className="flex items-center mb-8">
        <div className="w-12 h-12 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-full flex items-center justify-center mr-4 shadow-xl">
          <FiAward className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900">Upcoming State Tournaments</h3>
      </div>
      {upcomingTournaments.length > 0 ? (
        <div className="space-y-6">
          {upcomingTournaments.slice(0, 3).map((tournament, index) => (
            <div
              key={index}
              className="bg-gradient-to-r from-gray-50 to-white p-6 border-2 border-gray-200 rounded-3xl hover:border-yellow-300 hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105 group"
              onClick={() => navigate('/state/management')}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mr-3 shadow-lg">
                      <FiAward className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-lg">{tournament.name}</h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                    <div className="flex items-center bg-blue-50 p-3 rounded-2xl border-2 border-blue-100">
                      <FiMapPin className="w-4 h-4 text-blue-600 mr-2" />
                      <span className="text-sm font-medium text-blue-700">{tournament.location}</span>
                    </div>
                    <div className="flex items-center bg-green-50 p-3 rounded-2xl border-2 border-green-100">
                      <FiCalendar className="w-4 h-4 text-green-600 mr-2" />
                      <span className="text-sm font-medium text-green-700">{tournament.date}</span>
                    </div>
                    <div className="flex items-center bg-purple-50 p-3 rounded-2xl border-2 border-purple-100">
                      <FiUsers className="w-4 h-4 text-purple-600 mr-2" />
                      <span className="text-sm font-medium text-purple-700">{tournament.categories}</span>
                    </div>
                  </div>
                </div>
                <div className="ml-6 flex flex-col items-center">
                  <span className="bg-gradient-to-r from-red-500 to-pink-600 text-white text-sm font-bold px-4 py-2 rounded-2xl shadow-lg mb-3">
                    {tournament.registrations} players
                  </span>
                  <FiChevronRight className="w-6 h-6 text-gray-400 group-hover:text-yellow-600 group-hover:scale-110 transition-all duration-300" />
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={() => navigate('/state/management')}
            className="flex items-center text-yellow-600 hover:text-yellow-700 text-sm font-bold group transition-colors duration-300"
          >
            View all tournaments
            <FiChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
            <FiInbox className="w-10 h-10 text-white" />
          </div>
          <h4 className="text-xl font-bold text-gray-900 mb-2">No Upcoming Tournaments</h4>
          <p className="text-gray-600 font-medium mb-8">Ready to organize an exciting tournament?</p>
          <button
            onClick={() => navigate('/state/management')}
            className="flex items-center px-8 py-4 bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-bold rounded-3xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 mx-auto"
          >
            <FiPlus className="w-5 h-5 mr-3" />
            Create Tournament
          </button>
        </div>
      )}
    </div>
  )
}

export default StateUpcomingTournaments