import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FiBarChart2, FiTrendingUp, FiMapPin, FiAward, FiStar, FiCheck, FiGlobe, FiUsers } from 'react-icons/fi'

interface StateData {
  playerGrowth?: number
  newClubs?: number
  tournamentParticipation?: number
  nationalRanking?: number
}

interface StatePerformanceOverviewProps {
  stateData: StateData
}

const StatePerformanceOverview: React.FC<StatePerformanceOverviewProps> = ({ stateData }) => {
  const navigate = useNavigate()

  return (
    <div className="bg-white rounded-3xl shadow-2xl border-2 border-gray-100 p-8">
      <div className="flex items-center mb-8">
        <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mr-4 shadow-xl">
          <FiBarChart2 className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900">State Performance Overview</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-3xl border-2 border-green-200 text-center hover:shadow-xl transition-all duration-300">
          <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <FiTrendingUp className="w-8 h-8 text-white" />
          </div>
          <h4 className="font-bold text-gray-900 mb-2 text-lg">Player Growth</h4>
          <p className="text-3xl font-bold text-green-700 mb-2">+{stateData.playerGrowth || 0}%</p>
          <p className="text-sm text-green-600 font-medium">This year</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-3xl border-2 border-purple-200 text-center hover:shadow-xl transition-all duration-300">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <FiMapPin className="w-8 h-8 text-white" />
          </div>
          <h4 className="font-bold text-gray-900 mb-2 text-lg">New Clubs</h4>
          <p className="text-3xl font-bold text-purple-700 mb-2">{stateData.newClubs || 0}</p>
          <p className="text-sm text-purple-600 font-medium">This quarter</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-orange-100 p-6 rounded-3xl border-2 border-yellow-200 text-center hover:shadow-xl transition-all duration-300">
          <div className="w-16 h-16 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <FiAward className="w-8 h-8 text-white" />
          </div>
          <h4 className="font-bold text-gray-900 mb-2 text-lg">Tournament Success</h4>
          <p className="text-3xl font-bold text-yellow-700 mb-2">{stateData.tournamentParticipation || 0}%</p>
          <p className="text-sm text-yellow-600 font-medium">Participation rate</p>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-pink-100 p-6 rounded-3xl border-2 border-red-200 text-center hover:shadow-xl transition-all duration-300">
          <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <FiStar className="w-8 h-8 text-white" />
          </div>
          <h4 className="font-bold text-gray-900 mb-2 text-lg">National Ranking</h4>
          <p className="text-3xl font-bold text-red-700 mb-2">#{stateData.nationalRanking || 0}</p>
          <p className="text-sm text-red-600 font-medium">Among states</p>
        </div>
      </div>

      <div className="border-t-2 border-gray-200 pt-8">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mr-3 shadow-lg">
            <FiCheck className="w-5 h-5 text-white" />
          </div>
          <h4 className="text-xl font-bold text-gray-900">Committee Responsibilities</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            'State-wide pickleball development',
            'Regional tournament organization',
            'Club and player oversight',
            'Coordination with national federation',
            'Promote sport growth and participation',
            'State ranking and classification system'
          ].map((responsibility, index) => (
            <div key={index} className="flex items-center bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-2xl border-2 border-green-100">
              <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mr-3 shadow-lg">
                <FiCheck className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm font-medium text-green-800">{responsibility}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-6">
        <button
          onClick={() => navigate('/state/microsite')}
          className="flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-3xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
        >
          <FiGlobe className="w-5 h-5 mr-3" />
          Manage State Website
        </button>
        <button
          onClick={() => navigate('/state/membership')}
          className="flex items-center px-8 py-4 border-2 border-indigo-600 text-indigo-600 bg-white hover:bg-indigo-50 font-bold rounded-3xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
        >
          <FiUsers className="w-5 h-5 mr-3" />
          Membership & Affiliation
        </button>
      </div>
    </div>
  )
}

export default StatePerformanceOverview