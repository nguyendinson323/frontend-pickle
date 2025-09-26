import React from 'react'
import { FiMail, FiSend, FiFileText } from 'react-icons/fi'

interface InboxTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
  messagesCount: number
  sentMessagesCount: number
  templatesCount: number
}

const InboxTabs: React.FC<InboxTabsProps> = ({
  activeTab,
  onTabChange,
  messagesCount,
  sentMessagesCount,
  templatesCount
}) => {
  const tabs = [
    {
      id: 'inbox',
      name: 'Inbox',
      count: messagesCount,
      icon: <FiMail className="w-5 h-5" />
    },
    {
      id: 'sent',
      name: 'Sent',
      count: sentMessagesCount,
      icon: <FiSend className="w-5 h-5" />
    },
    {
      id: 'templates',
      name: 'Templates',
      count: templatesCount,
      icon: <FiFileText className="w-5 h-5" />
    }
  ]

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 mb-8">
      <div className="border-b border-gray-200/50">
        <nav className="-mb-px flex space-x-8 px-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`py-5 px-4 border-b-3 font-semibold text-sm flex items-center transition-all duration-300 transform hover:scale-105 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-700 bg-blue-50/50 rounded-t-xl shadow-sm'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50/50 rounded-t-xl'
              }`}
            >
              <span className={`mr-3 transition-all duration-200 ${
                activeTab === tab.id ? 'scale-110' : ''
              }`}>{tab.icon}</span>
              <span className="font-medium">{tab.name}</span>
              <span className={`ml-3 px-3 py-1 text-xs font-bold rounded-full shadow-sm transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-blue-200'
                  : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}

export default InboxTabs