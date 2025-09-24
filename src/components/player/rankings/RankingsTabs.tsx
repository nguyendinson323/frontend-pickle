import React from 'react'
import {
  FiBarChart2,
  FiActivity,
  FiAward,
  FiUsers,
  FiTarget
} from 'react-icons/fi'

interface RankingsTabsProps {
  activeTab: 'overview' | 'matches' | 'tournaments' | 'leaderboards' | 'compare'
  onTabChange: (tab: 'overview' | 'matches' | 'tournaments' | 'leaderboards' | 'compare') => void
}

const RankingsTabs: React.FC<RankingsTabsProps> = ({
  activeTab,
  onTabChange
}) => {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiBarChart2 },
    { id: 'matches', label: 'Recent Matches', icon: FiActivity },
    { id: 'tournaments', label: 'Tournaments', icon: FiAward },
    { id: 'leaderboards', label: 'Leaderboards', icon: FiUsers },
    { id: 'compare', label: 'Compare Players', icon: FiTarget }
  ]

  return (
    <div className="bg-gradient-to-r from-gray-50 to-indigo-50 border-b-2 border-gray-100 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex flex-wrap space-x-2 sm:space-x-4 py-4" aria-label="Tabs">
          {tabs.map(tab => {
            const IconComponent = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id as any)}
                className={`py-3 px-4 sm:px-6 rounded-2xl font-bold text-sm flex items-center space-x-2 transition-all duration-300 hover:transform hover:scale-105 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:text-green-600 hover:bg-green-50 border-2 border-gray-200 hover:border-green-300 shadow-md'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
              </button>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

export default RankingsTabs