import React from 'react'
import { DigitalCredential } from '../../../store/slices/digitalCredentialsSlice'

interface CredentialsListProps {
  credentials: DigitalCredential[]
  onTabChange: (tab: 'my-credentials' | 'create' | 'verify') => void
  onGenerateQrCode: (credentialId: number) => void
  onToggleCredentialStatus: (credentialId: number, currentStatus: boolean) => void
  onDeleteCredential: (credentialId: number) => void
  formatDate: (dateString: string) => string
  getStatusColor: (credential: DigitalCredential) => string
  getStatusText: (credential: DigitalCredential) => string
  getCredentialIcon: (type: string) => string
}

const CredentialsList: React.FC<CredentialsListProps> = ({
  credentials,
  onTabChange,
  onGenerateQrCode,
  onToggleCredentialStatus,
  onDeleteCredential,
  formatDate,
  getStatusColor,
  getStatusText,
  getCredentialIcon
}) => {
  if (credentials.length === 0) {
    return (
      <div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="text-4xl mb-4">🪪</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Credentials Yet</h3>
          <p className="text-gray-500 mb-4">Create your first digital credential to get started</p>
          <button
            onClick={() => onTabChange('create')}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Create Credential
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {credentials.map(credential => (
          <div
            key={credential.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getCredentialIcon(credential.credential_type)}</span>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{credential.title}</h3>
                  <p className="text-sm text-gray-600 capitalize">
                    {credential.credential_type.replace('_', ' ')}
                  </p>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(credential)}`}>
                {getStatusText(credential)}
              </span>
            </div>

            {credential.description && (
              <p className="text-sm text-gray-600 mb-4">{credential.description}</p>
            )}

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Issued:</span>
                <span className="text-gray-900">{formatDate(credential.issue_date)}</span>
              </div>
              {credential.expiry_date && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Expires:</span>
                  <span className="text-gray-900">{formatDate(credential.expiry_date)}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col space-y-2">
              <button
                onClick={() => onGenerateQrCode(credential.id)}
                className="w-full inline-flex justify-center items-center px-3 py-2 border border-green-600 text-green-600 text-sm font-medium rounded-md hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                📱 Show QR Code
              </button>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => onToggleCredentialStatus(credential.id, credential.is_active)}
                  className={`flex-1 inline-flex justify-center items-center px-3 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    credential.is_active
                      ? 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500'
                      : 'border border-green-600 text-green-600 hover:bg-green-50 focus:ring-green-500'
                  }`}
                >
                  {credential.is_active ? 'Deactivate' : 'Activate'}
                </button>
                
                <button
                  onClick={() => onDeleteCredential(credential.id)}
                  className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-red-300 text-red-700 text-sm font-medium rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CredentialsList