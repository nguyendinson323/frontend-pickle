import React from 'react'
import { FiSearch, FiUser } from 'react-icons/fi'

interface TournamentBrowseTabsProps {
  activeTab: 'browse' | 'registered'
  setActiveTab: (tab: 'browse' | 'registered') => void
  registrationCount: number
}

const TournamentBrowseTabs: React.FC<TournamentBrowseTabsProps> = ({
  activeTab,
  setActiveTab,
  registrationCount
}) => {
  return (
    <div className="mb-8">
      <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 p-2">
        <nav className="flex space-x-2" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('browse')}
            className={`flex items-center px-6 py-4 font-bold text-sm rounded-2xl transition-all duration-300 shadow-lg transform hover:scale-105 ${
              activeTab === 'browse'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl'
                : 'bg-gray-50 text-gray-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-700 border-2 border-gray-200 hover:border-indigo-200'
            }`}
          >
            <FiSearch className={`w-5 h-5 mr-3 ${
              activeTab === 'browse' ? 'text-white' : 'text-gray-500'
            }`} />
            Browse Tournaments
          </button>
          <button
            onClick={() => setActiveTab('registered')}
            className={`flex items-center px-6 py-4 font-bold text-sm rounded-2xl transition-all duration-300 shadow-lg transform hover:scale-105 relative ${
              activeTab === 'registered'
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-xl'
                : 'bg-gray-50 text-gray-600 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:text-green-700 border-2 border-gray-200 hover:border-green-200'
            }`}
          >
            <FiUser className={`w-5 h-5 mr-3 ${
              activeTab === 'registered' ? 'text-white' : 'text-gray-500'
            }`} />
            My Registrations
            {registrationCount > 0 && (
              <span className={`ml-3 px-3 py-1 text-xs font-bold rounded-full ${
                activeTab === 'registered'
                  ? 'bg-white text-green-600'
                  : 'bg-green-600 text-white'
              }`}>
                {registrationCount}
              </span>
            )}
          </button>
        </nav>
      </div>
    </div>
  )
}

export default TournamentBrowseTabs