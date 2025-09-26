import React from 'react'
import { MemberStats } from '../../../store/slices/stateMemberManagementSlice'
import { FiUsers, FiUserCheck, FiHome, FiActivity, FiBarChart2, FiClock } from 'react-icons/fi'

interface MembersStatsCardProps {
  stats: MemberStats | null
}

const MembersStatsCard: React.FC<MembersStatsCardProps> = ({ stats }) => {
  if (!stats) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-xl p-6 border border-blue-200/50 hover:shadow-2xl transition-all duration-300 group backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-blue-500 p-3 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-200">
            <FiUsers className="w-7 h-7 text-white" />
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-blue-700">Total Players</p>
            <p className="text-3xl font-bold text-blue-900">{stats.total_players.toLocaleString()}</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-green-700 font-medium">✓ Active</span>
            <span className="font-semibold text-green-800">{stats.active_players}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-red-700 font-medium">✗ Inactive</span>
            <span className="font-semibold text-red-800">{stats.inactive_players}</span>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl shadow-xl p-6 border border-green-200/50 hover:shadow-2xl transition-all duration-300 group backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-green-500 p-3 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-200">
            <FiUserCheck className="w-7 h-7 text-white" />
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-green-700">Total Coaches</p>
            <p className="text-3xl font-bold text-green-900">{stats.total_coaches.toLocaleString()}</p>
          </div>
        </div>
        <div className="text-sm text-green-700 font-medium">
          ✓ Active: <span className="font-bold text-green-800">{stats.active_coaches}</span> of <span className="font-bold">{stats.total_coaches}</span>
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl shadow-xl p-6 border border-purple-200/50 hover:shadow-2xl transition-all duration-300 group backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-purple-500 p-3 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-200">
            <FiHome className="w-7 h-7 text-white" />
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-purple-700">Total Clubs</p>
            <p className="text-3xl font-bold text-purple-900">{stats.total_clubs.toLocaleString()}</p>
          </div>
        </div>
        <div className="text-sm text-purple-700 font-medium">
          ✓ Active: <span className="font-bold text-purple-800">{stats.active_clubs}</span> of <span className="font-bold">{stats.total_clubs}</span>
        </div>
      </div>

      <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl shadow-xl p-6 border border-orange-200/50 hover:shadow-2xl transition-all duration-300 group backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-orange-500 p-3 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-200">
            <FiActivity className="w-7 h-7 text-white" />
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-orange-700">Total Partners</p>
            <p className="text-3xl font-bold text-orange-900">{stats.total_partners.toLocaleString()}</p>
          </div>
        </div>
        <div className="text-sm text-orange-700 font-medium">
          ✓ Active: <span className="font-bold text-orange-800">{stats.active_partners}</span> of <span className="font-bold">{stats.total_partners}</span>
        </div>
      </div>

      <div className="col-span-1 md:col-span-2 lg:col-span-2 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl shadow-xl p-6 border border-indigo-200/50 hover:shadow-2xl transition-all duration-300 backdrop-blur-sm">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-indigo-500 p-2 rounded-xl shadow-lg">
            <FiBarChart2 className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-indigo-900">Players by Skill Level</h3>
        </div>
        <div className="space-y-3">
          {Object.entries(stats.players_by_skill).map(([skill, count]) => (
            <div key={skill} className="flex justify-between items-center p-3 bg-white/60 rounded-xl backdrop-blur-sm">
              <span className="text-sm font-semibold text-indigo-700 capitalize">NRTP {skill}</span>
              <span className="text-sm font-bold text-indigo-900 bg-indigo-200 px-3 py-1 rounded-lg">{count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="col-span-1 md:col-span-2 lg:col-span-2 bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl shadow-xl p-6 border border-teal-200/50 hover:shadow-2xl transition-all duration-300 backdrop-blur-sm">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-teal-500 p-2 rounded-xl shadow-lg">
            <FiClock className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-teal-900">Recent Activity</h3>
        </div>
        <div className="space-y-4">
          <div className="p-4 bg-white/60 rounded-xl backdrop-blur-sm">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-teal-700">New Registrations (30 days)</span>
              <span className="text-lg font-bold text-teal-900 bg-teal-200 px-3 py-1 rounded-lg">{stats.recent_registrations}</span>
            </div>
          </div>
          <div className="p-4 bg-white/60 rounded-xl backdrop-blur-sm">
            <div className="text-sm font-semibold text-teal-700 mb-3">Coaches by Level</div>
            <div className="space-y-2">
              {Object.entries(stats.coaches_by_level).map(([level, count]) => (
                <div key={level} className="flex justify-between items-center">
                  <span className="text-xs text-teal-600 font-medium">NRTP {level}</span>
                  <span className="text-xs font-bold text-teal-800 bg-teal-200 px-2 py-1 rounded">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MembersStatsCard