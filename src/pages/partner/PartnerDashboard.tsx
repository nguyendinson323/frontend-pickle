import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState } from '../../store'
import { PartnerDashboard } from '../../types'
import {
  PartnerDashboardHeader,
  PartnerStatsGrid,
  PartnerQuickActions,
  PartnerRecentBookings,
  PartnerUpcomingEvents,
  PartnerPerformanceMetrics,
  PartnerBusinessOverview
} from '../../components/partner/dashboard'

const PartnerDashboardPage: React.FC = () => {
  const navigate = useNavigate()
  const { user, dashboard } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    if (!user || user.role !== 'partner') {
      navigate('/login')
    }
  }, [user, navigate])

  if (!user || user.role !== 'partner' || !dashboard) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  const partnerData = dashboard as PartnerDashboard
  const profile = partnerData.profile
  const recentBookings = partnerData.recentBookings || []
  const upcomingEvents = partnerData.upcomingEvents || []

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <PartnerDashboardHeader profile={{
          businessName: profile.business_name,
          partnerType: profile.partner_type || 'business',
          contactPersonName: profile.contact_name || 'Contact Person',
          state: profile.state?.name || 'Unknown'
        }} />

        <PartnerStatsGrid partnerData={partnerData} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <PartnerQuickActions />
          <PartnerRecentBookings recentBookings={recentBookings} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <PartnerUpcomingEvents upcomingEvents={upcomingEvents} />
          <PartnerPerformanceMetrics partnerData={partnerData} />
        </div>

        <PartnerBusinessOverview partnerData={partnerData} />
      </div>
    </div>
  )
}

export default PartnerDashboardPage