import React from 'react'
import { PartnerCourt } from '../../../store/slices/partnerMicrositeSlice'
import { useNavigate } from 'react-router-dom'
import {
  FiHome,
  FiMapPin,
  FiSun,
  FiCalendar,
  FiInfo,
  FiCheckCircle,
  FiXCircle,
  FiAlertTriangle
} from 'react-icons/fi'

interface CourtsSectionProps {
  courts: PartnerCourt[]
  isOwner: boolean
}

const CourtsSection: React.FC<CourtsSectionProps> = ({ courts, isOwner }) => {
  const navigate = useNavigate()

  if (courts.length === 0) {
    return (
      <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-2xl rounded-3xl p-12 mb-6">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center mr-4">
            <FiHome className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Courts</h2>
        </div>
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <FiHome className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">No Courts Available</h3>
          <p className="text-gray-600 font-medium">This partner hasn't added any courts yet.</p>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-gradient-to-r from-green-100 to-emerald-200 text-green-800 border-green-300',
      maintenance: 'bg-gradient-to-r from-yellow-100 to-orange-200 text-yellow-800 border-yellow-300',
      inactive: 'bg-gradient-to-r from-red-100 to-pink-200 text-red-800 border-red-300'
    }
    return colors[status as keyof typeof colors] || 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300'
  }

  const getStatusIcon = (status: string) => {
    const icons = {
      active: <FiCheckCircle className="w-4 h-4" />,
      maintenance: <FiAlertTriangle className="w-4 h-4" />,
      inactive: <FiXCircle className="w-4 h-4" />
    }
    return icons[status as keyof typeof icons] || <FiInfo className="w-4 h-4" />
  }

  const handleReserveCourt = (courtId: number) => {
    navigate(`/court-reservations?courtId=${courtId}`)
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-2xl rounded-3xl p-8 mb-6">
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center mr-4">
          <FiHome className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Available Courts</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courts.map((court) => (
          <div key={court.id} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 hover:transform hover:scale-105">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-900">{court.name}</h3>
              <span className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-full border ${getStatusColor(court.status)}`}>
                {getStatusIcon(court.status)}
                <span className="ml-1 capitalize">{court.status}</span>
              </span>
            </div>

            {court.address && (
              <div className="flex items-start mb-4 bg-gray-50 rounded-2xl p-3">
                <FiMapPin className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-900">{court.address}</span>
              </div>
            )}

            <div className="space-y-3 mb-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-xl p-3">
                  <div className="flex items-center mb-1">
                    <FiHome className="w-4 h-4 text-blue-600 mr-1" />
                    <span className="font-bold text-gray-600 text-sm">Courts</span>
                  </div>
                  <span className="text-blue-900 font-bold text-lg">{court.court_count}</span>
                </div>

                {court.surface_type && (
                  <div className="bg-green-50 rounded-xl p-3">
                    <div className="flex items-center mb-1">
                      <FiInfo className="w-4 h-4 text-green-600 mr-1" />
                      <span className="font-bold text-gray-600 text-sm">Surface</span>
                    </div>
                    <span className="text-green-900 font-bold capitalize">{court.surface_type}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {court.indoor && (
                  <span className="inline-flex items-center px-3 py-1 text-xs font-bold text-green-700 bg-gradient-to-r from-green-100 to-emerald-200 border border-green-300 rounded-full">
                    <FiHome className="w-3 h-3 mr-1" />
                    Indoor
                  </span>
                )}
                {court.lights && (
                  <span className="inline-flex items-center px-3 py-1 text-xs font-bold text-yellow-700 bg-gradient-to-r from-yellow-100 to-orange-200 border border-yellow-300 rounded-full">
                    <FiSun className="w-3 h-3 mr-1" />
                    Lights
                  </span>
                )}
              </div>
            </div>

            {court.description && (
              <div className="bg-blue-50 rounded-xl p-3 mb-4">
                <p className="text-sm text-blue-800 font-medium line-clamp-2">
                  {court.description}
                </p>
              </div>
            )}

            {court.status === 'active' && !isOwner && (
              <button
                onClick={() => handleReserveCourt(court.id)}
                className="w-full inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-700 text-white text-sm font-bold rounded-2xl hover:from-purple-700 hover:to-pink-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:transform hover:scale-105"
              >
                <FiCalendar className="w-4 h-4 mr-2" />
                Reserve Court
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default CourtsSection