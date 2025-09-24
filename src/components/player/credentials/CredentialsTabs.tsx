import React from 'react'
import {
  FiUser,
  FiList,
  FiPlus,
  FiCheckCircle
} from 'react-icons/fi'

interface CredentialsTabsProps {
  activeTab: 'credential' | 'my-credentials' | 'create' | 'verify'
  onTabChange: (tab: 'credential' | 'my-credentials' | 'create' | 'verify') => void
  credentialsCount: number
}

const CredentialsTabs: React.FC<CredentialsTabsProps> = ({
  activeTab,
  onTabChange,
  credentialsCount
}) => {
  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg border border-gray-200 mx-4 mb-8">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <nav className="flex flex-wrap space-x-2 py-6" aria-label="Tabs">
          <button
            onClick={() => onTabChange('credential')}
            className={`inline-flex items-center px-6 py-4 rounded-2xl text-sm font-bold transition-all duration-300 hover:transform hover:scale-105 ${
              activeTab === 'credential'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-xl'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 shadow-sm'
            }`}
          >
            <FiUser className="w-5 h-5 mr-3" />
            My Credential
          </button>
          <button
            onClick={() => onTabChange('my-credentials')}
            className={`inline-flex items-center px-6 py-4 rounded-2xl text-sm font-bold transition-all duration-300 hover:transform hover:scale-105 ${
              activeTab === 'my-credentials'
                ? 'bg-gradient-to-r from-green-600 to-emerald-700 text-white shadow-xl'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 shadow-sm'
            }`}
          >
            <FiList className="w-5 h-5 mr-3" />
            All Credentials
            <span className="ml-2 px-3 py-1 bg-white bg-opacity-20 rounded-full text-xs font-bold">
              {credentialsCount}
            </span>
          </button>
          <button
            onClick={() => onTabChange('create')}
            className={`inline-flex items-center px-6 py-4 rounded-2xl text-sm font-bold transition-all duration-300 hover:transform hover:scale-105 ${
              activeTab === 'create'
                ? 'bg-gradient-to-r from-purple-600 to-pink-700 text-white shadow-xl'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 shadow-sm'
            }`}
          >
            <FiPlus className="w-5 h-5 mr-3" />
            Create New
          </button>
          <button
            onClick={() => onTabChange('verify')}
            className={`inline-flex items-center px-6 py-4 rounded-2xl text-sm font-bold transition-all duration-300 hover:transform hover:scale-105 ${
              activeTab === 'verify'
                ? 'bg-gradient-to-r from-orange-600 to-red-700 text-white shadow-xl'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 shadow-sm'
            }`}
          >
            <FiCheckCircle className="w-5 h-5 mr-3" />
            Verify Credential
          </button>
        </nav>
      </div>
    </div>
  )
}

export default CredentialsTabs