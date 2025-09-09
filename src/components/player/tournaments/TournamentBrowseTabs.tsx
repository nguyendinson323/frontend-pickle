import React from 'react'

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
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('browse')}
            className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'browse'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Browse Tournaments
          </button>
          <button
            onClick={() => setActiveTab('registered')}
            className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'registered'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            My Registrations ({registrationCount})
          </button>
        </nav>
      </div>
    </div>
  )
}

export default TournamentBrowseTabs