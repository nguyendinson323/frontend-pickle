import React from 'react'
import { useNavigate } from 'react-router-dom'
import { CoachCertification } from '../../../types/coach'

interface CoachCertificationsTabProps {
  certifications: CoachCertification[]
}

const CoachCertificationsTab: React.FC<CoachCertificationsTabProps> = ({ certifications }) => {
  const navigate = useNavigate()

  const getExpirationStatus = (expiryDate: string | null) => {
    if (!expiryDate) return { status: 'active', label: 'No Expiration', color: 'bg-gray-100 text-gray-800' }
    
    const expiry = new Date(expiryDate)
    const now = new Date()
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
    
    if (expiry < now) {
      return { status: 'expired', label: 'Expired', color: 'bg-red-100 text-red-800' }
    } else if (expiry < thirtyDaysFromNow) {
      return { status: 'expiring', label: 'Expiring Soon', color: 'bg-yellow-100 text-yellow-800' }
    } else {
      return { status: 'active', label: 'Active', color: 'bg-green-100 text-green-800' }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Certifications & Licenses</h3>
          <p className="text-gray-600 mt-1">
            Manage your coaching certifications and download certificates
          </p>
        </div>
        <button
          onClick={() => navigate('/coach/certifications')}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          Manage Certifications
        </button>
      </div>

      {/* Certifications Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-blue-800">Total Certifications</p>
              <p className="text-2xl font-bold text-blue-600">{certifications.length}</p>
            </div>
            <span className="text-3xl">📜</span>
          </div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-green-800">Active Certifications</p>
              <p className="text-2xl font-bold text-green-600">
                {certifications.filter(cert => 
                  getExpirationStatus(cert.expiry_date).status === 'active'
                ).length}
              </p>
            </div>
            <span className="text-3xl">✅</span>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-yellow-800">Expiring Soon</p>
              <p className="text-2xl font-bold text-yellow-600">
                {certifications.filter(cert => 
                  getExpirationStatus(cert.expiry_date).status === 'expiring'
                ).length}
              </p>
            </div>
            <span className="text-3xl">⚠️</span>
          </div>
        </div>
      </div>

      {/* Certifications List */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-6 border-b border-gray-200">
          <h4 className="font-semibold text-gray-900">Your Certifications</h4>
        </div>
        
        {certifications.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {certifications.map((cert) => {
              const expirationStatus = getExpirationStatus(cert.expiry_date)
              return (
                <div key={cert.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <span className="text-green-600">📜</span>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900">{cert.name}</h5>
                        <p className="text-sm text-gray-600">{cert.issuer}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <p className="text-xs text-gray-500">
                            Issued: {new Date(cert.issue_date).toLocaleDateString()}
                          </p>
                          {cert.expiry_date && (
                            <p className="text-xs text-gray-500">
                              Expires: {new Date(cert.expiry_date).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${expirationStatus.color}`}>
                        {expirationStatus.label}
                      </span>
                      {cert.certificate_url && (
                        <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                          Download PDF
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📜</span>
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">No Certifications Yet</h4>
            <p className="text-gray-600 mb-6 max-w-sm mx-auto">
              Add your coaching certifications and licenses to build credibility with students and the federation.
            </p>
            <button
              onClick={() => navigate('/coach/certifications')}
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
            >
              Add Certification
            </button>
          </div>
        )}
      </div>

      {/* Available Certifications */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Available Federation Certifications</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h5 className="font-medium text-gray-900">Level 1 Coaching Certificate</h5>
              <p className="text-sm text-gray-600">Basic coaching fundamentals and court safety</p>
              <p className="text-xs text-green-600 font-medium">Duration: 2 days • Cost: $150</p>
            </div>
            <button className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700">
              Learn More
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h5 className="font-medium text-gray-900">Advanced Coaching Techniques</h5>
              <p className="text-sm text-gray-600">Advanced strategies and player development</p>
              <p className="text-xs text-green-600 font-medium">Duration: 3 days • Cost: $250</p>
            </div>
            <button className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700">
              Learn More
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h5 className="font-medium text-gray-900">Tournament Referee License</h5>
              <p className="text-sm text-gray-600">Official referee certification for tournaments</p>
              <p className="text-xs text-green-600 font-medium">Duration: 1 day • Cost: $100</p>
            </div>
            <button className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CoachCertificationsTab