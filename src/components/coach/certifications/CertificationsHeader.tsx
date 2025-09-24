import React from 'react'
import {
  FiAward,
  FiCheckCircle,
  FiAlertTriangle,
  FiXCircle,
  FiInfo
} from 'react-icons/fi'

interface CertificationsHeaderProps {
  totalCertifications: number
  activeCertifications: number
  expiredCertifications: number
  expiringSoon: number
}

const CertificationsHeader: React.FC<CertificationsHeaderProps> = ({
  totalCertifications,
  activeCertifications,
  expiredCertifications,
  expiringSoon
}) => {
  return (
    <div className="bg-gradient-to-br from-white to-indigo-50 border border-indigo-200 rounded-3xl shadow-2xl p-8 mb-8">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3 flex items-center">
            <FiAward className="h-10 w-10 mr-4 text-indigo-600" />
            My Certifications
          </h1>
          <div className="text-lg text-gray-600 font-medium flex items-center">
            <FiInfo className="h-5 w-5 mr-2 text-indigo-500" />
            Manage your professional certifications and licenses
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:transform hover:scale-105">
          <div className="flex items-center justify-between mb-2">
            <FiAward className="h-8 w-8 text-blue-500" />
            <div className="text-3xl font-bold text-blue-600">{totalCertifications}</div>
          </div>
          <div className="text-sm font-bold text-gray-700">Total Certifications</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-100 border border-green-200 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:transform hover:scale-105">
          <div className="flex items-center justify-between mb-2">
            <FiCheckCircle className="h-8 w-8 text-green-500" />
            <div className="text-3xl font-bold text-green-600">{activeCertifications}</div>
          </div>
          <div className="text-sm font-bold text-gray-700">Active</div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-orange-100 border border-yellow-200 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:transform hover:scale-105">
          <div className="flex items-center justify-between mb-2">
            <FiAlertTriangle className="h-8 w-8 text-yellow-600" />
            <div className="text-3xl font-bold text-yellow-600">{expiringSoon}</div>
          </div>
          <div className="text-sm font-bold text-gray-700">Expiring Soon</div>
          <div className="text-xs font-medium text-gray-500 mt-1">(Next 30 days)</div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-pink-100 border border-red-200 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:transform hover:scale-105">
          <div className="flex items-center justify-between mb-2">
            <FiXCircle className="h-8 w-8 text-red-500" />
            <div className="text-3xl font-bold text-red-600">{expiredCertifications}</div>
          </div>
          <div className="text-sm font-bold text-gray-700">Expired</div>
        </div>
      </div>
    </div>
  )
}

export default CertificationsHeader