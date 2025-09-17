import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FiMail,
  FiUsers,
  FiBarChart,
  FiGlobe,
  FiMapPin,
  FiTrendingUp,
  FiChevronRight
} from 'react-icons/fi'

interface QuickAction {
  title: string
  description: string
  icon: React.ElementType
  href: string
  color: string
  bgGradient: string
  priority?: 'high' | 'medium' | 'low'
}

const AdminQuickActions: React.FC = () => {
  const navigate = useNavigate()

  const quickActions: QuickAction[] = [
    {
      title: 'Messaging Inbox',
      description: 'Send announcements to clubs, players, and committees',
      icon: FiMail,
      href: '/admin/messaging',
      color: 'from-blue-500 to-indigo-600',
      bgGradient: 'bg-gradient-to-br from-blue-50 to-indigo-100',
      priority: 'high'
    },
    {
      title: 'User Management',
      description: 'View affiliations and manage all federation users',
      icon: FiUsers,
      href: '/admin/users',
      color: 'from-green-500 to-emerald-600',
      bgGradient: 'bg-gradient-to-br from-green-50 to-emerald-100',
      priority: 'high'
    },
    {
      title: 'Rankings System',
      description: 'Control player rankings and position changes',
      icon: FiBarChart,
      href: '/admin/rankings',
      color: 'from-purple-500 to-violet-600',
      bgGradient: 'bg-gradient-to-br from-purple-50 to-violet-100',
      priority: 'medium'
    },
    {
      title: 'Microsites Management',
      description: 'Supervise and manage state & club microsites',
      icon: FiGlobe,
      href: '/admin/microsites',
      color: 'from-cyan-500 to-blue-600',
      bgGradient: 'bg-gradient-to-br from-cyan-50 to-blue-100',
      priority: 'medium'
    },
    {
      title: 'Courts Monitoring',
      description: 'Monitor court activity and performance',
      icon: FiMapPin,
      href: '/admin/courts',
      color: 'from-orange-500 to-red-600',
      bgGradient: 'bg-gradient-to-br from-orange-50 to-red-100',
      priority: 'low'
    },
    {
      title: 'Reports & Analytics',
      description: 'Generate CSV reports and analytics',
      icon: FiTrendingUp,
      href: '/admin/reports',
      color: 'from-teal-500 to-green-600',
      bgGradient: 'bg-gradient-to-br from-teal-50 to-green-100',
      priority: 'medium'
    }
  ]

  const getPriorityIndicator = (priority: string) => {
    switch (priority) {
      case 'high':
        return <div className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
      case 'medium':
        return <div className="absolute top-3 right-3 w-2 h-2 bg-yellow-500 rounded-full"></div>
      default:
        return null
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">Quick Actions</h3>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-xs text-gray-600">High</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-xs text-gray-600">Medium</span>
            </div>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={action.title}
              onClick={() => navigate(action.href)}
              className="group relative text-left p-5 border border-gray-200 rounded-2xl hover:border-gray-300 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 overflow-hidden"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {getPriorityIndicator(action.priority || 'low')}
              <div className={`absolute inset-0 ${action.bgGradient} opacity-0 group-hover:opacity-30 transition-opacity duration-300`}></div>
              <div className="relative">
                <div className="flex items-center mb-3">
                  <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    <action.icon className="w-6 h-6" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h4 className="font-bold text-gray-900 group-hover:text-gray-800 transition-colors duration-200">
                      {action.title}
                    </h4>
                  </div>
                  <FiChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-200" />
                </div>
                <p className="text-sm text-gray-600 group-hover:text-gray-700 leading-relaxed transition-colors duration-200">
                  {action.description}
                </p>
              </div>
            </button>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Need help? Check the admin guide</span>
            <button className="text-indigo-600 hover:text-indigo-500 font-medium transition-colors duration-200">
              View Guide →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminQuickActions