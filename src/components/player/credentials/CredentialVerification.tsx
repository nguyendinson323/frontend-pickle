import React, { useState } from 'react'
import { VerificationResult } from '../../../store/slices/digitalCredentialsSlice'
import {
  FiCheckCircle,
  FiXCircle,
  FiShield,
  FiSearch,
  FiUser
} from 'react-icons/fi'

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
    <div className="max-w-2xl mx-auto">
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-orange-600 to-red-700 p-8 text-white">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mr-4">
              <FiShield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-3xl font-bold mb-2">Verify Credential</h3>
              <p className="text-orange-100 text-lg">Authenticate digital credentials instantly</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <FiSearch className="w-5 h-5 text-orange-600 mr-3" />
              <label className="block text-lg font-bold text-orange-800">
                QR Code Data
              </label>
            </div>
            <textarea
              value={verifyQrCode}
              onChange={(e) => setVerifyQrCode(e.target.value)}
              placeholder="Paste QR code data here or scan using QR scanner app"
              className="w-full px-6 py-4 border-2 border-orange-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-medium bg-white text-lg"
              rows={4}
            />
          </div>

          <button
            onClick={handleVerify}
            disabled={!verifyQrCode.trim() || isLoading}
            className="w-full inline-flex justify-center items-center px-8 py-4 bg-gradient-to-r from-orange-600 to-red-700 text-white font-bold rounded-2xl hover:from-orange-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-xl hover:shadow-2xl hover:transform hover:scale-105"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent mr-3"></div>
                Verifying...
              </>
            ) : (
              <>
                <FiShield className="w-6 h-6 mr-3" />
                Verify Credential
              </>
            )}
          </button>
        </div>
      </div>

      {verificationResult && (
        <div className="mt-8 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
          <div className={`p-8 ${
            verificationResult.valid
              ? 'bg-gradient-to-r from-green-600 to-emerald-700'
              : 'bg-gradient-to-r from-red-600 to-pink-700'
          } text-white`}>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mr-4">
                {verificationResult.valid ? (
                  <FiCheckCircle className="w-6 h-6" />
                ) : (
                  <FiXCircle className="w-6 h-6" />
                )}
              </div>
              <div>
                <h4 className="text-3xl font-bold mb-2">
                  {verificationResult.valid ? 'Valid Credential' : 'Invalid Credential'}
                </h4>
                <p className={`text-lg font-medium ${
                  verificationResult.valid ? 'text-green-100' : 'text-red-100'
                }`}>
                  {verificationResult.message}
                </p>
              </div>
            </div>
          </div>

          {verificationResult.credential && (
            <div className="p-8">
              <div className="flex items-center mb-6">
                <FiUser className="w-6 h-6 text-gray-600 mr-3" />
                <h5 className="text-2xl font-bold text-gray-900">Credential Details</h5>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                  <div className="flex items-center mb-3">
                    <FiShield className="w-5 h-5 text-blue-600 mr-3" />
                    <p className="text-sm font-bold text-blue-700">Title</p>
                  </div>
                  <p className="text-lg font-bold text-blue-800">{verificationResult.credential.title}</p>
                </div>

                <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
                  <div className="flex items-center mb-3">
                    <FiShield className="w-5 h-5 text-green-600 mr-3" />
                    <p className="text-sm font-bold text-green-700">Type</p>
                  </div>
                  <p className="text-lg font-bold text-green-800 capitalize">{verificationResult.credential.credential_type.replace('_', ' ')}</p>
                </div>

                <div className="bg-purple-50 rounded-2xl p-6 border border-purple-200">
                  <div className="flex items-center mb-3">
                    <FiShield className="w-5 h-5 text-purple-600 mr-3" />
                    <p className="text-sm font-bold text-purple-700">Issued</p>
                  </div>
                  <p className="text-lg font-bold text-purple-800">{formatDate(verificationResult.credential.issue_date)}</p>
                </div>

                {verificationResult.credential.expiry_date && (
                  <div className="bg-orange-50 rounded-2xl p-6 border border-orange-200">
                    <div className="flex items-center mb-3">
                      <FiShield className="w-5 h-5 text-orange-600 mr-3" />
                      <p className="text-sm font-bold text-orange-700">Expires</p>
                    </div>
                    <p className="text-lg font-bold text-orange-800">{formatDate(verificationResult.credential.expiry_date)}</p>
                  </div>
                )}

                {verificationResult.credential.player && (
                  <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-200 md:col-span-2">
                    <div className="flex items-center mb-3">
                      <FiUser className="w-5 h-5 text-indigo-600 mr-3" />
                      <p className="text-sm font-bold text-indigo-700">Credential Holder</p>
                    </div>
                    <p className="text-xl font-bold text-indigo-800">{verificationResult.credential.player.full_name}</p>
                  </div>
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