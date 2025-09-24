import React from 'react'
import {
  FiAward,
  FiShield,
  FiStar,
  FiUser
} from 'react-icons/fi'

interface CredentialsHeaderProps {
  title?: string
  description?: string
}

const CredentialsHeader: React.FC<CredentialsHeaderProps> = ({
  title = "Digital Credentials",
  description = "Manage your digital ID cards and certificates"
}) => {
  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl border border-gray-200 mx-4 mt-8 mb-8 overflow-hidden">
      {/* Header Gradient Background */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-8 m-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between text-white">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-3xl flex items-center justify-center mr-6">
              <FiAward className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-3">{title}</h1>
              <p className="text-blue-100 text-lg font-medium">
                {description}
              </p>
            </div>
          </div>
          <div className="mt-6 lg:mt-0">
            <div className="flex items-center bg-white bg-opacity-20 rounded-2xl px-6 py-3">
              <FiShield className="w-6 h-6 mr-3" />
              <span className="font-semibold text-lg">Verified Identity</span>
            </div>
          </div>
        </div>
      </div>

      {/* Feature highlights */}
      <div className="px-8 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center">
                <FiUser className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-bold text-blue-900">Digital ID</h3>
                <p className="text-sm text-blue-700">Official player identification</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl flex items-center justify-center">
                <FiShield className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-bold text-green-900">Secure Verification</h3>
                <p className="text-sm text-green-700">QR code authentication</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-700 rounded-2xl flex items-center justify-center">
                <FiStar className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-bold text-purple-900">Achievements</h3>
                <p className="text-sm text-purple-700">Certified credentials</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CredentialsHeader