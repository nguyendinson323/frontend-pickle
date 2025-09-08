import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../store'
import { 
  fetchPlayerCredentials,
  fetchPlayerProfile,
  fetchCredentialTemplates,
  createDigitalCredential,
  generateCredentialQrCode,
  verifyCredential,
  updateCredentialStatus,
  deleteCredential,
  openQrCodeModal,
  closeQrCodeModal,
  openCreateCredentialModal,
  closeCreateCredentialModal,
  updateCreateCredentialFormData
} from '../../store/slices/digitalCredentialsSlice'
import { AppDispatch } from '../../store'

const DigitalCredentials: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [activeTab, setActiveTab] = useState<'my-credentials' | 'create' | 'verify'>('my-credentials')
  const [verifyQrCode, setVerifyQrCode] = useState('')
  const [verificationResult, setVerificationResult] = useState<any>(null)

  const {
    credentials,
    selectedCredential,
    playerProfile,
    templates,
    isLoading,
    error,
    qrCodeModal,
    createCredentialModal
  } = useSelector((state: RootState) => state.digitalCredentials)

  useEffect(() => {
    dispatch(fetchPlayerCredentials())
    dispatch(fetchPlayerProfile())
    dispatch(fetchCredentialTemplates())
  }, [dispatch])

  const handleCreateCredential = (templateType: string) => {
    const template = templates.find(t => t.type === templateType)
    if (template) {
      dispatch(openCreateCredentialModal(template))
    }
  }

  const handleSubmitCreateCredential = () => {
    if (createCredentialModal.selectedTemplate) {
      const credentialData = {
        credential_type: createCredentialModal.selectedTemplate.type,
        title: createCredentialModal.formData.title || createCredentialModal.selectedTemplate.name,
        description: createCredentialModal.formData.description,
        expiry_date: createCredentialModal.formData.expiry_date,
        metadata: createCredentialModal.formData
      }
      
      dispatch(createDigitalCredential(credentialData))
    }
  }

  const handleGenerateQrCode = (credentialId: number) => {
    dispatch(generateCredentialQrCode(credentialId))
  }

  const handleVerifyCredential = async () => {
    if (verifyQrCode.trim()) {
      try {
        const result = await dispatch(verifyCredential(verifyQrCode.trim()))
        setVerificationResult(result)
      } catch (error) {
        setVerificationResult({
          valid: false,
          credential: null,
          message: 'Failed to verify credential'
        })
      }
    }
  }

  const handleToggleCredentialStatus = (credentialId: number, currentStatus: boolean) => {
    dispatch(updateCredentialStatus(credentialId, !currentStatus))
  }

  const handleDeleteCredential = (credentialId: number) => {
    if (confirm('Are you sure you want to delete this credential?')) {
      dispatch(deleteCredential(credentialId))
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getStatusColor = (credential: any) => {
    if (!credential.is_active) return 'bg-gray-100 text-gray-800'
    if (credential.expiry_date && new Date(credential.expiry_date) < new Date()) {
      return 'bg-red-100 text-red-800'
    }
    return 'bg-green-100 text-green-800'
  }

  const getStatusText = (credential: any) => {
    if (!credential.is_active) return 'Inactive'
    if (credential.expiry_date && new Date(credential.expiry_date) < new Date()) {
      return 'Expired'
    }
    return 'Active'
  }

  const getCredentialIcon = (type: string) => {
    switch (type) {
      case 'player_card': return '🪪'
      case 'tournament_badge': return '🏆'
      case 'certification': return '📜'
      case 'membership_card': return '💳'
      default: return '📋'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Digital Credentials</h1>
              <p className="text-gray-600">Manage your digital ID cards and certificates</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('my-credentials')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'my-credentials'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Credentials ({credentials.length})
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'create'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Create New
            </button>
            <button
              onClick={() => setActiveTab('verify')}
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'my-credentials' && (
          <div>
            {credentials.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <div className="text-4xl mb-4">🪪</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Credentials Yet</h3>
                <p className="text-gray-500 mb-4">Create your first digital credential to get started</p>
                <button
                  onClick={() => setActiveTab('create')}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Create Credential
                </button>
              </div>
            ) : (
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
                        onClick={() => handleGenerateQrCode(credential.id)}
                        className="w-full inline-flex justify-center items-center px-3 py-2 border border-green-600 text-green-600 text-sm font-medium rounded-md hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        📱 Show QR Code
                      </button>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleToggleCredentialStatus(credential.id, credential.is_active)}
                          className={`flex-1 inline-flex justify-center items-center px-3 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                            credential.is_active
                              ? 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500'
                              : 'border border-green-600 text-green-600 hover:bg-green-50 focus:ring-green-500'
                          }`}
                        >
                          {credential.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                        
                        <button
                          onClick={() => handleDeleteCredential(credential.id)}
                          className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-red-300 text-red-700 text-sm font-medium rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'create' && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-6">Create New Credential</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {templates.map(template => (
                <div
                  key={template.type}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:border-green-500 transition-colors"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="text-2xl">{getCredentialIcon(template.type)}</span>
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">{template.name}</h4>
                      <p className="text-sm text-gray-600">{template.description}</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">Required fields:</p>
                    <div className="flex flex-wrap gap-2">
                      {template.required_fields.map(field => (
                        <span
                          key={field}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                        >
                          {field.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleCreateCredential(template.type)}
                    className="w-full inline-flex justify-center items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Create {template.name}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'verify' && (
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Verify Credential</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  QR Code Data
                </label>
                <textarea
                  value={verifyQrCode}
                  onChange={(e) => setVerifyQrCode(e.target.value)}
                  placeholder="Paste QR code data here or scan using QR scanner app"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                  rows={3}
                />
              </div>
              
              <button
                onClick={handleVerifyCredential}
                disabled={!verifyQrCode.trim() || isLoading}
                className="w-full inline-flex justify-center items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Verifying...' : 'Verify Credential'}
              </button>
            </div>

            {verificationResult && (
              <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className={`flex items-center space-x-3 mb-4 ${
                  verificationResult.valid ? 'text-green-600' : 'text-red-600'
                }`}>
                  <span className="text-2xl">
                    {verificationResult.valid ? '✅' : '❌'}
                  </span>
                  <div>
                    <h4 className="text-lg font-medium">
                      {verificationResult.valid ? 'Valid Credential' : 'Invalid Credential'}
                    </h4>
                    <p className="text-sm">{verificationResult.message}</p>
                  </div>
                </div>

                {verificationResult.credential && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-md">
                    <h5 className="font-medium text-gray-900 mb-2">Credential Details:</h5>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><span className="font-medium">Title:</span> {verificationResult.credential.title}</p>
                      <p><span className="font-medium">Type:</span> {verificationResult.credential.credential_type}</p>
                      <p><span className="font-medium">Issued:</span> {formatDate(verificationResult.credential.issue_date)}</p>
                      {verificationResult.credential.expiry_date && (
                        <p><span className="font-medium">Expires:</span> {formatDate(verificationResult.credential.expiry_date)}</p>
                      )}
                      {verificationResult.credential.player && (
                        <p><span className="font-medium">Holder:</span> {verificationResult.credential.player.full_name}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* QR Code Modal */}
      {qrCodeModal.isOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                QR Code
              </h3>
              
              {qrCodeModal.qrCodeUrl && (
                <div className="mb-4">
                  <img 
                    src={qrCodeModal.qrCodeUrl} 
                    alt="QR Code"
                    className="mx-auto w-64 h-64 border border-gray-200 rounded-md"
                  />
                </div>
              )}
              
              <p className="text-sm text-gray-600 mb-6">
                Show this QR code to verify your credential
              </p>
              
              <div className="flex justify-center">
                <button
                  onClick={() => dispatch(closeQrCodeModal())}
                  className="px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-400 focus:outline-none"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Credential Modal */}
      {createCredentialModal.isOpen && createCredentialModal.selectedTemplate && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Create {createCredentialModal.selectedTemplate.name}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={createCredentialModal.formData.title || createCredentialModal.selectedTemplate.name}
                    onChange={(e) => dispatch(updateCreateCredentialFormData({ title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description (Optional)
                  </label>
                  <textarea
                    value={createCredentialModal.formData.description || ''}
                    onChange={(e) => dispatch(updateCreateCredentialFormData({ description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={createCredentialModal.formData.expiry_date || ''}
                    onChange={(e) => dispatch(updateCreateCredentialFormData({ expiry_date: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => dispatch(closeCreateCredentialModal())}
                  className="px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-400 focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitCreateCredential}
                  disabled={isLoading}
                  className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none disabled:opacity-50"
                >
                  {isLoading ? 'Creating...' : 'Create Credential'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DigitalCredentials