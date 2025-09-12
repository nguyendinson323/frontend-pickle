import React from 'react'
import { useNavigate } from 'react-router-dom'
import { CoachCertificationSummary } from '../../../store/slices/coachDashboardSlice'

interface CoachCertificationsProps {
  certifications: CoachCertificationSummary[]
}

const CoachCertifications: React.FC<CoachCertificationsProps> = ({ certifications }) => {
  const navigate = useNavigate()

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Your Certifications</h3>
      
      {certifications.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🎓</span>
          </div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">No Certifications Yet</h4>
          <p className="text-gray-600 mb-4">Start building your coaching credentials</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certifications.map((cert) => {
            const isExpired = cert.expiry_date && new Date(cert.expiry_date) < new Date()
            const isExpiringSoon = cert.expiry_date && 
              new Date(cert.expiry_date) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) && 
              !isExpired
            
            return (
              <div key={cert.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center mb-3">
                  <div className={`w-12 h-12 ${isExpired ? 'bg-red-100' : isExpiringSoon ? 'bg-yellow-100' : 'bg-blue-100'} rounded-full flex items-center justify-center mr-4`}>
                    <span className="text-2xl">🎓</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{cert.name}</h4>
                    <p className="text-sm text-gray-600">Issued by {cert.issuer}</p>
                    <p className={`text-xs ${isExpired ? 'text-red-600' : isExpiringSoon ? 'text-yellow-600' : 'text-green-600'}`}>
                      {isExpired ? 'Expired' : isExpiringSoon ? 'Expiring Soon' : 'Active'}
                    </p>
                  </div>
                </div>
                <div className="space-y-1 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span>Issued:</span>
                    <span>{new Date(cert.issue_date).toLocaleDateString()}</span>
                  </div>
                  {cert.expiry_date && (
                    <div className="flex justify-between">
                      <span>Expires:</span>
                      <span>{new Date(cert.expiry_date).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
                {cert.certificate_url && (
                  <button
                    onClick={() => window.open(cert.certificate_url!, '_blank')}
                    className="mt-2 text-xs text-blue-600 hover:text-blue-800 underline"
                  >
                    View Certificate
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}

      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => navigate('/coach/certifications')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
        >
          Manage Certifications
        </button>
        <button
          onClick={() => navigate('/coach/referee')}
          className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
        >
          Find Referee Opportunities
        </button>
      </div>
    </div>
  )
}

export default CoachCertifications