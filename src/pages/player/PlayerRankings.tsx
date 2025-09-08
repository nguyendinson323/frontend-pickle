import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../store'
import { 
  fetchPlayerStats,
  fetchPlayerRankings,
  fetchRecentMatches,
  fetchTournamentHistory,
  fetchPerformanceMetrics,
  fetchLeaderboard,
  searchPlayersForComparison,
  getPlayerComparison,
  setSelectedRankingType,
  setSelectedTimeframe,
  setFilters,
  setComparisonMode,
  setComparisonPlayer
} from '../../store/slices/playerRankingsSlice'
import { AppDispatch } from '../../store'

const PlayerRankings: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [activeTab, setActiveTab] = useState<'overview' | 'matches' | 'tournaments' | 'leaderboards' | 'compare'>('overview')
  const [comparisonSearch, setComparisonSearch] = useState('')
  const [comparisonResults, setComparisonResults] = useState<any[]>([])
  const [comparisonData, setComparisonData] = useState<any>(null)
  
  const {
    playerStats,
    playerRankings,
    recentMatches,
    tournamentHistory,
    performanceMetrics,
    leaderboards,
    selectedRankingType,
    selectedTimeframe,
    isLoading,
    error,
    statsPeriod,
    comparisonMode,
    comparisonPlayer
  } = useSelector((state: RootState) => state.playerRankings)

  useEffect(() => {
    dispatch(fetchPlayerStats(selectedTimeframe))
    dispatch(fetchPlayerRankings())
    dispatch(fetchRecentMatches(10))
    dispatch(fetchTournamentHistory(selectedTimeframe))
    dispatch(fetchPerformanceMetrics(selectedTimeframe))
    dispatch(fetchLeaderboard(selectedRankingType, 20))
  }, [dispatch, selectedTimeframe, selectedRankingType])

  useEffect(() => {
    if (comparisonSearch.length >= 2) {
      const searchTimeout = setTimeout(async () => {
        try {
          const results = await dispatch(searchPlayersForComparison(comparisonSearch))
          setComparisonResults(results)
        } catch (error) {
          setComparisonResults([])
        }
      }, 300)
      
      return () => clearTimeout(searchTimeout)
    } else {
      setComparisonResults([])
    }
  }, [comparisonSearch, dispatch])

  const handleTimeframeChange = (timeframe: '30d' | '3m' | '6m' | '1y' | 'all') => {
    dispatch(setSelectedTimeframe(timeframe))
  }

  const handleRankingTypeChange = (rankingType: 'overall' | 'state' | 'club' | 'age_group') => {
    dispatch(setSelectedRankingType(rankingType))
  }

  const handleComparePlayer = async (player: any) => {
    if (playerStats) {
      dispatch(setComparisonPlayer(player))
      try {
        const comparison = await dispatch(getPlayerComparison(playerStats.player_id, player.player_id, selectedTimeframe))
        setComparisonData(comparison)
      } catch (error) {
        console.error('Failed to load comparison data:', error)
      }
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getRankChangeIcon = (change: string) => {
    switch (change) {
      case 'up': return '📈'
      case 'down': return '📉'
      case 'same': return '➖'
      case 'new': return '⭐'
      default: return '➖'
    }
  }

  const getRankChangeColor = (change: string) => {
    switch (change) {
      case 'up': return 'text-green-600'
      case 'down': return 'text-red-600'
      case 'same': return 'text-gray-500'
      case 'new': return 'text-blue-600'
      default: return 'text-gray-500'
    }
  }

  const getPerformanceColor = (rating: number) => {
    if (rating >= 90) return 'bg-green-500'
    if (rating >= 80) return 'bg-green-400'
    if (rating >= 70) return 'bg-yellow-500'
    if (rating >= 60) return 'bg-orange-500'
    return 'bg-red-500'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Player Rankings & Stats</h1>
              <p className="text-gray-600">Track your performance and compare with other players</p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedTimeframe}
                onChange={(e) => handleTimeframeChange(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
              >
                <option value="30d">Last 30 Days</option>
                <option value="3m">Last 3 Months</option>
                <option value="6m">Last 6 Months</option>
                <option value="1y">Last Year</option>
                <option value="all">All Time</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'matches', label: 'Recent Matches' },
              { id: 'tournaments', label: 'Tournaments' },
              { id: 'leaderboards', label: 'Leaderboards' },
              { id: 'compare', label: 'Compare Players' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Overview Cards */}
            {playerStats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="text-2xl text-green-600 mr-3">🏆</div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Win Rate</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {playerStats.win_percentage.toFixed(1)}%
                      </p>
                      <p className="text-sm text-gray-500">
                        {playerStats.wins}W - {playerStats.losses}L
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="text-2xl text-blue-600 mr-3">📊</div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Current Streak</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {Math.abs(playerStats.current_streak)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {playerStats.current_streak >= 0 ? 'Wins' : 'Losses'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="text-2xl text-purple-600 mr-3">🎾</div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Tournaments</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {playerStats.tournament_wins}
                      </p>
                      <p className="text-sm text-gray-500">
                        of {playerStats.total_tournaments} won
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="text-2xl text-orange-600 mr-3">🔥</div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Avg Points/Match</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {playerStats.average_points_per_match.toFixed(1)}
                      </p>
                      <p className="text-sm text-gray-500">
                        +{playerStats.point_differential}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Rankings Cards */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Current Rankings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {playerRankings.map(ranking => (
                  <div key={`${ranking.ranking_type}-${ranking.category}`} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 capitalize">
                          {ranking.ranking_type.replace('_', ' ')} Ranking
                        </h4>
                        <p className="text-sm text-gray-600">{ranking.region}</p>
                      </div>
                      <div className={`flex items-center ${getRankChangeColor(ranking.rank_change)}`}>
                        <span className="mr-1">{getRankChangeIcon(ranking.rank_change)}</span>
                        {ranking.rank_change_amount > 0 && (
                          <span className="text-sm font-medium">
                            {ranking.rank_change_amount}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Position:</span>
                        <span className="text-sm font-bold text-gray-900">
                          #{ranking.ranking_position}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Points:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {ranking.points}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Matches:</span>
                        <span className="text-sm text-gray-900">
                          {ranking.matches_played_period}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-xs text-gray-500">Last 30 days</p>
                      <div className="flex justify-between text-xs text-gray-600 mt-1">
                        <span>{ranking.recent_performance.last_30_days.wins}W</span>
                        <span>{ranking.recent_performance.last_30_days.tournaments}T</span>
                        <span>+{ranking.recent_performance.last_30_days.points_earned}pts</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Metrics */}
            {performanceMetrics && (
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
                      {Object.entries(performanceMetrics.skill_breakdown).map(([skill, rating]) => (
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
            )}
          </div>
        )}

        {activeTab === 'matches' && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-6">Recent Matches</h3>
            
            {recentMatches.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <div className="text-4xl mb-4">🎾</div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">No Match History</h4>
                <p className="text-gray-500">Your recent matches will appear here</p>
              </div>
            ) : (
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
            )}
          </div>
        )}

        {activeTab === 'tournaments' && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-6">Tournament History</h3>
            
            {tournamentHistory.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <div className="text-4xl mb-4">🏆</div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">No Tournament History</h4>
                <p className="text-gray-500">Your tournament results will appear here</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tournamentHistory.map(tournament => (
                  <div key={tournament.tournament_id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">
                          {tournament.tournament_name}
                        </h4>
                        <p className="text-sm text-gray-600">{tournament.tournament_level}</p>
                        <p className="text-sm text-gray-500">{formatDate(tournament.tournament_date)}</p>
                      </div>
                      <div className={`px-3 py-1 text-sm font-medium rounded-full ${
                        tournament.final_position === 'Winner' 
                          ? 'bg-yellow-100 text-yellow-800'
                          : tournament.final_position === 'Runner-up'
                          ? 'bg-gray-100 text-gray-800'
                          : tournament.final_position.includes('Semifinalist')
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {tournament.final_position}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{tournament.matches_won}</p>
                        <p className="text-sm text-gray-500">Wins</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-red-600">{tournament.matches_lost}</p>
                        <p className="text-sm text-gray-500">Losses</p>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-100 pt-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Points Earned:</span>
                        <span className="font-medium text-gray-900">+{tournament.points_earned}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Tournament Size:</span>
                        <span className="text-gray-900">{tournament.tournament_size} players</span>
                      </div>
                      {tournament.prize_money && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Prize Money:</span>
                          <span className="text-green-600 font-medium">${tournament.prize_money}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'leaderboards' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">Leaderboards</h3>
              <select
                value={selectedRankingType}
                onChange={(e) => handleRankingTypeChange(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
              >
                <option value="overall">Overall</option>
                <option value="state">State</option>
                <option value="club">Club</option>
                <option value="age_group">Age Group</option>
              </select>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h4 className="text-md font-medium text-gray-900 capitalize">
                  {selectedRankingType.replace('_', ' ')} Rankings
                </h4>
              </div>
              
              <div className="divide-y divide-gray-200">
                {leaderboards[selectedRankingType].map((player, index) => (
                  <div key={player.player_id} className="px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        index < 3 
                          ? index === 0 ? 'bg-yellow-100 text-yellow-800' 
                            : index === 1 ? 'bg-gray-100 text-gray-800'
                            : 'bg-orange-100 text-orange-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {index + 1}
                      </div>
                      
                      <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {player.player.full_name.charAt(0)}
                        </span>
                      </div>
                      
                      <div>
                        <p className="font-medium text-gray-900">{player.player.full_name}</p>
                        <p className="text-sm text-gray-500">{player.player.skill_level}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{player.points} pts</p>
                        <p className="text-xs text-gray-500">{player.matches_played_period} matches</p>
                      </div>
                      
                      <div className={`flex items-center ${getRankChangeColor(player.rank_change)}`}>
                        <span className="text-lg">{getRankChangeIcon(player.rank_change)}</span>
                        {player.rank_change_amount > 0 && (
                          <span className="text-sm font-medium ml-1">
                            {player.rank_change_amount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'compare' && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-6">Compare Players</h3>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="mb-4">
                <input
                  type="text"
                  value={comparisonSearch}
                  onChange={(e) => setComparisonSearch(e.target.value)}
                  placeholder="Search for a player to compare with..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              {comparisonResults.length > 0 && (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {comparisonResults.map(player => (
                    <div
                      key={player.player_id}
                      onClick={() => handleComparePlayer(player)}
                      className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-md cursor-pointer"
                    >
                      <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {player.player.full_name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{player.player.full_name}</p>
                        <p className="text-sm text-gray-500">
                          Rank #{player.ranking_position} • {player.player.skill_level}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{player.points} pts</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {comparisonPlayer && comparisonData && playerStats && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h4 className="text-lg font-medium text-gray-900 mb-6">
                  Comparison Results
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h5 className="font-medium text-gray-900 mb-4">You</h5>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Total Matches:</span>
                        <span className="text-sm font-medium">{comparisonData.player1.stats.total_matches}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Win Rate:</span>
                        <span className="text-sm font-medium">{comparisonData.player1.stats.win_percentage.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Tournament Wins:</span>
                        <span className="text-sm font-medium">{comparisonData.player1.stats.tournament_wins}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Ranking:</span>
                        <span className="text-sm font-medium">#{comparisonData.player1.stats.ranking_position}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Points:</span>
                        <span className="text-sm font-medium">{comparisonData.player1.stats.points}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-900 mb-4">{comparisonPlayer.player.full_name}</h5>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Total Matches:</span>
                        <span className="text-sm font-medium">{comparisonData.player2.stats.total_matches}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Win Rate:</span>
                        <span className="text-sm font-medium">{comparisonData.player2.stats.win_percentage.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Tournament Wins:</span>
                        <span className="text-sm font-medium">{comparisonData.player2.stats.tournament_wins}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Ranking:</span>
                        <span className="text-sm font-medium">#{comparisonData.player2.stats.ranking_position}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Points:</span>
                        <span className="text-sm font-medium">{comparisonData.player2.stats.points}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {comparisonData.head_to_head && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h5 className="font-medium text-gray-900 mb-4">Head to Head</h5>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 mb-2">
                        {comparisonData.head_to_head.player1_wins} - {comparisonData.head_to_head.player2_wins}
                      </div>
                      <p className="text-sm text-gray-500">
                        Total matches: {comparisonData.head_to_head.total_matches}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Last match: {formatDate(comparisonData.head_to_head.last_match_date)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default PlayerRankings