import React from 'react'

interface CoachCertification {
  id: number
  coach_id: number
  name: string
  issuer: string
  issue_date: string
  expiry_date: string | null
  certificate_url: string
  created_at: string
}

interface CertificationsListProps {
  certifications: CoachCertification[]
  filters: {
    status: string
    issuer: string
    search: string
  }
  onEdit: (certification: CoachCertification) => void
  onDelete: (certificationId: number) => void
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
    if (filters.issuer && !cert.issuer.toLowerCase().includes(filters.issuer.toLowerCase())) {
      return false
    }

    // Search filter
    if (filters.search && 
        !cert.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !cert.issuer.toLowerCase().includes(filters.search.toLowerCase())) {
      return false
    }

    return true
  })

  const getStatusBadge = (cert: CoachCertification) => {
    if (!cert.expiry_date) {
      return { text: 'No Expiry', className: 'bg-gray-100 text-gray-800' }
    }

    const currentDate = new Date()
    const expiryDate = new Date(cert.expiry_date)
    const thirtyDaysFromNow = new Date(currentDate.getTime() + (30 * 24 * 60 * 60 * 1000))

    if (expiryDate < currentDate) {
      return { text: 'Expired', className: 'bg-red-100 text-red-800' }
    } else if (expiryDate <= thirtyDaysFromNow) {
      return { text: 'Expiring Soon', className: 'bg-yellow-100 text-yellow-800' }
    } else {
      return { text: 'Active', className: 'bg-green-100 text-green-800' }
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
      <div className="bg-white shadow-sm rounded-lg p-8 text-center">
        <div className="text-gray-500">
          <div className="text-4xl mb-4">🎓</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Certifications Found</h3>
          <p className="text-gray-600">
            {filters.status !== 'all' || filters.issuer || filters.search
              ? 'Try adjusting your filters to see more certifications.'
              : 'Start by adding your professional certifications and licenses.'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          Certifications ({filteredCertifications.length})
        </h3>
      </div>

      <div className="divide-y divide-gray-200">
        {filteredCertifications.map((cert) => {
          const status = getStatusBadge(cert)
          return (
            <div key={cert.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-lg font-medium text-gray-900">{cert.name}</h4>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${status.className}`}>
                      {status.text}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>
                      <span className="font-medium">Issued by:</span> {cert.issuer}
                    </div>
                    <div className="flex space-x-4">
                      <span>
                        <span className="font-medium">Issue Date:</span> {formatDate(cert.issue_date)}
                      </span>
                      {cert.expiry_date && (
                        <span>
                          <span className="font-medium">Expires:</span> {formatDate(cert.expiry_date)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onDownload(cert.id)}
                    className="px-3 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-200"
                    title="Download Certificate"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </button>
                  
                  <button
                    onClick={() => onEdit(cert)}
                    className="px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200"
                    title="Edit Certification"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>

                  <button
                    onClick={() => onDelete(cert.id)}
                    className="px-3 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200"
                    title="Delete Certification"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
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