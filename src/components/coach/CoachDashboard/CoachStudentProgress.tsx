import React from 'react'
import { useNavigate } from 'react-router-dom'

const CoachStudentProgress: React.FC = () => {
  const navigate = useNavigate()

  const progressHighlights = [
    {
      icon: '📈',
      title: 'Skill Level Improvements',
      description: '5 students advanced their NRTP level this month',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800',
      descColor: 'text-green-600'
    },
    {
      icon: '🎯',
      title: 'Tournament Success',
      description: '3 students won tournaments this quarter',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      descColor: 'text-blue-600'
    },
    {
      icon: '👥',
      title: 'New Students',
      description: '8 new students this month',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-800',
      descColor: 'text-purple-600'
    }
  ]

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Student Progress Highlights</h3>
      <div className="space-y-4">
        {progressHighlights.map((highlight, index) => (
          <div key={index} className={`p-4 ${highlight.bgColor} ${highlight.borderColor} border rounded-lg`}>
            <div className="flex items-center">
              <div className="text-2xl mr-3">{highlight.icon}</div>
              <div>
                <p className={`font-medium ${highlight.textColor}`}>{highlight.title}</p>
                <p className={`text-sm ${highlight.descColor}`}>{highlight.description}</p>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={() => navigate('/coach/student-progress')}
          className="text-blue-600 hover:text-blue-500 text-sm font-medium"
        >
          View detailed progress →
        </button>
      </div>
    </div>
  )
}

export default CoachStudentProgress