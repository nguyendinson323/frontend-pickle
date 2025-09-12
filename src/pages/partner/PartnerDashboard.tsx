import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState, AppDispatch } from '../../store'
import { fetchPartnerDashboard } from '../../store/slices/partnerDashboardSlice'
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
  const dispatch = useDispatch<AppDispatch>()
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth)
  const { dashboardData, isLoading, error } = useSelector((state: RootState) => state.partnerDashboard)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    if (user?.role !== 'partner') {
      navigate('/dashboard')
      return
    }

    if (!dashboardData) {
      dispatch(fetchPartnerDashboard())
    }
  }, [dispatch, isAuthenticated, user, navigate, dashboardData])

  if (!isAuthenticated || user?.role !== 'partner') {
    return null
  }

  if (isLoading || !dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  const profile = dashboardData.profile
  const recentBookings = dashboardData.recentBookings || []
  const upcomingEvents = dashboardData.upcomingEvents || []

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        <PartnerDashboardHeader profile={{
          businessName: profile.business_name,
          partnerType: profile.partner_type || 'business',
          contactPersonName: profile.contact_name || 'Contact Person',
          state: profile.state?.name || 'Unknown',
          businessLogoUrl: profile.logo_url
        }} />

        <PartnerStatsGrid partnerData={dashboardData} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <PartnerQuickActions />
          <PartnerRecentBookings recentBookings={recentBookings} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <PartnerUpcomingEvents upcomingEvents={upcomingEvents} />
          <PartnerPerformanceMetrics partnerData={dashboardData} />
        </div>

        <PartnerBusinessOverview partnerData={dashboardData} />
      </div>
    </div>
  )
}

export default PartnerDashboardPage