import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState } from '../../store'
import { CoachDashboard } from '../../types'
import {
  CoachDashboardHeader,
  CoachStatsGrid,
  CoachQuickActions,
  CoachUpcomingSessions,
  CoachRecentSessions,
  CoachStudentProgress,
  CoachCertifications
} from '../../components/coach/dashboard'

const CoachDashboardPage: React.FC = () => {
  const navigate = useNavigate()
  const { user, dashboard } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    if (!user || user.role !== 'coach') {
      navigate('/login')
    }
  }, [user, navigate])

  if (!user || user.role !== 'coach' || !dashboard) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  const coachData = dashboard as CoachDashboard
  
  // Mock data for recent sessions
  const recentSessions = [
    {
      id: 1,
      studentName: 'Ana García',
      sessionType: 'Private Lesson',
      date: '3 days ago',
      rating: 4.9
    },
    {
      id: 2,
      studentName: 'Carlos López',
      sessionType: 'Group Session',
      date: '1 week ago',
      rating: 4.7
    }
  ]

  return (
    <div className="min-h-screen  py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <CoachDashboardHeader profile={coachData.profile} />

        <CoachStatsGrid stats={coachData.stats} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <CoachQuickActions />
          <CoachUpcomingSessions sessions={coachData.upcomingSessions} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <CoachRecentSessions sessions={recentSessions} />
          <CoachStudentProgress />
        </div>

        <CoachCertifications certifications={coachData.certifications} />
      </div>
    </div>
  )
}

export default CoachDashboardPage