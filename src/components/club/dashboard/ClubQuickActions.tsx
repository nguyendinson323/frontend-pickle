import React from 'react'
import { useNavigate } from 'react-router-dom'

interface QuickAction {
  title: string
  description: string
  icon: string
  href: string
}

const ClubQuickActions: React.FC = () => {
  const navigate = useNavigate()

  const quickActions: QuickAction[] = [
    { title: 'Manage Members', description: 'View and manage club members', icon: '👥', href: '/club/members' },
    { title: 'Court Management', description: 'Manage court schedules and bookings', icon: '🎾', href: '/club/courts' },
    { title: 'Organize Tournament', description: 'Create and manage tournaments', icon: '🏆', href: '/club/tournaments' },
    { title: 'Club Microsite', description: 'Manage your club\'s website', icon: '🌐', href: '/club/microsite' },
    { title: 'Financial Reports', description: 'View revenue and expenses', icon: '📊', href: '/club/finances' },
    { title: 'Club Profile', description: 'Update club information', icon: '🏢', href: '/club/profile' }
  ]

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quickActions.map((action) => (
          <button
            key={action.title}
            onClick={() => navigate(action.href)}
            className="text-left p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-md transition-all duration-200"
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

export default ClubQuickActions