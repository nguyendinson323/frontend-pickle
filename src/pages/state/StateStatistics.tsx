import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../store'
import {
  fetchStateStatisticsData,
  exportStatisticsReport,
  setDateRange
} from '../../store/slices/stateStatisticsSlice'

import StatisticsHeader from '../../components/state/statistics/StatisticsHeader'
import StatisticsCard, { MetricDisplay, ProgressBar, ListItem } from '../../components/state/statistics/StatisticsCard'
import { FiBarChart2, FiUsers, FiMap, FiHome, FiHeart, FiDollarSign, FiTrendingUp, FiArrowUp, FiArrowDown, FiRefreshCw, FiAlertCircle, FiAward } from 'react-icons/fi'

const StateStatistics: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  
  const {
    tournamentAnalytics,
    playerAnalytics,
    courtAnalytics,
    clubAnalytics,
    partnerAnalytics,
    financialAnalytics,
    comparativeAnalytics,
    dateRange,
    loading,
    error
  } = useSelector((state: RootState) => state.stateStatistics)
  
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    if (user?.role !== 'state') {
      navigate('/dashboard')
      return
    }

    if (!tournamentAnalytics) {
      fetchData()
    }
  }, [isAuthenticated, user, navigate, tournamentAnalytics])

  const fetchData = async () => {
    try {
      await dispatch(fetchStateStatisticsData())
    } catch (error) {
      console.error('Error fetching state statistics:', error)
    }
  }

  const handleDateRangeChange = async (newDateRange: { start_date: string, end_date: string }) => {
    try {
      dispatch(setDateRange(newDateRange))
      await dispatch(fetchStateStatisticsData(newDateRange))
    } catch (error) {
      console.error('Error fetching statistics with new date range:', error)
    }
  }

  const handleExport = async (format: 'pdf' | 'excel') => {
    try {
      await dispatch(exportStatisticsReport(dateRange, format))
    } catch (error) {
      console.error('Error exporting statistics:', error)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  // Key metrics for header
  const keyMetrics = tournamentAnalytics && playerAnalytics && clubAnalytics && financialAnalytics ? {
    totalPlayers: playerAnalytics.total_players,
    totalTournaments: tournamentAnalytics.total_tournaments,
    totalRevenue: financialAnalytics.revenue_summary.total_revenue,
    totalClubs: clubAnalytics.total_clubs
  } : undefined

  if (loading && !tournamentAnalytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-purple-50/30 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 shadow-lg"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-400/20 to-purple-400/20 animate-pulse"></div>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-gray-900 mb-1">Loading Analytics</p>
            <p className="text-sm text-gray-600">Please wait while we fetch your statistics...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-purple-50/30 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <StatisticsHeader
          dateRange={dateRange}
          onDateRangeChange={handleDateRangeChange}
          onExport={handleExport}
          loading={loading}
          keyMetrics={keyMetrics}
        />

        {error && (
          <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200/50 rounded-3xl shadow-xl p-8 backdrop-blur-sm mb-8">
            <div className="flex items-center space-x-4">
              <div className="bg-red-500 p-3 rounded-2xl shadow-lg">
                <FiAlertCircle className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-red-800 mb-2">Error Loading Analytics</h3>
                <p className="text-red-700">{error}</p>
                <button
                  onClick={() => fetchData()}
                  className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 flex items-center space-x-2 shadow-lg"
                >
                  <FiRefreshCw className="w-4 h-4" />
                  <span>Retry</span>
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Tournament Analytics */}
          <div className="bg-gradient-to-br from-white to-blue-50/30 rounded-3xl shadow-xl border border-gray-200/50 p-8 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center space-x-3 mb-8">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-2xl shadow-lg">
                <FiBarChart2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Tournament Performance</h2>
                <p className="text-sm text-gray-600 mt-1">Tournament participation and revenue metrics</p>
              </div>
            </div>
            {loading && (
              <div className="animate-pulse">
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-gray-200 h-20 rounded-2xl"></div>
                  <div className="bg-gray-200 h-20 rounded-2xl"></div>
                </div>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-32 bg-gray-200 rounded-2xl"></div>
                </div>
              </div>
            )}
            {tournamentAnalytics && !loading && (
              <div className="space-y-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-lg border border-blue-200/50">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {tournamentAnalytics.total_tournaments.toLocaleString()}
                    </div>
                    <div className="text-sm font-medium text-gray-700">Total Tournaments</div>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-lg border border-green-200/50">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {tournamentAnalytics.participation_metrics.completion_rate.toFixed(1)}%
                    </div>
                    <div className="text-sm font-medium text-gray-700">Completion Rate</div>
                  </div>
                </div>

                <div className="bg-white/60 rounded-2xl p-6 backdrop-blur-sm">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center space-x-2">
                    <FiTrendingUp className="w-4 h-4 text-blue-600" />
                    <span>Status Distribution</span>
                  </h4>
                  <div className="space-y-4">
                    <div className="mb-4">
                      <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                        <span>Completed</span>
                        <span>{tournamentAnalytics.tournaments_by_status.completed.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-200/50 rounded-full h-3 shadow-inner">
                        <div
                          className="bg-green-500 h-3 rounded-full transition-all duration-500 shadow-sm"
                          style={{ width: `${(tournamentAnalytics.tournaments_by_status.completed / tournamentAnalytics.total_tournaments) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                        <span>Upcoming</span>
                        <span>{tournamentAnalytics.tournaments_by_status.upcoming.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-200/50 rounded-full h-3 shadow-inner">
                        <div
                          className="bg-blue-500 h-3 rounded-full transition-all duration-500 shadow-sm"
                          style={{ width: `${(tournamentAnalytics.tournaments_by_status.upcoming / tournamentAnalytics.total_tournaments) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                        <span>Ongoing</span>
                        <span>{tournamentAnalytics.tournaments_by_status.ongoing.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-200/50 rounded-full h-3 shadow-inner">
                        <div
                          className="bg-yellow-500 h-3 rounded-full transition-all duration-500 shadow-sm"
                          style={{ width: `${(tournamentAnalytics.tournaments_by_status.ongoing / tournamentAnalytics.total_tournaments) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/60 rounded-2xl p-6 backdrop-blur-sm">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center space-x-2">
                    <FiDollarSign className="w-4 h-4 text-green-600" />
                    <span>Revenue Metrics</span>
                  </h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-gray-200/50 last:border-b-0">
                      <div className="font-medium text-gray-900">Total Revenue</div>
                      <div className="text-lg font-bold text-green-600">
                        {formatCurrency(tournamentAnalytics.revenue_metrics.total_revenue)}
                      </div>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-200/50 last:border-b-0">
                      <div className="font-medium text-gray-900">Average Entry Fee</div>
                      <div className="text-lg font-bold text-blue-600">
                        {formatCurrency(tournamentAnalytics.revenue_metrics.average_entry_fee)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Player Analytics */}
          <div className="bg-gradient-to-br from-white to-purple-50/30 rounded-3xl shadow-xl border border-gray-200/50 p-8 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center space-x-3 mb-8">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-2xl shadow-lg">
                <FiUsers className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Player Growth</h2>
                <p className="text-sm text-gray-600 mt-1">Player registration and demographics</p>
              </div>
            </div>
            {loading && (
              <div className="animate-pulse">
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-gray-200 h-20 rounded-2xl"></div>
                  <div className="bg-gray-200 h-20 rounded-2xl"></div>
                </div>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-32 bg-gray-200 rounded-2xl"></div>
                </div>
              </div>
            )}
            {playerAnalytics && !loading && (
              <div className="space-y-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl shadow-lg border border-purple-200/50">
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      {playerAnalytics.total_players.toLocaleString()}
                    </div>
                    <div className="text-sm font-medium text-gray-700">Total Players</div>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-lg border border-green-200/50">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {playerAnalytics.growth_metrics.growth_rate.toFixed(1)}%
                    </div>
                    <div className="text-sm font-medium text-gray-700 mb-2">Growth Rate</div>
                    <div className={`text-xs flex items-center justify-center space-x-1 ${
                      playerAnalytics.growth_metrics.growth_rate >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {playerAnalytics.growth_metrics.growth_rate >= 0 ? <FiArrowUp className="w-3 h-3" /> : <FiArrowDown className="w-3 h-3" />}
                      <span>{Math.abs(playerAnalytics.growth_metrics.growth_rate)}%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/60 rounded-2xl p-6 backdrop-blur-sm">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center space-x-2">
                    <FiTrendingUp className="w-4 h-4 text-purple-600" />
                    <span>Recent Growth</span>
                  </h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-gray-200/50 last:border-b-0">
                      <div>
                        <div className="font-medium text-gray-900">This Month</div>
                        <div className="text-sm text-gray-500">New registrations</div>
                      </div>
                      <div className="text-lg font-bold text-purple-600">
                        {playerAnalytics.growth_metrics.new_registrations_this_month.toLocaleString()}
                      </div>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-200/50 last:border-b-0">
                      <div>
                        <div className="font-medium text-gray-900">Last Month</div>
                        <div className="text-sm text-gray-500">New registrations</div>
                      </div>
                      <div className="text-lg font-bold text-gray-600">
                        {playerAnalytics.growth_metrics.new_registrations_last_month.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/60 rounded-2xl p-6 backdrop-blur-sm">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center space-x-2">
                    <FiUsers className="w-4 h-4 text-blue-600" />
                    <span>Activity Metrics</span>
                  </h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-gray-200/50 last:border-b-0">
                      <div className="font-medium text-gray-900">Active Players</div>
                      <div className="text-lg font-bold text-blue-600">
                        {playerAnalytics.activity_metrics.active_players.toLocaleString()}
                      </div>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-200/50 last:border-b-0">
                      <div className="font-medium text-gray-900">Tournament Participants</div>
                      <div className="text-lg font-bold text-green-600">
                        {playerAnalytics.activity_metrics.tournament_participants.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Court Analytics */}
          <StatisticsCard
            title="Court Utilization"
            subtitle="Court usage and revenue analysis"
            loading={loading}
          >
            {courtAnalytics && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <MetricDisplay
                    label="Total Courts"
                    value={courtAnalytics.total_courts}
                    colorClass="text-orange-600"
                  />
                  <MetricDisplay
                    label="Utilization Rate"
                    value={`${courtAnalytics.utilization_metrics.average_utilization_rate}%`}
                    colorClass="text-green-600"
                  />
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Revenue Metrics</h4>
                  <div className="space-y-2">
                    <ListItem
                      label="Total Court Revenue"
                      value={formatCurrency(courtAnalytics.revenue_metrics.total_court_revenue)}
                    />
                    <ListItem
                      label="Average per Court"
                      value={formatCurrency(courtAnalytics.revenue_metrics.average_revenue_per_court)}
                    />
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Peak Usage Hours</h4>
                  <div className="space-y-2">
                    {courtAnalytics.utilization_metrics.peak_hours.slice(0, 3).map((hour, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{hour.hour}:00</span>
                        <span className="font-medium">{hour.utilization_rate}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </StatisticsCard>

          {/* Financial Analytics */}
          <StatisticsCard
            title="Financial Performance"
            subtitle="Revenue, expenses, and profitability"
            loading={loading}
          >
            {financialAnalytics && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <MetricDisplay
                    label="Total Revenue"
                    value={formatCurrency(financialAnalytics.revenue_summary.total_revenue)}
                    colorClass="text-green-600"
                  />
                  <MetricDisplay
                    label="Net Profit"
                    value={formatCurrency(financialAnalytics.profitability.net_profit)}
                    colorClass="text-purple-600"
                  />
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Revenue Breakdown</h4>
                  <div className="space-y-2">
                    <ProgressBar
                      label="Tournament Revenue"
                      value={financialAnalytics.revenue_summary.tournament_revenue}
                      max={financialAnalytics.revenue_summary.total_revenue}
                      colorClass="bg-blue-600"
                    />
                    <ProgressBar
                      label="Court Bookings"
                      value={financialAnalytics.revenue_summary.court_booking_revenue}
                      max={financialAnalytics.revenue_summary.total_revenue}
                      colorClass="bg-green-600"
                    />
                    <ProgressBar
                      label="Sponsorships"
                      value={financialAnalytics.revenue_summary.sponsorship_revenue}
                      max={financialAnalytics.revenue_summary.total_revenue}
                      colorClass="bg-purple-600"
                    />
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Profitability</h4>
                  <div className="space-y-2">
                    <ListItem
                      label="Profit Margin"
                      value={`${financialAnalytics.profitability.profit_margin}%`}
                    />
                    <ListItem
                      label="ROI"
                      value={`${financialAnalytics.profitability.roi}%`}
                    />
                  </div>
                </div>
              </div>
            )}
          </StatisticsCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Club Analytics */}
          <StatisticsCard
            title="Club Performance"
            subtitle="Club membership and activity metrics"
            loading={loading}
          >
            {clubAnalytics && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <MetricDisplay
                    label="Total Clubs"
                    value={clubAnalytics.total_clubs}
                    colorClass="text-indigo-600"
                  />
                  <MetricDisplay
                    label="Total Members"
                    value={clubAnalytics.membership_metrics.total_members}
                    colorClass="text-green-600"
                  />
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Membership Growth</h4>
                  <div className="space-y-2">
                    <ListItem
                      label="Growth Rate"
                      value={`${clubAnalytics.membership_metrics.membership_growth_rate}%`}
                    />
                    <ListItem
                      label="Average per Club"
                      value={clubAnalytics.membership_metrics.average_members_per_club}
                    />
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Top Performing Clubs</h4>
                  <div className="space-y-2">
                    {clubAnalytics.activity_metrics.top_performing_clubs.slice(0, 3).map((club, index) => (
                      <ListItem
                        key={index}
                        label={club.club_name}
                        value={`${club.members} members`}
                        subtitle={`${club.total_courts} courts`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </StatisticsCard>

          {/* Partner Analytics */}
          <StatisticsCard
            title="Partnership Performance"
            subtitle="Partner engagement and sponsorship metrics"
            loading={loading}
          >
            {partnerAnalytics && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <MetricDisplay
                    label="Total Partners"
                    value={partnerAnalytics.total_partners}
                    colorClass="text-teal-600"
                  />
                  <MetricDisplay
                    label="Active Partnerships"
                    value={partnerAnalytics.engagement_metrics.active_partnerships}
                    colorClass="text-green-600"
                  />
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Sponsorship Metrics</h4>
                  <div className="space-y-2">
                    <ListItem
                      label="Tournament Sponsorships"
                      value={partnerAnalytics.engagement_metrics.tournament_sponsorships}
                    />
                    <ListItem
                      label="Total Sponsorship Value"
                      value={formatCurrency(partnerAnalytics.engagement_metrics.total_sponsorship_value)}
                    />
                    <ListItem
                      label="Average Sponsorship"
                      value={formatCurrency(partnerAnalytics.engagement_metrics.average_sponsorship_value)}
                    />
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Partnership Types</h4>
                  <div className="space-y-2">
                    {Object.entries(partnerAnalytics.partnership_types).map(([type, count], index) => (
                      <ProgressBar
                        key={index}
                        label={type}
                        value={count}
                        max={partnerAnalytics.total_partners}
                        colorClass="bg-teal-600"
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </StatisticsCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Comparative Analytics */}
          <StatisticsCard
            title="Comparative Analysis"
            subtitle="Year-over-year growth and benchmarking"
            loading={loading}
          >
            {comparativeAnalytics && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Year-over-Year Growth</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <MetricDisplay
                      label="Players"
                      value={`${comparativeAnalytics.year_over_year.players_growth}%`}
                      change={comparativeAnalytics.year_over_year.players_growth}
                      colorClass="text-green-600"
                    />
                    <MetricDisplay
                      label="Revenue"
                      value={`${comparativeAnalytics.year_over_year.revenue_growth}%`}
                      change={comparativeAnalytics.year_over_year.revenue_growth}
                      colorClass="text-purple-600"
                    />
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">National Rankings</h4>
                  <div className="space-y-2">
                    <ListItem
                      label="Players Ranking"
                      value={`#${comparativeAnalytics.benchmarking.state_ranking.players}`}
                      subtitle="Among all states"
                    />
                    <ListItem
                      label="Revenue Ranking"
                      value={`#${comparativeAnalytics.benchmarking.state_ranking.revenue}`}
                      subtitle="Among all states"
                    />
                    <ListItem
                      label="Tournaments Ranking"
                      value={`#${comparativeAnalytics.benchmarking.state_ranking.tournaments}`}
                      subtitle="Among all states"
                    />
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">National Averages</h4>
                  <div className="space-y-2">
                    <ListItem
                      label="Players per State"
                      value={comparativeAnalytics.benchmarking.national_averages.players_per_state.toLocaleString()}
                    />
                    <ListItem
                      label="Revenue per State"
                      value={formatCurrency(comparativeAnalytics.benchmarking.national_averages.revenue_per_state)}
                    />
                  </div>
                </div>
              </div>
            )}
          </StatisticsCard>
        </div>
      </div>
    </div>
  )
}

export default StateStatistics