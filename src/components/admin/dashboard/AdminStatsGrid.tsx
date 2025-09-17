import React from 'react'
import { AdminStats } from '../../../store/slices/adminDashboardSlice'
import {
  FiUsers,
  FiActivity,
  FiDollarSign,
  FiTrendingUp,
  FiAward,
  FiTarget,
  FiMapPin,
  FiZap,
  FiMail,
  FiInbox
} from 'react-icons/fi'
import {
  HiOutlineArrowSmUp,
  HiOutlineArrowSmDown
} from 'react-icons/hi'

interface StatCard {
  label: string
  value: number
  icon: React.ElementType
  color: string
  bgGradient: string
  change?: string
  changeType?: 'increase' | 'decrease' | 'neutral'
}

interface AdminStatsGridProps {
  stats: AdminStats
}

const AdminStatsGrid: React.FC<AdminStatsGridProps> = ({ stats }) => {
  const statCards: StatCard[] = [
    {
      label: 'Total Users',
      value: stats.totalUsers,
      icon: FiUsers,
      color: 'from-blue-500 to-blue-600',
      bgGradient: 'bg-gradient-to-br from-blue-50 to-blue-100',
      change: '+12%',
      changeType: 'increase'
    },
    {
      label: 'Active Users',
      value: stats.activeUsers,
      icon: FiActivity,
      color: 'from-green-500 to-green-600',
      bgGradient: 'bg-gradient-to-br from-green-50 to-green-100',
      change: '+8%',
      changeType: 'increase'
    },
    {
      label: 'Total Payments',
      value: stats.totalPayments,
      icon: FiDollarSign,
      color: 'from-purple-500 to-purple-600',
      bgGradient: 'bg-gradient-to-br from-purple-50 to-purple-100',
      change: '+23%',
      changeType: 'increase'
    },
    {
      label: 'Monthly Revenue',
      value: stats.monthlyRevenue,
      icon: FiTrendingUp,
      color: 'from-orange-500 to-orange-600',
      bgGradient: 'bg-gradient-to-br from-orange-50 to-orange-100',
      change: '+15%',
      changeType: 'increase'
    },
    {
      label: 'Total Tournaments',
      value: stats.totalTournaments,
      icon: FiAward,
      color: 'from-yellow-500 to-yellow-600',
      bgGradient: 'bg-gradient-to-br from-yellow-50 to-yellow-100',
      change: '+5%',
      changeType: 'increase'
    },
    {
      label: 'Active Tournaments',
      value: stats.activeTournaments,
      icon: FiTarget,
      color: 'from-red-500 to-red-600',
      bgGradient: 'bg-gradient-to-br from-red-50 to-red-100',
      change: '-2%',
      changeType: 'decrease'
    },
    {
      label: 'Total Courts',
      value: stats.totalCourts,
      icon: FiMapPin,
      color: 'from-indigo-500 to-indigo-600',
      bgGradient: 'bg-gradient-to-br from-indigo-50 to-indigo-100',
      change: '+7%',
      changeType: 'increase'
    },
    {
      label: 'Active Courts',
      value: stats.activeCourts,
      icon: FiZap,
      color: 'from-teal-500 to-teal-600',
      bgGradient: 'bg-gradient-to-br from-teal-50 to-teal-100',
      change: '+4%',
      changeType: 'increase'
    },
    {
      label: 'Total Messages',
      value: stats.totalMessages,
      icon: FiMail,
      color: 'from-slate-500 to-slate-600',
      bgGradient: 'bg-gradient-to-br from-slate-50 to-slate-100',
      change: '+18%',
      changeType: 'increase'
    },
    {
      label: 'Unread Messages',
      value: stats.unreadMessages,
      icon: FiInbox,
      color: 'from-pink-500 to-pink-600',
      bgGradient: 'bg-gradient-to-br from-pink-50 to-pink-100',
      change: '+25%',
      changeType: 'increase'
    }
  ]

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'increase':
        return <HiOutlineArrowSmUp className="w-3 h-3 text-green-500" />
      case 'decrease':
        return <HiOutlineArrowSmDown className="w-3 h-3 text-red-500" />
      default:
        return null
    }
  }


  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
      {statCards.map((stat, index) => (
        <div
          key={stat.label}
          className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200 transform hover:-translate-y-1"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className={`absolute inset-0 ${stat.bgGradient} opacity-0 group-hover:opacity-50 transition-opacity duration-300`}></div>
          <div className="relative p-6">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="w-6 h-6" />
              </div>
              {stat.change && (
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                  stat.changeType === 'increase'
                    ? 'bg-green-100 text-green-700'
                    : stat.changeType === 'decrease'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {getChangeIcon(stat.changeType || 'neutral')}
                  <span>{stat.change}</span>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-600 group-hover:text-gray-700 transition-colors duration-200">
                {stat.label}
              </h3>
              <p className="text-3xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors duration-200">
                {stat.value.toLocaleString()}
              </p>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AdminStatsGrid