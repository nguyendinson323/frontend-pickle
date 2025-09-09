import React from 'react'
import { PartnerCourt } from '../../../store/slices/partnerMicrositeSlice'
import { useNavigate } from 'react-router-dom'

interface CourtsSectionProps {
  courts: PartnerCourt[]
  isOwner: boolean
}

const CourtsSection: React.FC<CourtsSectionProps> = ({ courts, isOwner }) => {
  const navigate = useNavigate()

  if (courts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow border border-gray-200 p-8 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Courts</h2>
        <div className="text-center text-gray-500">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p>No courts available</p>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      maintenance: 'bg-yellow-100 text-yellow-800',
      inactive: 'bg-red-100 text-red-800'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const handleReserveCourt = (courtId: number) => {
    navigate(`/court-reservations?courtId=${courtId}`)
  }

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Available Courts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courts.map((court) => (
          <div key={court.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-semibold text-gray-900">{court.name}</h3>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(court.status)}`}>
                {court.status}
              </span>
            </div>
            
            {court.address && (
              <p className="text-sm text-gray-600 mb-2">
                <svg className="inline w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {court.address}
              </p>
            )}

            <div className="space-y-1 mb-3">
              <div className="flex items-center text-sm text-gray-600">
                <span className="font-medium mr-2">Courts:</span>
                <span>{court.court_count}</span>
              </div>
              {court.surface_type && (
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium mr-2">Surface:</span>
                  <span>{court.surface_type}</span>
                </div>
              )}
              <div className="flex space-x-3 text-sm">
                {court.indoor && (
                  <span className="flex items-center text-green-600">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Indoor
                  </span>
                )}
                {court.lights && (
                  <span className="flex items-center text-yellow-600">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Lights
                  </span>
                )}
              </div>
            </div>

            {court.description && (
              <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                {court.description}
              </p>
            )}

            {court.status === 'active' && !isOwner && (
              <button
                onClick={() => handleReserveCourt(court.id)}
                className="w-full px-3 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
              >
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