import React, { useEffect } from 'react'
import { FiBarChart2, FiTrendingUp, FiUsers, FiStar, FiDollarSign, FiActivity, FiLoader, FiFolder, FiPieChart, FiBarChart, FiTarget, FiAward, FiCalendar, FiDownload, FiEye, FiSettings } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../../../store'
import { fetchStateStatisticsData } from '../../../../store/slices/stateStatisticsSlice'

export const StateStatisticsTab: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const {
    tournamentAnalytics,
    playerAnalytics,
    clubAnalytics,
    financialAnalytics,
    loading,
    error
  } = useSelector((state: RootState) => state.stateStatistics)

  useEffect(() => {
    dispatch(fetchStateStatisticsData())
  }, [dispatch])

  if (loading && !tournamentAnalytics) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
          ))}
        </div>
        <div className="space-y-3">
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header Section with Modern Design */}
      <div className="bg-gradient-to-br from-white to-purple-50 rounded-3xl shadow-2xl border-2 border-gray-200/50 p-8 backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
          <div className="flex items-center space-x-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-xl">
              <FiBarChart2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 bg-clip-text text-transparent mb-2">Analytics Dashboard</h3>
              <p className="text-lg text-gray-600 font-medium">Comprehensive performance analytics and growth insights for your state committee</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/state/statistics')}
            className="flex items-center justify-center px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold rounded-3xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            <FiBarChart className="w-5 h-5 mr-3" />
            View Full Analytics
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Total Players</p>
              <p className="text-3xl font-bold text-blue-900">
                {playerAnalytics?.total_players || 0}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                +{playerAnalytics?.growth_metrics.new_registrations_this_month || 0} this month
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Total Tournaments</p>
              <p className="text-3xl font-bold text-green-900">
                {tournamentAnalytics?.total_tournaments || 0}
              </p>
              <p className="text-xs text-green-600 mt-1">
                {tournamentAnalytics?.tournaments_by_status.upcoming || 0} upcoming
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">Total Revenue</p>
              <p className="text-3xl font-bold text-purple-900">
                ${financialAnalytics?.revenue_summary.total_revenue?.toLocaleString() || '0'}
              </p>
              <p className="text-xs text-purple-600 mt-1">
                ${(financialAnalytics?.monthly_trends?.[financialAnalytics.monthly_trends.length - 1]?.revenue || 0).toLocaleString()} this month
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-700">Total Clubs</p>
              <p className="text-3xl font-bold text-orange-900">
                {clubAnalytics?.total_clubs || 0}
              </p>
              <p className="text-xs text-orange-600 mt-1">
                {clubAnalytics?.activity_metrics.tournaments_hosted || 0} tournaments hosted
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Growth Chart Preview */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h4 className="font-medium text-gray-900">Member Growth Trend</h4>
          <button
            onClick={() => navigate('/state/statistics?view=growth')}
            className="text-red-600 hover:text-red-700 text-sm font-medium"
          >
            View Details
          </button>
        </div>
        <div className="p-6">
          {playerAnalytics?.growth_metrics.registrations_by_month && playerAnalytics.growth_metrics.registrations_by_month.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Last 6 Months Growth</span>
                <span className="font-medium text-green-600">
                  +{playerAnalytics.growth_metrics.growth_rate || 0}%
                </span>
              </div>
              <div className="h-32 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="flex items-end space-x-2 h-20">
                  {playerAnalytics.growth_metrics.registrations_by_month.slice(-6).map((data, index) => (
                    <div
                      key={index}
                      className="bg-red-500 rounded-t"
                      style={{
                        height: `${Math.max((data.new_players || 0) / Math.max(...playerAnalytics.growth_metrics.registrations_by_month.map(d => d.new_players || 0)) * 80, 4)}px`,
                        width: '20px'
                      }}
                      title={`${data.month}: ${data.new_players} new players`}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">No Growth Data</h4>
              <p className="text-gray-600">Growth analytics will appear once you have member activity data.</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Statistics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h4 className="font-medium text-gray-900">Tournament Performance</h4>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Completed Tournaments</span>
                <span className="font-medium">{tournamentAnalytics?.tournaments_by_status.completed || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Registrations</span>
                <span className="font-medium">{tournamentAnalytics?.participation_metrics.total_registrations || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Average Tournament Size</span>
                <span className="font-medium">
                  {Math.round(tournamentAnalytics?.participation_metrics.average_per_tournament || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Completion Rate</span>
                <span className="font-medium text-green-600">
                  {tournamentAnalytics?.participation_metrics.completion_rate || 0}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h4 className="font-medium text-gray-900">Membership Overview</h4>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active Players</span>
                <span className="font-medium">{playerAnalytics?.activity_metrics.active_players || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tournament Participants</span>
                <span className="font-medium">{playerAnalytics?.activity_metrics.tournament_participants || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg. Tournaments per Player</span>
                <span className="font-medium text-green-600">
                  {playerAnalytics?.activity_metrics.average_tournaments_per_player || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Growth Rate</span>
                <span className="font-medium">
                  {playerAnalytics?.growth_metrics.growth_rate || 0}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => navigate('/state/statistics?report=monthly')}
          className="flex items-center justify-center px-4 py-3 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Monthly Report
        </button>
        <button
          onClick={() => navigate('/state/statistics?view=tournaments')}
          className="flex items-center justify-center px-4 py-3 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
          Tournament Analytics
        </button>
        <button
          onClick={() => navigate('/state/statistics?export=true')}
          className="flex items-center justify-center px-4 py-3 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export Data
        </button>
      </div>
    </div>
  )
}