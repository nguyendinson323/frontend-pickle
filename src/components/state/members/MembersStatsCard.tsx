import React from 'react'
import { MemberStats } from '../../../store/slices/stateMemberManagementSlice'

interface MembersStatsCardProps {
  stats: MemberStats | null
}

const MembersStatsCard: React.FC<MembersStatsCardProps> = ({ stats }) => {
  if (!stats) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 rounded-lg">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Players</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total_players.toLocaleString()}</p>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-xs">
            <span className="text-green-600">Active: {stats.active_players}</span>
            <span className="text-red-600">Inactive: {stats.inactive_players}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <div className="flex items-center">
          <div className="p-2 bg-green-100 rounded-lg">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Coaches</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total_coaches.toLocaleString()}</p>
          </div>
        </div>
        <div className="mt-4">
          <div className="text-xs text-green-600">
            Active: {stats.active_coaches} of {stats.total_coaches}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <div className="flex items-center">
          <div className="p-2 bg-purple-100 rounded-lg">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Clubs</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total_clubs.toLocaleString()}</p>
          </div>
        </div>
        <div className="mt-4">
          <div className="text-xs text-green-600">
            Active: {stats.active_clubs} of {stats.total_clubs}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <div className="flex items-center">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Partners</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total_partners.toLocaleString()}</p>
          </div>
        </div>
        <div className="mt-4">
          <div className="text-xs text-green-600">
            Active: {stats.active_partners} of {stats.total_partners}
          </div>
        </div>
      </div>

      <div className="col-span-1 md:col-span-2 lg:col-span-2 bg-white rounded-lg shadow p-6 border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Players by Skill Level</h3>
        <div className="space-y-2">
          {Object.entries(stats.players_by_skill).map(([skill, count]) => (
            <div key={skill} className="flex justify-between items-center">
              <span className="text-sm text-gray-600 capitalize">{skill}</span>
              <span className="text-sm font-medium text-gray-900">{count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="col-span-1 md:col-span-2 lg:col-span-2 bg-white rounded-lg shadow p-6 border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">New Registrations (30 days)</span>
            <span className="text-sm font-medium text-gray-900">{stats.recent_registrations}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Coaches by Level</span>
            <div className="text-right">
              {Object.entries(stats.coaches_by_level).map(([level, count]) => (
                <div key={level} className="text-xs text-gray-500">
                  NRTP {level}: {count}
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