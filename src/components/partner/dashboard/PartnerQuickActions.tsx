import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FiActivity,
  FiAward,
  FiGlobe,
  FiBarChart2,
  FiHome,
  FiFileText,
  FiZap
} from 'react-icons/fi'

const PartnerQuickActions: React.FC = () => {
  const navigate = useNavigate()

  const quickActions = [
    {
      title: 'Court Management',
      description: 'Manage court availability and pricing',
      icon: <FiActivity className="w-6 h-6" />,
      href: '/partner/management',
      color: 'from-green-600 to-emerald-700',
      bgColor: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-200'
    },
    {
      title: 'Tournament Hosting',
      description: 'Create and manage tournaments',
      icon: <FiAward className="w-6 h-6" />,
      href: '/partner/management',
      color: 'from-purple-600 to-indigo-700',
      bgColor: 'from-purple-50 to-indigo-50',
      borderColor: 'border-purple-200'
    },
    {
      title: 'Business Microsite',
      description: 'Manage your business website',
      icon: <FiGlobe className="w-6 h-6" />,
      href: '/partner/microsite',
      color: 'from-blue-600 to-indigo-700',
      bgColor: 'from-blue-50 to-indigo-50',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Revenue Analytics',
      description: 'Track earnings and performance',
      icon: <FiBarChart2 className="w-6 h-6" />,
      href: '/partner/statistics',
      color: 'from-yellow-600 to-orange-700',
      bgColor: 'from-yellow-50 to-orange-50',
      borderColor: 'border-yellow-200'
    },
    {
      title: 'Partner Profile',
      description: 'Update business information',
      icon: <FiHome className="w-6 h-6" />,
      href: '/partner/profile',
      color: 'from-orange-600 to-orange-700',
      bgColor: 'from-orange-50 to-orange-50',
      borderColor: 'border-orange-200'
    },
    {
      title: 'Documents & Invoices',
      description: 'Manage documents and payments',
      icon: <FiFileText className="w-6 h-6" />,
      href: '/partner/documents',
      color: 'from-gray-600 to-slate-700',
      bgColor: 'from-gray-50 to-slate-50',
      borderColor: 'border-gray-200'
    }
  ]

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-2xl rounded-3xl p-8">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-orange-700 rounded-2xl flex items-center justify-center mr-3">
          <FiZap className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900">Quick Actions</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quickActions.map((action) => (
          <button
            key={action.title}
            onClick={() => navigate(action.href)}
            className={`text-left p-6 bg-gradient-to-br ${action.bgColor} border ${action.borderColor} rounded-2xl hover:shadow-lg transition-all duration-200 transform hover:scale-105 shadow-md`}
          >
            <div className="flex items-center mb-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-2xl flex items-center justify-center mr-4 text-white shadow-lg`}>
                {action.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 mb-1">{action.title}</h4>
                <p className="text-sm text-gray-700 font-medium">{action.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default PartnerQuickActions