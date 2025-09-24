import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FiCalendar,
  FiUsers,
  FiEye,
  FiAward,
  FiBarChart2,
  FiUser,
  FiChevronRight
} from 'react-icons/fi'

interface QuickAction {
  title: string
  description: string
  icon: React.ReactElement
  href: string
  gradient: string
  bgColor: string
}

const CoachQuickActions: React.FC = () => {
  const navigate = useNavigate()

  const quickActions: QuickAction[] = [
    {
      title: 'Schedule Session',
      description: 'Book a new coaching session',
      icon: <FiCalendar className="w-6 h-6" />,
      href: '/coach/schedule',
      gradient: 'from-blue-600 to-indigo-700',
      bgColor: 'from-blue-50 to-indigo-100'
    },
    {
      title: 'Manage Students',
      description: 'View and manage your students',
      icon: <FiUsers className="w-6 h-6" />,
      href: '/coach/students',
      gradient: 'from-purple-600 to-purple-700',
      bgColor: 'from-purple-50 to-purple-100'
    },
    {
      title: 'Referee Opportunities',
      description: 'Find referee assignments',
      icon: <FiEye className="w-6 h-6" />,
      href: '/coach/referee',
      gradient: 'from-orange-600 to-red-600',
      bgColor: 'from-orange-50 to-red-100'
    },
    {
      title: 'Certifications',
      description: 'View your certifications',
      icon: <FiAward className="w-6 h-6" />,
      href: '/coach/certifications',
      gradient: 'from-emerald-600 to-teal-700',
      bgColor: 'from-emerald-50 to-teal-100'
    },
    {
      title: 'Session History',
      description: 'Review past sessions',
      icon: <FiBarChart2 className="w-6 h-6" />,
      href: '/coach/history',
      gradient: 'from-green-600 to-emerald-700',
      bgColor: 'from-green-50 to-emerald-100'
    },
    {
      title: 'My Profile',
      description: 'Update your coach profile',
      icon: <FiUser className="w-6 h-6" />,
      href: '/coach/profile',
      gradient: 'from-indigo-600 to-purple-700',
      bgColor: 'from-indigo-50 to-purple-100'
    }
  ]

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-3xl shadow-2xl p-8">
      <div className="flex items-center mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl flex items-center justify-center mr-4">
          <FiChevronRight className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900">Quick Actions</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {quickActions.map((action) => (
          <button
            key={action.title}
            onClick={() => navigate(action.href)}
            className={`group text-left p-6 bg-gradient-to-br ${action.bgColor} border border-gray-200 rounded-2xl hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`bg-gradient-to-br ${action.gradient} rounded-2xl p-3 text-white shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                {action.icon}
              </div>
              <FiChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transform group-hover:translate-x-1 transition-all duration-300" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2 text-lg">{action.title}</h4>
            <p className="text-sm font-medium text-gray-600 group-hover:text-gray-700 transition-colors duration-300">{action.description}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

export default CoachQuickActions