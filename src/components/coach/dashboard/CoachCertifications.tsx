import React from 'react'
import { useNavigate } from 'react-router-dom'
import { CoachCertificationSummary } from '../../../store/slices/coachDashboardSlice'
import {
  FiAward,
  FiCalendar,
  FiHome,
  FiExternalLink,
  FiSettings,
  FiEye,
  FiAlertTriangle,
  FiCheckCircle
} from 'react-icons/fi'

interface CoachCertificationsProps {
  certifications: CoachCertificationSummary[]
}

const CoachCertifications: React.FC<CoachCertificationsProps> = ({ certifications }) => {
  const navigate = useNavigate()

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-3xl shadow-2xl p-8">
      <div className="flex items-center mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl flex items-center justify-center mr-4">
          <FiAward className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900">Your Certifications</h3>
      </div>

      {certifications.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <FiAward className="w-10 h-10 text-gray-400" />
          </div>
          <h4 className="text-xl font-bold text-gray-900 mb-3">No Certifications Yet</h4>
          <p className="text-gray-600 font-medium mb-8">Start building your coaching credentials</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {certifications.map((cert) => {
            const isExpired = cert.expiry_date && new Date(cert.expiry_date) < new Date()
            const isExpiringSoon = cert.expiry_date &&
              new Date(cert.expiry_date) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) &&
              !isExpired

            return (
              <div key={cert.id} className={`p-6 border-2 rounded-2xl transition-all duration-300 hover:shadow-lg ${
                isExpired ? 'bg-gradient-to-br from-red-50 to-pink-50 border-red-200' :
                isExpiringSoon ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200' :
                'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200'
              }`}>
                <div className="flex items-start mb-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mr-4 shadow-lg ${
                    isExpired ? 'bg-gradient-to-br from-red-500 to-pink-600' :
                    isExpiringSoon ? 'bg-gradient-to-br from-yellow-500 to-amber-600' :
                    'bg-gradient-to-br from-emerald-600 to-teal-700'
                  }`}>
                    <FiAward className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-lg mb-1">{cert.name}</h4>
                    <div className="flex items-center text-sm font-medium text-gray-600 mb-2">
                      <FiHome className="w-4 h-4 mr-2" />
                      {cert.issuer}
                    </div>
                    <div className="flex items-center">
                      {isExpired ? (
                        <FiAlertTriangle className="w-4 h-4 mr-2 text-red-600" />
                      ) : isExpiringSoon ? (
                        <FiAlertTriangle className="w-4 h-4 mr-2 text-yellow-600" />
                      ) : (
                        <FiCheckCircle className="w-4 h-4 mr-2 text-emerald-600" />
                      )}
                      <span className={`text-sm font-bold ${
                        isExpired ? 'text-red-700' : isExpiringSoon ? 'text-yellow-700' : 'text-emerald-700'
                      }`}>
                        {isExpired ? 'Expired' : isExpiringSoon ? 'Expiring Soon' : 'Active'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="bg-white border border-gray-200 rounded-xl p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm font-medium text-gray-700">
                        <FiCalendar className="w-4 h-4 mr-2 text-blue-500" />
                        Issued
                      </div>
                      <span className="text-sm font-bold text-gray-900">
                        {new Date(cert.issue_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  {cert.expiry_date && (
                    <div className="bg-white border border-gray-200 rounded-xl p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm font-medium text-gray-700">
                          <FiCalendar className="w-4 h-4 mr-2 text-orange-500" />
                          Expires
                        </div>
                        <span className="text-sm font-bold text-gray-900">
                          {new Date(cert.expiry_date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {cert.certificate_url && (
                  <button
                    onClick={() => window.open(cert.certificate_url!, '_blank')}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold py-3 px-4 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl hover:transform hover:scale-105 flex items-center justify-center"
                  >
                    <FiExternalLink className="w-4 h-4 mr-2" />
                    View Certificate
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => navigate('/coach/certifications')}
          className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl hover:transform hover:scale-105 flex items-center justify-center"
        >
          <FiSettings className="w-5 h-5 mr-2" />
          Manage Certifications
        </button>
        <button
          onClick={() => navigate('/coach/referee')}
          className="flex-1 bg-gradient-to-r from-white to-gray-50 border-2 border-indigo-600 text-indigo-700 hover:bg-indigo-50 font-bold py-3 px-6 rounded-2xl transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center"
        >
          <FiEye className="w-5 h-5 mr-2" />
          Find Referee Opportunities
        </button>
      </div>
    </div>
  )
}

export default CoachCertifications