import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FiSettings, FiMail, FiUsers, FiFileText, FiGlobe, FiBarChart2, FiZap } from 'react-icons/fi'

const StateQuickActions: React.FC = () => {
  const navigate = useNavigate()

  const quickActions = [
    { title: 'State Management', description: 'Oversee all state activities', icon: FiSettings, href: '/state/management', color: 'from-blue-500 to-blue-600' },
    { title: 'Message Center', description: 'Send announcements and messages', icon: FiMail, href: '/state/inbox', color: 'from-green-500 to-emerald-600' },
    { title: 'Member Management', description: 'Manage players, clubs and coaches', icon: FiUsers, href: '/state/member-management', color: 'from-purple-500 to-purple-600' },
    { title: 'Document Center', description: 'Upload and manage documents', icon: FiFileText, href: '/state/documents', color: 'from-red-500 to-pink-600' },
    { title: 'State Microsite', description: 'Manage your state website', icon: FiGlobe, href: '/state/microsite', color: 'from-indigo-500 to-indigo-600' },
    { title: 'Statistics & Reports', description: 'View comprehensive statistics', icon: FiBarChart2, href: '/state/statistics', color: 'from-yellow-500 to-orange-600' }
  ]

  return (
    <div className="bg-white rounded-3xl shadow-2xl border-2 border-gray-100 p-8">
      <div className="flex items-center mb-8">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mr-4 shadow-xl">
          <FiZap className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900">Quick Actions</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {quickActions.map((action) => {
          const IconComponent = action.icon
          return (
            <button
              key={action.title}
              onClick={() => navigate(action.href)}
              className="text-left p-6 bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-3xl hover:border-gray-300 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group"
            >
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-2xl flex items-center justify-center mr-4 shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold text-gray-900 text-lg group-hover:text-gray-800">{action.title}</h4>
              </div>
              <p className="text-sm text-gray-600 font-medium leading-relaxed">{action.description}</p>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default StateQuickActions