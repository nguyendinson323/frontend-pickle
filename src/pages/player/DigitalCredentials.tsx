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
      const result = await dispatch(verifyCredential(qrCodeData))
      setVerificationResult(result)
    } catch (error) {
      setVerificationResult({
        valid: false,
        credential: undefined,
        message: 'Failed to verify credential'
      })
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