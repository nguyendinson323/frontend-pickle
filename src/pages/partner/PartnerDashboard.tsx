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
import {
  FiLoader,
  FiAlertCircle,
  FiRefreshCw,
  FiHome,
  FiChevronRight
} from 'react-icons/fi'

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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white rounded-3xl shadow-2xl p-12">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-gray-300 border-t-orange-600 mx-auto mb-6">
              <FiLoader className="h-8 w-8 text-transparent" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Loading Dashboard</h3>
            <p className="text-gray-600 font-medium text-lg">Please wait while we load your partner data...</p>
          </div>
        </div>
      </div>
    )
  }

  const profile = dashboardData.profile
  const recentBookings = dashboardData.recentBookings || []
  const upcomingEvents = dashboardData.upcomingEvents || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <button
                  onClick={() => navigate('/')}
                  className="text-gray-500 hover:text-gray-700 font-medium transition-colors duration-200 flex items-center"
                >
                  <FiHome className="w-4 h-4 mr-1" />
                  Home
                </button>
              </li>
              <li>
                <div className="flex items-center">
                  <FiChevronRight className="flex-shrink-0 h-5 w-5 text-gray-400 mx-2" />
                  <span className="text-sm font-bold text-orange-600" aria-current="page">
                    Partner Dashboard
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 bg-gradient-to-br from-red-50 to-pink-50 border border-red-200 shadow-2xl rounded-3xl p-8">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-pink-700 rounded-2xl flex items-center justify-center mr-4">
                <FiAlertCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Dashboard Error</h3>
                <p className="text-red-800 font-medium">{error}</p>
                <button
                  onClick={() => dispatch(fetchPartnerDashboard())}
                  className="mt-3 bg-gradient-to-r from-red-600 to-pink-700 hover:from-red-700 hover:to-pink-800 text-white font-bold py-2 px-4 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl hover:transform hover:scale-105 flex items-center"
                >
                  <FiRefreshCw className="w-4 h-4 mr-2" />
                  Retry
                </button>
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