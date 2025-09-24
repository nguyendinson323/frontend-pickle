import React from 'react'
import { Coach } from '../../../store/slices/coachingSessionsSlice'
import {
  FiUsers,
  FiStar,
  FiUser,
  FiDollarSign,
  FiClock,
  FiAward
} from 'react-icons/fi'

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
      {/* Header */}
      <div className="flex items-center mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl flex items-center justify-center mr-4">
          <FiUsers className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900">Available Coaches</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {coaches.map(coach => (
          <div
            key={coach.id}
            className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl border border-gray-200 p-8 hover:shadow-2xl transition-all duration-300 hover:transform hover:scale-105"
          >
            {/* Coach Header */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-700 rounded-3xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-2xl">
                  {coach.full_name.charAt(0)}
                </span>
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900">{coach.full_name}</h4>
                <p className="text-sm font-medium text-gray-600 bg-blue-100 px-3 py-1 rounded-full inline-block">
                  {coach.specialization || 'General Coach'}
                </p>
              </div>
            </div>

            {/* Bio */}
            {coach.bio && (
              <div className="bg-gray-50 rounded-2xl p-6 mb-6 border border-gray-200">
                <p className="text-gray-700 font-medium">{coach.bio}</p>
              </div>
            )}

            {/* Coach Stats */}
            <div className="grid grid-cols-1 gap-4 mb-6">
              <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FiClock className="w-4 h-4 text-blue-600 mr-2" />
                    <span className="text-sm font-bold text-blue-800">Experience</span>
                  </div>
                  <span className="text-blue-900 font-bold">{coach.experience_years || 0} years</span>
                </div>
              </div>

              <div className="bg-green-50 rounded-2xl p-4 border border-green-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FiDollarSign className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-sm font-bold text-green-800">Hourly Rate</span>
                  </div>
                  <span className="text-green-900 font-bold">${coach.hourly_rate || 50}</span>
                </div>
              </div>

              {coach.rating && (
                <div className="bg-yellow-50 rounded-2xl p-4 border border-yellow-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FiStar className="w-4 h-4 text-yellow-600 mr-2" />
                      <span className="text-sm font-bold text-yellow-800">Rating</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-yellow-900 font-bold mr-2">
                        {coach.rating.toFixed(1)}
                      </span>
                      <span className="text-xs text-yellow-700 bg-yellow-100 px-2 py-1 rounded-full">
                        ({coach.total_reviews} reviews)
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Certifications */}
            {coach.certifications && coach.certifications.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center mb-3">
                  <FiAward className="w-4 h-4 text-purple-600 mr-2" />
                  <p className="text-sm font-bold text-purple-800">Certifications</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {coach.certifications.map((cert: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-2 bg-purple-100 text-purple-800 text-xs font-bold rounded-2xl border border-purple-200"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* View Profile Button */}
            <button
              onClick={() => onCoachSelect(coach.id)}
              className="w-full inline-flex justify-center items-center px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-700 text-white font-bold rounded-2xl hover:from-blue-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl hover:transform hover:scale-105"
            >
              <FiUser className="w-5 h-5 mr-3" />
              View Profile
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CoachesList