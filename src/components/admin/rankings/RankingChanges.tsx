import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'

const RankingChanges: React.FC = () => {
  const { rankingChanges } = useSelector((state: RootState) => state.adminRankings)
  const { isLoading: loading } = useSelector((state: RootState) => state.loading)

  const getChangeColor = (changeType: string, pointsChange: number) => {
    if (changeType === 'gain' || pointsChange > 0) return 'text-green-600'
    if (changeType === 'loss' || pointsChange < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  const getChangeIcon = (changeType: string, pointsChange: number) => {
    if (changeType === 'gain' || pointsChange > 0) return '⬆️'
    if (changeType === 'loss' || pointsChange < 0) return '⬇️'
    return '➡️'
  }

  const formatPointsChange = (pointsChange: number) => {
    if (pointsChange > 0) return `+${pointsChange}`
    return pointsChange.toString()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Recent Ranking Changes</h3>
      </div>

      {rankingChanges.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No ranking changes found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Player
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Points Change
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Change Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tournament/Reason
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rankingChanges.map((change) => (
                <tr key={change.id} className="hover:">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {change.player_name}
                    </div>
                    <div className="text-xs text-gray-500">
                      @{change.username}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`flex items-center text-sm font-medium ${getChangeColor(change.change_type, change.points_change)}`}>
                      <span className="mr-2">{getChangeIcon(change.change_type, change.points_change)}</span>
                      <div>
                        <div>{formatPointsChange(change.points_change)} pts</div>
                        <div className="text-xs capitalize">
                          {change.change_type}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${getChangeColor(change.change_type, change.points_change)}`}>
                      {change.change_type === 'gain' ? 'Point Gain' : 'Point Loss'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {change.tournament_name}
                    </div>
                    {change.reason && (
                      <div className="text-xs text-gray-500">
                        {change.reason}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(change.timestamp).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(change.timestamp).toLocaleTimeString()}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default RankingChanges