import React from 'react'
import { CoachCertification, CertificationFilters } from '../../../types/coach'
import {
  FiAward,
  FiDownload,
  FiEdit3,
  FiTrash2,
  FiCalendar,
  FiHome,
  FiClock,
  FiList
} from 'react-icons/fi'

interface CertificationsListProps {
  certifications: CoachCertification[]
  filters: CertificationFilters
  onEdit: (certification: CoachCertification) => void
  onDelete: (certification: CoachCertification) => void
  onDownload: (certificationId: number) => void
}

const CertificationsList: React.FC<CertificationsListProps> = ({
  certifications,
  filters,
  onEdit,
  onDelete,
  onDownload
}) => {
  // Filter certifications based on current filters
  const filteredCertifications = certifications.filter(cert => {
    // Status filter
    if (filters.status !== 'all') {
      const currentDate = new Date()
      const expiryDate = cert.expiry_date ? new Date(cert.expiry_date) : null
      
      if (filters.status === 'active') {
        if (expiryDate && expiryDate < currentDate) return false
      } else if (filters.status === 'expired') {
        if (!expiryDate || expiryDate >= currentDate) return false
      } else if (filters.status === 'expiring') {
        const thirtyDaysFromNow = new Date(currentDate.getTime() + (30 * 24 * 60 * 60 * 1000))
        if (!expiryDate || expiryDate < currentDate || expiryDate > thirtyDaysFromNow) return false
      }
    }

    // Issuer filter
    if (filters.issuer && cert.issuer && !cert.issuer.toLowerCase().includes(filters.issuer.toLowerCase())) {
      return false
    }

    // Search filter
    if (filters.search && 
        !cert.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !(cert.issuer && cert.issuer.toLowerCase().includes(filters.search.toLowerCase()))) {
      return false
    }

    return true
  })

  const getStatusBadge = (cert: CoachCertification) => {
    if (!cert.expiry_date) {
      return { text: 'No Expiry', className: 'bg-gray-100 text-gray-800 border-gray-200', icon: FiClock }
    }

    const currentDate = new Date()
    const expiryDate = new Date(cert.expiry_date)
    const thirtyDaysFromNow = new Date(currentDate.getTime() + (30 * 24 * 60 * 60 * 1000))

    if (expiryDate < currentDate) {
      return { text: 'Expired', className: 'bg-red-100 text-red-800 border-red-200', icon: FiClock }
    } else if (expiryDate <= thirtyDaysFromNow) {
      return { text: 'Expiring Soon', className: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: FiClock }
    } else {
      return { text: 'Active', className: 'bg-green-100 text-green-800 border-green-200', icon: FiClock }
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (filteredCertifications.length === 0) {
    return (
      <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-3xl shadow-xl p-12 text-center">
        <div className="text-gray-500">
          <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <FiAward className="h-12 w-12 text-gray-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">No Certifications Found</h3>
          <p className="text-gray-600 font-medium text-lg max-w-md mx-auto">
            {filters.status !== 'all' || filters.issuer || filters.search
              ? 'Try adjusting your filters to see more certifications.'
              : 'Start by adding your professional certifications and licenses.'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-3xl shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white px-8 py-6">
        <h3 className="text-2xl font-bold flex items-center">
          <FiList className="h-6 w-6 mr-3" />
          Certifications ({filteredCertifications.length})
        </h3>
        <p className="text-indigo-100 font-medium mt-1">Your professional credentials and licenses</p>
      </div>

      <div className="grid gap-6 p-8">
        {filteredCertifications.map((cert) => {
          const status = getStatusBadge(cert)
          const StatusIcon = status.icon
          return (
            <div key={cert.id} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-200 hover:transform hover:scale-[1.02]">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center">
                      <FiAward className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-gray-900 mb-1">{cert.name}</h4>
                      <span className={`inline-flex items-center px-3 py-1 text-sm font-bold rounded-2xl border-2 ${status.className}`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {status.text}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                      <div className="text-sm font-bold text-gray-700 mb-1 flex items-center">
                        <FiHome className="h-4 w-4 mr-2 text-blue-500" />
                        Issued by
                      </div>
                      <div className="font-bold text-blue-900">{cert.issuer}</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                      <div className="text-sm font-bold text-gray-700 mb-1 flex items-center">
                        <FiCalendar className="h-4 w-4 mr-2 text-green-500" />
                        Issue Date
                      </div>
                      <div className="font-bold text-green-900">{formatDate(cert.issue_date)}</div>
                    </div>
                    {cert.expiry_date && (
                      <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-xl p-4">
                        <div className="text-sm font-bold text-gray-700 mb-1 flex items-center">
                          <FiClock className="h-4 w-4 mr-2 text-orange-500" />
                          Expires
                        </div>
                        <div className="font-bold text-orange-900">{formatDate(cert.expiry_date)}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col space-y-3 ml-6">
                  <button
                    onClick={() => onDownload(cert.id)}
                    className="p-3 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 hover:transform hover:scale-105"
                    title="Download Certificate"
                  >
                    <FiDownload className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => onEdit(cert)}
                    className="p-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 hover:transform hover:scale-105"
                    title="Edit Certification"
                  >
                    <FiEdit3 className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => onDelete(cert)}
                    className="p-3 bg-gradient-to-r from-red-600 to-pink-700 hover:from-red-700 hover:to-pink-800 text-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 hover:transform hover:scale-105"
                    title="Delete Certification"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CertificationsList