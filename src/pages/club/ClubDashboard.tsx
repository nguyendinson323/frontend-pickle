import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState } from '../../store'
import { ClubDashboard } from '../../types'
import {
  ClubDashboardHeader,
  ClubStatsGrid,
  ClubQuickActions,
  ClubRecentMembers,
  ClubUpcomingTournaments,
  ClubCourtActivity,
  ClubPerformanceSection
} from '../../components/club/dashboard'

const ClubDashboardPage: React.FC = () => {
  const navigate = useNavigate()
  const { user, dashboard } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    if (!user || user.role !== 'club') {
      navigate('/login')
    }
  }, [user, navigate])

  if (!user || user.role !== 'club' || !dashboard) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  const clubData = dashboard as ClubDashboard
  
  // Mock data for members (this would normally come from API)
  const recentMembers = [
    {
      id: 1,
      name: 'María González',
      profilePhoto: '',
      nrtpLevel: 3.5,
      joinedDate: '2 days ago'
    },
    {
      id: 2,
      name: 'Carlos Rodríguez',
      profilePhoto: '',
      nrtpLevel: 4.0,
      joinedDate: '5 days ago'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <ClubDashboardHeader profile={clubData.profile} />

        <ClubStatsGrid stats={clubData.stats} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ClubQuickActions />
          <ClubRecentMembers members={recentMembers} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ClubUpcomingTournaments tournaments={clubData.upcomingTournaments} />
          <ClubCourtActivity todaysBookings={8} weeklyUsage={75} />
        </div>

        <ClubPerformanceSection 
          memberGrowth={15} 
          monthlyRevenue={12500} 
          memberSatisfaction={4.2} 
        />
      </div>
    </div>
  )
}

export default ClubDashboardPage