import React from 'react'

interface RecentMatchesListProps {
  recentMatches: any[]
  formatDate: (dateString: string) => string
}

const RecentMatchesList: React.FC<RecentMatchesListProps> = ({
  recentMatches,
  formatDate
}) => {
  if (recentMatches.length === 0) {
    return (
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-6">Recent Matches</h3>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="text-4xl mb-4">🎾</div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">No Match History</h4>
          <p className="text-gray-500">Your recent matches will appear here</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-6">Recent Matches</h3>
      
      <div className="space-y-4">
        {recentMatches.map(match => (
          <div key={match.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-2">
                  <div className={`w-3 h-3 rounded-full ${
                    match.result === 'win' ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <span className="font-medium text-gray-900 capitalize">
                    {match.result}
                  </span>
                  <span className="text-sm text-gray-500">vs</span>
                  <span className="font-medium text-gray-900">
                    {match.opponent.full_name}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <span>📅 {formatDate(match.match_date)}</span>
                  <span>🎾 {match.match_format}</span>
                  <span>📊 {match.final_score}</span>
                  {match.duration_minutes && (
                    <span>⏱️ {Math.floor(match.duration_minutes / 60)}h {match.duration_minutes % 60}m</span>
                  )}
                  <span className="capitalize">🏆 {match.match_type}</span>
                </div>

                {match.tournament && (
                  <div className="mt-2 text-sm text-blue-600">
                    🏆 {match.tournament.name} ({match.tournament.level})
                  </div>
                )}
              </div>
              
              <div className="text-right">
                <div className="text-lg font-semibold text-gray-900">
                  +{match.points_earned} pts
                </div>
                <div className="text-sm text-gray-500">
                  Rating: {match.performance_rating}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecentMatchesList