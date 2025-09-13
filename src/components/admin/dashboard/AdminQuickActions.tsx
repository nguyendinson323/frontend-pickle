import React from 'react'
import { useNavigate } from 'react-router-dom'

interface QuickAction {
  title: string
  description: string
  icon: string
  href: string
}

const AdminQuickActions: React.FC = () => {
  const navigate = useNavigate()

  const quickActions: QuickAction[] = [
    { title: 'Messaging Inbox', description: 'Send announcements to clubs, players, and committees', icon: '📧', href: '/admin/messaging' },
    { title: 'User Management', description: 'View affiliations and manage all federation users', icon: '👥', href: '/admin/users' },
    { title: 'Rankings System', description: 'Control player rankings and position changes', icon: '📊', href: '/admin/rankings' },
    { title: 'Microsites Management', description: 'Supervise and manage state & club microsites', icon: '🌐', href: '/admin/microsites' },
    { title: 'Courts Monitoring', description: 'Monitor court activity and performance', icon: '🎾', href: '/admin/courts' },
    { title: 'Reports & Analytics', description: 'Generate CSV reports and analytics', icon: '📈', href: '/admin/reports' }
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

export default AdminQuickActions