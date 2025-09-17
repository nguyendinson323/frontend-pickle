import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'
import {
  FiTrendingUp,
  FiTrendingDown,
  FiMinus,
  FiUser,
  FiCalendar,
  FiTarget,
  FiLoader,
  FiActivity,
  FiAward,
  FiFileText
} from 'react-icons/fi'

const RankingChanges: React.FC = () => {
  const { rankingChanges } = useSelector((state: RootState) => state.adminRankings)
  const { isLoading: loading } = useSelector((state: RootState) => state.loading)

  const getChangeColor = (changeType: string, pointsChange: number) => {
    if (changeType === 'gain' || pointsChange > 0) return 'text-green-600 bg-gradient-to-r from-green-100 to-green-200 border-green-300'
    if (changeType === 'loss' || pointsChange < 0) return 'text-red-600 bg-gradient-to-r from-red-100 to-red-200 border-red-300'
    return 'text-gray-600 bg-gradient-to-r from-gray-100 to-gray-200 border-gray-300'
  }

  const getChangeIcon = (changeType: string, pointsChange: number) => {
    if (changeType === 'gain' || pointsChange > 0) return FiTrendingUp
    if (changeType === 'loss' || pointsChange < 0) return FiTrendingDown
    return FiMinus
  }

  const formatPointsChange = (pointsChange: number) => {
    if (pointsChange > 0) return `+${pointsChange}`
    return pointsChange.toString()
  }

  if (loading) {
    return (
      <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <FiActivity className="mr-2 h-5 w-5" />
            Recent Ranking Changes
          </h3>
        </div>
        <div className="flex items-center justify-center p-12">
          <div className="text-center">
            <FiLoader className="animate-spin h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <p className="text-lg font-semibold text-gray-700">Loading ranking changes...</p>
            <p className="text-sm text-gray-500 mt-2">Please wait while we fetch the latest data</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white mr-3">
            <FiActivity className="h-5 w-5" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Recent Ranking Changes</h3>
        </div>
      </div>

      {rankingChanges.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-lg">
            <FiActivity className="h-10 w-10" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No ranking changes found</h3>
          <p className="text-lg text-gray-600 font-medium">
            No ranking changes match your current filter criteria.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Try adjusting your filters or check back later for new changes.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-100 to-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                  Player
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                  Points Change
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                  Change Type
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                  Tournament/Reason
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rankingChanges.map((change, index) => {
                const ChangeIcon = getChangeIcon(change.change_type, change.points_change)
                return (
                  <tr
                    key={change.id}
                    className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-200"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="px-6 py-6 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                          <FiUser className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-lg font-bold text-gray-900">
                            {change.player_name}
                          </div>
                          <div className="text-sm text-gray-500 font-medium">
                            @{change.username}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap">
                      <div className={`inline-flex items-center px-3 py-2 rounded-xl text-sm font-bold shadow-lg border-2 ${getChangeColor(change.change_type, change.points_change)}`}>
                        <ChangeIcon className="mr-2 h-4 w-4" />
                        <div>
                          <div>{formatPointsChange(change.points_change)} pts</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white">
                          <FiTarget className="h-4 w-4" />
                        </div>
                        <span className="text-lg font-bold text-gray-900 capitalize">
                          {change.change_type === 'gain' ? 'Point Gain' : 'Point Loss'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center text-white">
                          <FiAward className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-lg font-bold text-gray-900">
                            {change.tournament_name}
                          </div>
                          {change.reason && (
                            <div className="flex items-center space-x-1 mt-1">
                              <FiFileText className="h-3 w-3 text-gray-400" />
                              <span className="text-sm text-gray-500 font-medium">
                                {change.reason}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg flex items-center justify-center text-white">
                          <FiCalendar className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-lg font-bold text-gray-900">
                            {new Date(change.timestamp).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-500 font-medium">
                            {new Date(change.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default RankingChanges