import React from 'react'
import { useNavigate } from 'react-router-dom'

interface QuickAction {
  title: string
  description: string
  icon: string
  href: string
}

const CoachQuickActions: React.FC = () => {
  const navigate = useNavigate()

  const quickActions: QuickAction[] = [
    { title: 'Schedule Session', description: 'Book a new coaching session', icon: '📅', href: '/coach/schedule' },
    { title: 'Manage Students', description: 'View and manage your students', icon: '👥', href: '/coach/students' },
    { title: 'Referee Opportunities', description: 'Find referee assignments', icon: '👨‍⚖️', href: '/coach/referee' },
    { title: 'Certifications', description: 'View your certifications', icon: '🎓', href: '/coach/certifications' },
    { title: 'Session History', description: 'Review past sessions', icon: '📊', href: '/coach/history' },
    { title: 'My Profile', description: 'Update your coach profile', icon: '👤', href: '/coach/profile' }
  ]

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quickActions.map((action) => (
          <button
            key={action.title}
            onClick={() => navigate(action.href)}
            className="text-left p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-3">{action.icon}</span>
              <h4 className="font-semibold text-gray-900">{action.title}</h4>
            </div>
            <p className="text-sm text-gray-600">{action.description}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

export default CoachQuickActions