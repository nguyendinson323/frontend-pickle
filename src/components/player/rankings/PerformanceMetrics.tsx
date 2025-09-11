import React from 'react'
import { PerformanceMetrics as PerformanceMetricsType } from '../../../store/slices/playerRankingsSlice'

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
      <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Analysis</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h4 className="text-md font-medium text-gray-900 mb-4">Current Form</h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Last 10 Matches:</span>
              <span className="text-sm font-medium">
                {performanceMetrics.current_form.last_10_matches.wins}W - {performanceMetrics.current_form.last_10_matches.losses}L
                ({performanceMetrics.current_form.last_10_matches.win_percentage.toFixed(1)}%)
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Current Streak:</span>
              <span className="text-sm font-medium capitalize">
                {performanceMetrics.current_form.current_streak.count} {performanceMetrics.current_form.current_streak.type}
                {performanceMetrics.current_form.current_streak.count !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Ranking Change:</span>
              <span className={`text-sm font-medium ${
                performanceMetrics.current_form.last_30_days.ranking_change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {performanceMetrics.current_form.last_30_days.ranking_change >= 0 ? '+' : ''}
                {performanceMetrics.current_form.last_30_days.ranking_change}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h4 className="text-md font-medium text-gray-900 mb-4">Skill Ratings</h4>
          <div className="space-y-3">
            {Object.entries(performanceMetrics.skill_breakdown).map(([skill, rating]: [string, any]) => (
              <div key={skill} className="flex items-center">
                <div className="w-20 text-sm text-gray-600 capitalize">
                  {skill.replace('_', ' ')}:
                </div>
                <div className="flex-1 mx-3">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getPerformanceColor(rating)}`}
                      style={{ width: `${rating}%` }}
                    />
                  </div>
                </div>
                <div className="w-10 text-sm text-gray-900 font-medium text-right">
                  {rating}
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