import React from 'react'

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
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => onTabChange('credential')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'credential'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            My Credential
          </button>
          <button
            onClick={() => onTabChange('my-credentials')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'my-credentials'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            All Credentials ({credentialsCount})
          </button>
          <button
            onClick={() => onTabChange('create')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'create'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Create New
          </button>
          <button
            onClick={() => onTabChange('verify')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'verify'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Verify Credential
          </button>
        </nav>
      </div>
    </div>
  )
}

export default CredentialsTabs