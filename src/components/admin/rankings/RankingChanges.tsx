import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'

const RankingChanges: React.FC = () => {
  const { rankingChanges, loading } = useSelector((state: RootState) => state.adminRankings)

  const getChangeColor = (oldPos: number, newPos: number) => {
    if (newPos < oldPos) return 'text-green-600' // Improved ranking (lower number = better)
    if (newPos > oldPos) return 'text-red-600'   // Declined ranking
    return 'text-gray-600' // No change
  }

  const getChangeIcon = (oldPos: number, newPos: number) => {
    if (newPos < oldPos) return '⬆️' // Improved
    if (newPos > oldPos) return '⬇️' // Declined
    return '➡️' // No change
  }

  const formatChange = (oldPos: number, newPos: number) => {
    const diff = oldPos - newPos // Positive means improved, negative means declined
    if (diff > 0) return `+${diff}`
    if (diff < 0) return `${diff}`
    return '0'
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
                  Position Change
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Points Change
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
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`flex items-center text-sm font-medium ${getChangeColor(change.old_position, change.new_position)}`}>
                      <span className="mr-2">{getChangeIcon(change.old_position, change.new_position)}</span>
                      <div>
                        <div>#{change.old_position} → #{change.new_position}</div>
                        <div className="text-xs">
                          ({formatChange(change.old_position, change.new_position)} positions)
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${change.new_points > change.old_points ? 'text-green-600' : change.new_points < change.old_points ? 'text-red-600' : 'text-gray-600'}`}>
                      <div>{change.old_points} → {change.new_points} pts</div>
                      <div className="text-xs">
                        ({change.new_points > change.old_points ? '+' : ''}{change.new_points - change.old_points} pts)
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {change.tournament_name || change.reason}
                    </div>
                    {change.tournament_name && (
                      <div className="text-xs text-gray-500">
                        Tournament #{change.tournament_id}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(change.change_date).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(change.change_date).toLocaleTimeString()}
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