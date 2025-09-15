import React from 'react'
import { useNavigate } from 'react-router-dom'

const StateQuickActions: React.FC = () => {
  const navigate = useNavigate()

  const quickActions = [
    { title: 'State Management', description: 'Oversee all state activities', icon: '🏛️', href: '/state/management' },
    { title: 'Message Center', description: 'Send announcements and messages', icon: '📬', href: '/state/inbox' },
    { title: 'Member Management', description: 'Manage players, clubs and coaches', icon: '👥', href: '/state/member-management' },
    { title: 'Document Center', description: 'Upload and manage documents', icon: '📄', href: '/state/documents' },
    { title: 'State Microsite', description: 'Manage your state website', icon: '🌐', href: '/state/microsite' },
    { title: 'Statistics & Reports', description: 'View comprehensive statistics', icon: '📊', href: '/state/statistics' }
  ]

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quickActions.map((action) => (
          <button
            key={action.title}
            onClick={() => navigate(action.href)}
            className="text-left p-4 border border-gray-200 rounded-lg hover:border-red-300 hover:shadow-md transition-all duration-200"
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

export default StateQuickActions