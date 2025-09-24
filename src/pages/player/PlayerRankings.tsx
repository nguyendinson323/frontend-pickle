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
  setComparisonPlayer,
  PlayerRanking
} from '../../store/slices/playerRankingsSlice'
import { AppDispatch } from '../../store'
import {
  RankingsHeader,
  RankingsTabs,
  StatsOverviewCards,
  RankingsCards,
  PerformanceMetrics,
  RecentMatchesList,
  TournamentHistory,
  LeaderboardView,
  PlayerComparison
} from '../../components/player/rankings'

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
          const resultAction = await dispatch(searchPlayersForComparison(comparisonSearch))
          if (typeof resultAction === 'object' && resultAction !== null) {
            setComparisonResults(resultAction as PlayerRanking[])
          } else {
            setComparisonResults([])
          }
        } catch (error) {
          console.error('Search error:', error)
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

  const handleComparePlayer = async (player: PlayerRanking) => {
    if (playerStats) {
      dispatch(setComparisonPlayer(player))
      try {
        const comparisonResult = await dispatch(getPlayerComparison(playerStats.player_id, player.player_id, selectedTimeframe))
        if (typeof comparisonResult === 'object' && comparisonResult !== null) {
          setComparisonData(comparisonResult)
        }
      } catch (error) {
        console.error('Failed to load comparison data:', error)
        setComparisonData(null)
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
      <RankingsHeader
        selectedTimeframe={selectedTimeframe}
        onTimeframeChange={handleTimeframeChange}
      />

      <RankingsTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <StatsOverviewCards playerStats={playerStats} />
            
            <RankingsCards 
              playerRankings={playerRankings}
              getRankChangeIcon={getRankChangeIcon}
              getRankChangeColor={getRankChangeColor}
            />
            
            <PerformanceMetrics 
              performanceMetrics={performanceMetrics}
              getPerformanceColor={getPerformanceColor}
            />
          </div>
        )}

        {activeTab === 'matches' && (
          <RecentMatchesList 
            recentMatches={recentMatches}
            formatDate={formatDate}
          />
        )}

        {activeTab === 'tournaments' && (
          <TournamentHistory 
            tournamentHistory={tournamentHistory}
            formatDate={formatDate}
          />
        )}

        {activeTab === 'leaderboards' && (
          <LeaderboardView 
            selectedRankingType={selectedRankingType}
            onRankingTypeChange={handleRankingTypeChange}
            leaderboards={leaderboards}
            getRankChangeIcon={getRankChangeIcon}
            getRankChangeColor={getRankChangeColor}
          />
        )}

        {activeTab === 'compare' && (
          <PlayerComparison 
            comparisonResults={comparisonResults}
            comparisonPlayer={comparisonPlayer}
            comparisonData={comparisonData}
            playerStats={playerStats}
            onComparePlayer={handleComparePlayer}
            formatDate={formatDate}
            comparisonSearch={comparisonSearch}
            setComparisonSearch={setComparisonSearch}
          />
        )}
      </div>
    </div>
  )
}

export default PlayerRankings