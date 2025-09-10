import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState, AppDispatch } from '../../store'
import { PlayerDashboard } from '../../types'
import { fetchDashboard } from '../../store/slices/authSlice'
import { startLoading, stopLoading } from '../../store/slices/loadingSlice'
import {
  PlayerDashboardHeader,
  PlayerStatsGrid,
  PlayerQuickActions,
  PlayerUpcomingMatches,
  PlayerRecentMatches,
  PlayerAchievements,
  PlayerCredentialPreview
} from '../../components/player/dashboard'

const PlayerDashboardPage: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { user, dashboard } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    console.log('🏁 PlayerDashboard - User:', user)
    
    if (!user || user.role !== 'player') {
      console.log('❌ Player auth check failed - redirecting to login')
      navigate('/login')
      return
    }

    // Fetch dashboard data when component mounts
    const loadDashboard = async () => {
      try {
        await dispatch(fetchDashboard('player'))
        console.log('✅ Dashboard data loaded successfully')
      } catch (error) {
        console.error('❌ Failed to load dashboard:', error)
        // Could show error message to user here
      }
    }

    // Only fetch if dashboard data is not already present
    if (!dashboard) {
      loadDashboard()
    }
  }, [user, navigate, dispatch, dashboard])

  if (!user || user.role !== 'player' || !dashboard) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  const playerData = dashboard as PlayerDashboard
  const profile = playerData.profile
  
  // Map backend data to component expected format
  const upcomingMatches = (playerData.upcomingMatches || []).map(match => ({
    tournamentName: match.name,
    opponent: 'TBD', // Will be determined when matches are drawn
    date: new Date(match.date).toLocaleDateString(),
    time: 'TBD', // Time will be set closer to tournament
    status: match.status
  }))
  
  const recentMatches = (playerData.recentMatches || []).map(match => ({
    tournamentName: match.tournament || 'Tournament',
    opponent: match.opponent || 'Unknown',
    date: match.date ? new Date(match.date).toLocaleDateString() : '',
    result: match.result || 'N/A',
    score: match.score || 'N/A'
  }))

  return (
    <div className="min-h-screen  py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <PlayerDashboardHeader profile={{
            fullName: profile.full_name,
            nrtpLevel: profile.nrtp_level?.toString() || '1.0',
            profilePhotoUrl: profile.profile_photo_url || undefined,
            state: profile.state?.name || 'Unknown'
          }} />

          <PlayerStatsGrid playerData={{ 
            tournamentWins: playerData.tournamentWins || 0,
            totalMatches: playerData.totalMatches || 0,
            currentRanking: playerData.currentRanking?.current_rank || 0
          }} profile={{
            nrtpLevel: profile.nrtp_level?.toString() || '1.0'
          }} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <PlayerQuickActions />
            <PlayerUpcomingMatches upcomingMatches={upcomingMatches} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <PlayerRecentMatches recentMatches={recentMatches} />
            <PlayerAchievements playerData={{ 
              tournamentWins: playerData.tournamentWins,
              totalMatches: playerData.totalMatches,
              currentRanking: playerData.currentRanking?.current_rank || 0
            }} />
          </div>

          <PlayerCredentialPreview profile={{
            fullName: profile.full_name,
            nrtpLevel: profile.nrtp_level?.toString() || '1.0',
            profilePhotoUrl: profile.profile_photo_url || undefined
          }} playerData={{ 
            currentRanking: playerData.currentRanking?.current_rank || 0
          }} user={user} />
        </div>
    </div>
  )
}

export default PlayerDashboardPage