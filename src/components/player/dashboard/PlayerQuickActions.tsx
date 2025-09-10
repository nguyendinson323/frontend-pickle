import React from 'react'
import { useNavigate } from 'react-router-dom'

const PlayerQuickActions: React.FC = () => {
  const navigate = useNavigate()

  const quickActions = [
    { title: 'Find Courts', description: 'Search for available courts near you', icon: '🎾', href: '/player/court-reservations' },
    { title: 'Join Tournament', description: 'Register for upcoming tournaments', icon: '🏆', href: '/player/tournament-browse' },
    { title: 'Find Players', description: 'Connect with other players', icon: '👥', href: '/player/finder' },
    { title: 'My Profile', description: 'Update your player information', icon: '👤', href: '/player/profile' },
    { title: 'Rankings', description: 'View your ranking history', icon: '📈', href: '/player/rankings' },
    { title: 'Digital Credential', description: 'View your official credentials', icon: '🎫', href: '/player/digital-credentials' }
  ]

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quickActions.map((action) => (
          <button
            key={action.title}
            onClick={() => navigate(action.href)}
            className="text-left p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-md transition-all duration-200"
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

export default PlayerQuickActions