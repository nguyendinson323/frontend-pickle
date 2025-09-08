import React from 'react'
import { useNavigate } from 'react-router-dom'

const PartnerQuickActions: React.FC = () => {
  const navigate = useNavigate()

  const quickActions = [
    { title: 'Court Management', description: 'Manage court availability and pricing', icon: '🎾', href: '/partner/courts' },
    { title: 'Booking System', description: 'View and manage reservations', icon: '📅', href: '/partner/bookings' },
    { title: 'Event Hosting', description: 'Create and manage events', icon: '🎉', href: '/partner/events' },
    { title: 'Business Microsite', description: 'Manage your business website', icon: '🌐', href: '/partner/microsite' },
    { title: 'Revenue Analytics', description: 'Track earnings and performance', icon: '📊', href: '/partner/analytics' },
    { title: 'Partner Profile', description: 'Update business information', icon: '🏨', href: '/partner/profile' }
  ]

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quickActions.map((action) => (
          <button
            key={action.title}
            onClick={() => navigate(action.href)}
            className="text-left p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:shadow-md transition-all duration-200"
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

export default PartnerQuickActions