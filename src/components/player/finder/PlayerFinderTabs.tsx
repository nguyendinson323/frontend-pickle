import React from 'react'

interface PlayerFinderTabsProps {
  activeTab: 'search' | 'sent' | 'received'
  setActiveTab: (tab: 'search' | 'sent' | 'received') => void
  sentRequestsCount: number
  receivedRequestsCount: number
}

const PlayerFinderTabs: React.FC<PlayerFinderTabsProps> = ({
  activeTab,
  setActiveTab,
  sentRequestsCount,
  receivedRequestsCount
}) => {
  return (
    <div className="mb-8">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('search')}
            className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'search'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Search Players
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'sent'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Sent Requests ({sentRequestsCount})
          </button>
          <button
            onClick={() => setActiveTab('received')}
            className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'received'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Received Requests ({receivedRequestsCount})
          </button>
        </nav>
      </div>
    </div>
  )
}

export default PlayerFinderTabs