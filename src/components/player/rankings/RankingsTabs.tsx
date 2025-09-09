import React from 'react'

interface RankingsTabsProps {
  activeTab: 'overview' | 'matches' | 'tournaments' | 'leaderboards' | 'compare'
  onTabChange: (tab: 'overview' | 'matches' | 'tournaments' | 'leaderboards' | 'compare') => void
}

const RankingsTabs: React.FC<RankingsTabsProps> = ({
  activeTab,
  onTabChange
}) => {
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'matches', label: 'Recent Matches' },
    { id: 'tournaments', label: 'Tournaments' },
    { id: 'leaderboards', label: 'Leaderboards' },
    { id: 'compare', label: 'Compare Players' }
  ]

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}

export default RankingsTabs