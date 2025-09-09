import React from 'react'

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
    <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900">My Certifications</h1>
        <div className="text-sm text-gray-500">
          Manage your professional certifications and licenses
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{totalCertifications}</div>
          <div className="text-sm text-gray-600">Total Certifications</div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{activeCertifications}</div>
          <div className="text-sm text-gray-600">Active</div>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">{expiringSoon}</div>
          <div className="text-sm text-gray-600">Expiring Soon</div>
          <div className="text-xs text-gray-500">(Next 30 days)</div>
        </div>
        
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-red-600">{expiredCertifications}</div>
          <div className="text-sm text-gray-600">Expired</div>
        </div>
      </div>
    </div>
  )
}

export default CertificationsHeader