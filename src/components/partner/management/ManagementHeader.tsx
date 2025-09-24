import React from 'react'
import { ManagementStats } from '../../../store/slices/partnerManagementSlice'
import {
  FiHome,
  FiAward,
  FiDollarSign,
  FiCalendar,
  FiPlus,
  FiAlertTriangle,
  FiSettings
} from 'react-icons/fi'

interface ManagementHeaderProps {
  stats: ManagementStats | null
  onAddCourt: () => void
  onAddTournament: () => void
  loading: boolean
}

const ManagementHeader: React.FC<ManagementHeaderProps> = ({
  stats,
  onAddCourt,
  onAddTournament,
  loading
}) => {
  const StatCard: React.FC<{
    title: string
    value: number | string
    icon: React.ReactNode
    color: string
    subtitle?: string
  }> = ({ title, value, icon, color, subtitle }) => (
    <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105">
      <div className="flex items-center">
        <div className={`flex-shrink-0 p-4 rounded-2xl shadow-lg ${color}`}>
          {icon}
        </div>
        <div className="ml-4">
          <p className="text-sm font-bold text-gray-600">{title}</p>
          <div className="flex items-baseline">
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {subtitle && (
              <p className="ml-2 text-sm font-medium text-gray-600">{subtitle}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-2xl rounded-3xl p-8 mb-8">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="text-white">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mr-4">
                <FiSettings className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">Court & Tournament Management</h1>
                <p className="text-blue-100 font-medium">
                  Manage your facilities and organize tournaments
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 lg:mt-0 flex flex-col sm:flex-row gap-3">
            <button
              onClick={onAddCourt}
              disabled={loading}
              className="inline-flex items-center px-6 py-3 text-sm font-bold text-blue-700 bg-white border-2 border-white rounded-2xl hover:bg-blue-50 hover:border-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl hover:transform hover:scale-105"
            >
              <FiPlus className="w-5 h-5 mr-2" />
              Add Court
            </button>
            <button
              onClick={onAddTournament}
              disabled={loading}
              className="inline-flex items-center px-6 py-3 text-sm font-bold text-purple-700 bg-white border-2 border-white rounded-2xl hover:bg-purple-50 hover:border-purple-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl hover:transform hover:scale-105"
            >
              <FiPlus className="w-5 h-5 mr-2" />
              Add Tournament
            </button>
          </div>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Courts"
            value={stats.total_courts}
            subtitle={`${stats.active_courts} active`}
            color="bg-gradient-to-br from-blue-600 to-blue-700"
            icon={<FiHome className="w-7 h-7 text-white" />}
          />

          <StatCard
            title="Total Tournaments"
            value={stats.total_tournaments}
            subtitle={`${stats.upcoming_tournaments} upcoming`}
            color="bg-gradient-to-br from-purple-600 to-purple-700"
            icon={<FiAward className="w-7 h-7 text-white" />}
          />

          <StatCard
            title="Monthly Revenue"
            value={formatCurrency(stats.total_revenue_this_month)}
            color="bg-gradient-to-br from-green-600 to-green-700"
            icon={<FiDollarSign className="w-7 h-7 text-white" />}
          />

          <StatCard
            title="Monthly Bookings"
            value={stats.total_bookings_this_month}
            color="bg-gradient-to-br from-orange-600 to-orange-700"
            icon={<FiCalendar className="w-7 h-7 text-white" />}
          />
        </div>
      )}

      {stats && stats.maintenance_courts > 0 && (
        <div className="mt-6 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 shadow-lg rounded-2xl p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-600 to-orange-700 rounded-2xl flex items-center justify-center mr-4">
              <FiAlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-yellow-900 mb-1">Maintenance Alert</h3>
              <span className="text-yellow-800 font-medium">
                {stats.maintenance_courts} court{stats.maintenance_courts > 1 ? 's' : ''} currently under maintenance
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManagementHeader