import React from 'react'
import { Coach } from '../../../store/slices/coachingSessionsSlice'

interface CoachesListProps {
  coaches: Coach[]
  onCoachSelect: (coachId: number) => void
}

const CoachesList: React.FC<CoachesListProps> = ({
  coaches,
  onCoachSelect
}) => {
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-6">Available Coaches</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coaches.map(coach => (
          <div
            key={coach.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {coach.full_name.charAt(0)}
                </span>
              </div>
              <div>
                <h4 className="text-lg font-medium text-gray-900">{coach.full_name}</h4>
                <p className="text-sm text-gray-600">{coach.specialization || 'General Coach'}</p>
              </div>
            </div>

            {coach.bio && (
              <p className="text-sm text-gray-600 mb-4">{coach.bio}</p>
            )}

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Experience:</span>
                <span className="text-gray-900">{coach.experience_years || 0} years</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Rate:</span>
                <span className="text-gray-900">${coach.hourly_rate || 50}/hour</span>
              </div>
              {coach.rating && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Rating:</span>
                  <span className="text-yellow-600">
                    ⭐ {coach.rating.toFixed(1)} ({coach.total_reviews} reviews)
                  </span>
                </div>
              )}
            </div>

            {coach.certifications && coach.certifications.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">Certifications:</p>
                <div className="flex flex-wrap gap-1">
                  {coach.certifications.map((cert: string, index: number) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => onCoachSelect(coach.id)}
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-green-600 text-green-600 text-sm font-medium rounded-md hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              View Profile
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CoachesList