import React from 'react'
import { ManagementStats } from '../../../store/slices/stateManagementSlice'

interface ManagementHeaderProps {
  stats: ManagementStats | null
  onCreateTournament: () => void
}

const ManagementHeader: React.FC<ManagementHeaderProps> = ({ stats, onCreateTournament }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">State Management</h1>
          <p className="text-gray-600 mt-1">Manage tournaments, courts, clubs, and partners in your state</p>
        </div>
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
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stats.total_tournaments}</div>
            <div className="text-sm text-gray-600">Total Tournaments</div>
            <div className="text-xs text-gray-500 mt-1">{stats.active_tournaments} active</div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{stats.total_courts}</div>
            <div className="text-sm text-gray-600">Courts Available</div>
            <div className="text-xs text-gray-500 mt-1">{stats.active_courts} active</div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{stats.total_clubs}</div>
            <div className="text-sm text-gray-600">Clubs</div>
            <div className="text-xs text-gray-500 mt-1">{stats.active_clubs} active</div>
          </div>
          
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{stats.total_partners}</div>
            <div className="text-sm text-gray-600">Partners</div>
            <div className="text-xs text-gray-500 mt-1">{stats.active_partners} active</div>
          </div>
          
          <div className="bg-indigo-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-indigo-600">{stats.court_utilization_rate}%</div>
            <div className="text-sm text-gray-600">Court Utilization</div>
            <div className="text-xs text-gray-500 mt-1">This month</div>
          </div>
        </div>
      )}

      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex">
          <svg className="flex-shrink-0 h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              State Committee Responsibilities
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                As a state committee, you can create and manage tournaments, monitor court activities, 
                supervise clubs and partners, and oversee pickleball development in your state.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManagementHeader