import React from 'react'
import {
  FiSearch,
  FiSend,
  FiMail,
  FiBell
} from 'react-icons/fi'

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
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-2">
        <nav className="flex space-x-2" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('search')}
            className={`flex items-center px-6 py-4 rounded-2xl font-bold text-sm transition-all duration-300 hover:transform hover:scale-105 ${
              activeTab === 'search'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
            }`}
          >
            <FiSearch className={`w-5 h-5 mr-3 ${
              activeTab === 'search' ? 'text-white' : 'text-gray-500'
            }`} />
            Search Players
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`flex items-center px-6 py-4 rounded-2xl font-bold text-sm transition-all duration-300 hover:transform hover:scale-105 ${
              activeTab === 'sent'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
            }`}
          >
            <FiSend className={`w-5 h-5 mr-3 ${
              activeTab === 'sent' ? 'text-white' : 'text-gray-500'
            }`} />
            Sent Requests
            {sentRequestsCount > 0 && (
              <span className={`ml-2 px-3 py-1 rounded-full text-xs font-bold ${
                activeTab === 'sent'
                  ? 'bg-white bg-opacity-20 text-white'
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {sentRequestsCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('received')}
            className={`flex items-center px-6 py-4 rounded-2xl font-bold text-sm transition-all duration-300 hover:transform hover:scale-105 ${
              activeTab === 'received'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
            }`}
          >
            <div className="relative">
              <FiMail className={`w-5 h-5 mr-3 ${
                activeTab === 'received' ? 'text-white' : 'text-gray-500'
              }`} />
              {receivedRequestsCount > 0 && (
                <FiBell className={`absolute -top-1 -right-1 w-3 h-3 ${
                  activeTab === 'received' ? 'text-white' : 'text-orange-500'
                }`} />
              )}
            </div>
            Received Requests
            {receivedRequestsCount > 0 && (
              <span className={`ml-2 px-3 py-1 rounded-full text-xs font-bold ${
                activeTab === 'received'
                  ? 'bg-white bg-opacity-20 text-white'
                  : 'bg-orange-100 text-orange-800'
              }`}>
                {receivedRequestsCount}
              </span>
            )}
          </button>
        </nav>
      </div>
    </div>
  )
}

export default PlayerFinderTabs