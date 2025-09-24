import React from 'react'
import { DigitalCredential } from '../../../store/slices/digitalCredentialsSlice'
import {
  FiPlus,
  FiCalendar,
  FiEye,
  FiToggleLeft,
  FiToggleRight,
  FiTrash2,
  FiAward
} from 'react-icons/fi'

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
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl border border-gray-200 p-16 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
            <FiAward className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">No Credentials Yet</h3>
          <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
            Create your first digital credential to get started with verified identity management
          </p>
          <button
            onClick={() => onTabChange('create')}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-700 text-white font-bold rounded-2xl hover:from-purple-700 hover:to-pink-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 shadow-xl hover:shadow-2xl hover:transform hover:scale-105"
          >
            <FiPlus className="w-6 h-6 mr-3" />
            Create Credential
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {credentials.map(credential => (
          <div
            key={credential.id}
            className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg border-2 border-gray-200 p-8 hover:shadow-xl hover:border-blue-300 transition-all duration-300 hover:transform hover:scale-105"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl">{getCredentialIcon(credential.credential_type)}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{credential.title}</h3>
                  <p className="text-sm text-gray-600 capitalize font-medium">
                    {credential.credential_type.replace('_', ' ')}
                  </p>
                </div>
              </div>
              <span className={`px-4 py-2 text-sm font-bold rounded-2xl shadow-sm ${getStatusColor(credential)}`}>
                {getStatusText(credential)}
              </span>
            </div>

            {credential.description && (
              <div className="bg-gray-100 rounded-2xl p-4 mb-6">
                <p className="text-sm text-gray-700 font-medium">{credential.description}</p>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 mb-6">
              <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
                <div className="flex items-center">
                  <FiCalendar className="w-5 h-5 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-blue-700">Issued</p>
                    <p className="text-lg font-bold text-blue-800">{formatDate(credential.issue_date)}</p>
                  </div>
                </div>
              </div>
              {credential.expiry_date && (
                <div className="bg-orange-50 rounded-2xl p-4 border border-orange-200">
                  <div className="flex items-center">
                    <FiCalendar className="w-5 h-5 text-orange-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-orange-700">Expires</p>
                      <p className="text-lg font-bold text-orange-800">{formatDate(credential.expiry_date)}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <button
                onClick={() => onGenerateQrCode(credential.id)}
                className="w-full inline-flex justify-center items-center px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-700 text-white font-bold rounded-2xl hover:from-green-700 hover:to-emerald-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 shadow-lg hover:shadow-xl hover:transform hover:scale-105"
              >
                <FiEye className="w-5 h-5 mr-3" />
                Show QR Code
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => onToggleCredentialStatus(credential.id, credential.is_active)}
                  className={`inline-flex justify-center items-center px-4 py-3 font-bold rounded-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 shadow-md hover:shadow-lg hover:transform hover:scale-105 ${
                    credential.is_active
                      ? 'bg-gradient-to-r from-gray-400 to-gray-500 text-white hover:from-gray-500 hover:to-gray-600 focus:ring-gray-500'
                      : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 focus:ring-green-500'
                  }`}
                >
                  {credential.is_active ? (
                    <>
                      <FiToggleLeft className="w-5 h-5 mr-2" />
                      Deactivate
                    </>
                  ) : (
                    <>
                      <FiToggleRight className="w-5 h-5 mr-2" />
                      Activate
                    </>
                  )}
                </button>

                <button
                  onClick={() => onDeleteCredential(credential.id)}
                  className="inline-flex justify-center items-center px-4 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold rounded-2xl hover:from-red-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300 shadow-md hover:shadow-lg hover:transform hover:scale-105"
                >
                  <FiTrash2 className="w-5 h-5 mr-2" />
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