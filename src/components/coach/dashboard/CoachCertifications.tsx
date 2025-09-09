import React from 'react'
import { useNavigate } from 'react-router-dom'

interface CoachCertificationsProps {
  certifications: number
}

const CoachCertifications: React.FC<CoachCertificationsProps> = ({ certifications }) => {
  const navigate = useNavigate()

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Your Certifications</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center mb-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <span className="text-2xl">🎓</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Coaching Qualifications</h4>
              <p className="text-sm text-gray-600">Active certification</p>
            </div>
          </div>
          <div className="text-sm text-gray-700  p-3 rounded">
            Level 2 Certified Pickleball Coach
          </div>
        </div>

        <div className="p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center mb-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
              <span className="text-2xl">👨‍⚖️</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Referee Status</h4>
              <p className="text-sm text-green-600">Certified referee</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tournaments refereed:</span>
              <span className="font-medium">12</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Matches officiated:</span>
              <span className="font-medium">45</span>
            </div>
          </div>
        </div>
      </div>

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