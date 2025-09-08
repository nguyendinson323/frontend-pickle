import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Layout } from '../../components/layout'
import { RootState } from '../../store'
import { PlayerDashboard } from '../../types'
import {
  PlayerDashboardHeader,
  PlayerStatsGrid,
  PlayerQuickActions,
  PlayerUpcomingMatches,
  PlayerRecentMatches,
  PlayerAchievements,
  PlayerCredentialPreview
} from '../../components/player/PlayerDashboard'

const PlayerDashboardPage: React.FC = () => {
  const navigate = useNavigate()
  const { user, dashboard } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    console.log('🏁 PlayerDashboard - User:', user)
    console.log('🏁 PlayerDashboard - Dashboard:', dashboard)
    
    if (!user || user.role !== 'player') {
      console.log('❌ Player auth check failed - redirecting to login')
      navigate('/login')
    }
  }, [user, navigate])

  if (!user || user.role !== 'player' || !dashboard) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
        </div>
      </Layout>
    )
  }

  const playerData = dashboard as PlayerDashboard
  const profile = playerData.profile
  const upcomingMatches = playerData.upcomingMatches || []
  const recentMatches = playerData.recentMatches || []

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <PlayerDashboardHeader profile={{
            fullName: profile.full_name,
            nrtpLevel: profile.nrtp_level?.toString() || '1.0',
            profilePhotoUrl: profile.profile_photo_url || undefined,
            state: profile.state?.name || 'Unknown'
          }} />

          <PlayerStatsGrid playerData={{ 
            tournamentWins: playerData.tournamentWins,
            totalMatches: playerData.totalMatches,
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
    </Layout>
  )
}

export default PlayerDashboardPage