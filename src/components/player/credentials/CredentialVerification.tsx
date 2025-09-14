import React, { useState } from 'react'
import { VerificationResult } from '../../../store/slices/digitalCredentialsSlice'

interface CredentialVerificationProps {
  onVerifyCredential: (qrCodeData: string) => void
  verificationResult: VerificationResult | null
  isLoading: boolean
  formatDate: (dateString: string) => string
}

const CredentialVerification: React.FC<CredentialVerificationProps> = ({
  onVerifyCredential,
  verificationResult,
  isLoading,
  formatDate
}) => {
  const [verifyQrCode, setVerifyQrCode] = useState('')

  const handleVerify = () => {
    if (verifyQrCode.trim()) {
      onVerifyCredential(verifyQrCode.trim())
    }
  }

  return (
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
          onClick={handleVerify}
          disabled={!verifyQrCode.trim() || isLoading}
          className="w-full inline-flex justify-center items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Verifying...
            </>
          ) : (
            'Verify Credential'
          )}
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
  )
}

export default CredentialVerification