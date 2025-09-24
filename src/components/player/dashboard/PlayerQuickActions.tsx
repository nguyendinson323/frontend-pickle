import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FiMapPin,
  FiAward,
  FiUsers,
  FiUser,
  FiTrendingUp,
  FiCreditCard
} from 'react-icons/fi'

const PlayerQuickActions: React.FC = () => {
  const navigate = useNavigate()

  const quickActions = [
    { title: 'Find Courts', description: 'Search for available courts near you', icon: FiMapPin, href: '/player/court-reservations', color: 'from-green-500 to-emerald-600', bgColor: 'bg-green-50', textColor: 'text-green-800' },
    { title: 'Join Tournament', description: 'Register for upcoming tournaments', icon: FiAward, href: '/player/tournament-browse', color: 'from-yellow-500 to-orange-600', bgColor: 'bg-yellow-50', textColor: 'text-yellow-800' },
    { title: 'Find Players', description: 'Connect with other players', icon: FiUsers, href: '/player/finder', color: 'from-blue-500 to-indigo-600', bgColor: 'bg-blue-50', textColor: 'text-blue-800' },
    { title: 'My Profile', description: 'Update your player information', icon: FiUser, href: '/player/profile', color: 'from-purple-500 to-pink-600', bgColor: 'bg-purple-50', textColor: 'text-purple-800' },
    { title: 'Rankings', description: 'View your ranking history', icon: FiTrendingUp, href: '/player/rankings', color: 'from-red-500 to-pink-600', bgColor: 'bg-red-50', textColor: 'text-red-800' },
    { title: 'Digital Credential', description: 'View your official credentials', icon: FiCreditCard, href: '/player/profile', color: 'from-indigo-500 to-purple-600', bgColor: 'bg-indigo-50', textColor: 'text-indigo-800' }
  ]

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl border-2 border-gray-100 p-8">
      <div className="flex items-center mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4">
          <FiUser className="w-6 h-6 text-white" />
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
              className={`${action.bgColor} text-left p-6 rounded-2xl border-2 border-white hover:shadow-2xl transition-all duration-300 hover:transform hover:scale-105 hover:border-opacity-50`}
            >
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-2xl flex items-center justify-center mr-4 shadow-lg`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <h4 className={`font-bold ${action.textColor} text-lg`}>{action.title}</h4>
              </div>
              <p className={`text-sm ${action.textColor} opacity-80 font-medium`}>{action.description}</p>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default PlayerQuickActions