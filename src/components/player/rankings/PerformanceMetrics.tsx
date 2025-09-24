import React from 'react'
import { PerformanceMetrics as PerformanceMetricsType } from '../../../store/slices/playerRankingsSlice'
import {
  FiActivity,
  FiTrendingUp,
  FiBarChart2,
  FiTarget,
  FiZap
} from 'react-icons/fi'

interface PerformanceMetricsProps {
  performanceMetrics: PerformanceMetricsType | null
  getPerformanceColor: (rating: number) => string
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({
  performanceMetrics,
  getPerformanceColor
}) => {
  if (!performanceMetrics) return null

  return (
    <div>
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mr-3 shadow-lg">
          <FiBarChart2 className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900">Performance Analysis</h3>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 p-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mr-4 shadow-lg">
              <FiActivity className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-xl font-bold text-gray-900">Current Form</h4>
          </div>
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-2xl border-2 border-green-100">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <FiTarget className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-sm font-bold text-green-700">Last 10 Matches:</span>
                </div>
                <span className="text-sm font-bold text-gray-900">
                  {performanceMetrics.current_form.last_10_matches.wins}W - {performanceMetrics.current_form.last_10_matches.losses}L
                  <span className="text-green-600 ml-2">
                    ({performanceMetrics.current_form.last_10_matches.win_percentage.toFixed(1)}%)
                  </span>
                </span>
              </div>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-2xl border-2 border-blue-100">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <FiZap className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="text-sm font-bold text-blue-700">Current Streak:</span>
                </div>
                <span className="text-sm font-bold text-gray-900 capitalize">
                  {performanceMetrics.current_form.current_streak.count} {performanceMetrics.current_form.current_streak.type}
                  {performanceMetrics.current_form.current_streak.count !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-2xl border-2 border-purple-100">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <FiTrendingUp className="w-5 h-5 text-purple-600 mr-2" />
                  <span className="text-sm font-bold text-purple-700">Ranking Change:</span>
                </div>
                <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                  performanceMetrics.current_form.last_30_days.ranking_change >= 0
                    ? 'text-green-700 bg-green-100'
                    : 'text-red-700 bg-red-100'
                }`}>
                  {performanceMetrics.current_form.last_30_days.ranking_change >= 0 ? '+' : ''}
                  {performanceMetrics.current_form.last_30_days.ranking_change}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 p-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-red-600 rounded-full flex items-center justify-center mr-4 shadow-lg">
              <FiBarChart2 className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-xl font-bold text-gray-900">Skill Ratings</h4>
          </div>
          <div className="space-y-4">
            {Object.entries(performanceMetrics.skill_breakdown).map(([skill, rating]: [string, any]) => (
              <div key={skill} className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-2xl border-2 border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-bold text-gray-700 capitalize flex items-center">
                    <FiTarget className="w-4 h-4 mr-2 text-indigo-600" />
                    {skill.replace('_', ' ')}
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {rating}
                  </div>
                </div>
                <div className="w-full bg-gray-300 rounded-full h-3 shadow-inner">
                  <div
                    className={`h-3 rounded-full shadow-lg transition-all duration-500 ${getPerformanceColor(rating)}`}
                    style={{ width: `${rating}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PerformanceMetrics