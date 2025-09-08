import React from 'react'
import { useNavigate } from 'react-router-dom'

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
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">State Performance Overview</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-3xl mb-2">📈</div>
          <h4 className="font-semibold text-gray-900 mb-1">Player Growth</h4>
          <p className="text-2xl font-bold text-green-600">+{stateData.playerGrowth || 0}%</p>
          <p className="text-sm text-gray-600">This year</p>
        </div>

        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-3xl mb-2">🏢</div>
          <h4 className="font-semibold text-gray-900 mb-1">New Clubs</h4>
          <p className="text-2xl font-bold text-purple-600">{stateData.newClubs || 0}</p>
          <p className="text-sm text-gray-600">This quarter</p>
        </div>

        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-3xl mb-2">🏆</div>
          <h4 className="font-semibold text-gray-900 mb-1">Tournament Success</h4>
          <p className="text-2xl font-bold text-yellow-600">{stateData.tournamentParticipation || 0}%</p>
          <p className="text-sm text-gray-600">Participation rate</p>
        </div>

        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-3xl mb-2">⭐</div>
          <h4 className="font-semibold text-gray-900 mb-1">National Ranking</h4>
          <p className="text-2xl font-bold text-red-600">#{stateData.nationalRanking || 0}</p>
          <p className="text-sm text-gray-600">Among states</p>
        </div>
      </div>

      <div className="border-t pt-6">
        <h4 className="font-semibold text-gray-900 mb-4">Committee Responsibilities</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>State-wide pickleball development</span>
          </div>
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Regional tournament organization</span>
          </div>
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Club and player oversight</span>
          </div>
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Coordination with national federation</span>
          </div>
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Promote sport growth and participation</span>
          </div>
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>State ranking and classification system</span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => navigate('/state/microsite')}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
        >
          Manage State Website
        </button>
        <button
          onClick={() => navigate('/state/federation-report')}
          className="border border-red-600 text-red-600 hover:bg-red-50 px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
        >
          Submit Federation Report
        </button>
      </div>
    </div>
  )
}

export default StatePerformanceOverview