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
  openCreateCredentialModal,
  VerificationResult
} from '../../store/slices/digitalCredentialsSlice'
import { AppDispatch } from '../../store'
import {
  CredentialsHeader,
  CredentialsTabs,
  CredentialsList,
  CreateCredentialTemplates,
  CredentialVerification,
  QrCodeModal,
  CreateCredentialModal,
  PlayerCredentialCard
} from '../../components/player/credentials'

const DigitalCredentials: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [activeTab, setActiveTab] = useState<'credential' | 'my-credentials' | 'create' | 'verify'>('credential')
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null)

  const {
    credentials,
    templates,
    playerProfile,
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

  const handleVerifyCredential = async (qrCodeData: string) => {
    try {
      const resultAction = await dispatch(verifyCredential(qrCodeData))
      if (verifyCredential.fulfilled.match(resultAction)) {
        setVerificationResult(resultAction.payload)
      } else {
        setVerificationResult({
          valid: false,
          credential: undefined,
          message: 'Failed to verify credential'
        })
      }
    } catch (error) {
      setVerificationResult({
        valid: false,
        credential: undefined,
        message: 'Failed to verify credential'
      })
    }
  }

  const handleToggleCredentialStatus = (credentialId: number, currentStatus: boolean) => {
    dispatch(updateCredentialStatus({ credentialId, isActive: !currentStatus }))
  }

  const handleDeleteCredential = (credentialId: number) => {
    if (confirm('Are you sure you want to delete this credential?')) {
      dispatch(deleteCredential(credentialId))
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getStatusColor = (credential: { is_active: boolean; expiry_date: string | null }) => {
    if (!credential.is_active) return 'bg-gray-100 text-gray-800'
    if (credential.expiry_date && new Date(credential.expiry_date) < new Date()) {
      return 'bg-red-100 text-red-800'
    }
    return 'bg-green-100 text-green-800'
  }

  const getStatusText = (credential: { is_active: boolean; expiry_date: string | null }) => {
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
    <div className="min-h-screen ">
      <CredentialsHeader />

      <CredentialsTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        credentialsCount={credentials.length}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && credentials.length === 0 && !playerProfile && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-green-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-2 text-gray-600">Loading your credentials...</p>
            </div>
          </div>
        )}

        {!isLoading && !error && (
          <>
            {activeTab === 'credential' && (
              <PlayerCredentialCard
                credential={credentials.find(c => c.credential_type === 'player_card')}
                playerProfile={playerProfile}
              />
            )}

            {activeTab === 'my-credentials' && (
              <CredentialsList
                credentials={credentials}
                onTabChange={setActiveTab}
                onGenerateQrCode={handleGenerateQrCode}
                onToggleCredentialStatus={handleToggleCredentialStatus}
                onDeleteCredential={handleDeleteCredential}
                formatDate={formatDate}
                getStatusColor={getStatusColor}
                getStatusText={getStatusText}
                getCredentialIcon={getCredentialIcon}
              />
            )}

            {activeTab === 'create' && (
              <CreateCredentialTemplates
                templates={templates}
                onCreateCredential={handleCreateCredential}
                getCredentialIcon={getCredentialIcon}
              />
            )}

            {activeTab === 'verify' && (
              <CredentialVerification
                onVerifyCredential={handleVerifyCredential}
                verificationResult={verificationResult}
                isLoading={isLoading}
                formatDate={formatDate}
              />
            )}
          </>
        )}
      </div>

      <QrCodeModal
        isOpen={qrCodeModal.isOpen}
        qrCodeUrl={qrCodeModal.qrCodeUrl}
      />

      <CreateCredentialModal
        isOpen={createCredentialModal.isOpen}
        selectedTemplate={createCredentialModal.selectedTemplate}
        formData={createCredentialModal.formData}
        onSubmitCreateCredential={handleSubmitCreateCredential}
        isLoading={isLoading}
      />
    </div>
  )
}

export default DigitalCredentials