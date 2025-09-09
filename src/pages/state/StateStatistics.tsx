import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../store'
import {
  fetchStateStatisticsData,
  exportStatisticsReport,
  setDateRange
} from '../../store/slices/stateStatisticsSlice'

import StatisticsHeader from '../../components/state/statistics/StatisticsHeader'
import StatisticsCard, { MetricDisplay, ProgressBar, ListItem } from '../../components/state/statistics/StatisticsCard'

const StateStatistics: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
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
  
  const { user } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    if (user && user.role === 'state') {
      fetchData()
    } else {
      navigate('/dashboard')
    }
  }, [user, navigate])

  const fetchData = async () => {
    try {
      await dispatch(fetchStateStatisticsData() as any)
    } catch (error) {
      console.error('Error fetching state statistics:', error)
    }
  }

  const handleDateRangeChange = async (newDateRange: { start_date: string, end_date: string }) => {
    dispatch(setDateRange(newDateRange))
    await dispatch(fetchStateStatisticsData(newDateRange) as any)
  }

  const handleExport = async (format: 'pdf' | 'excel') => {
    try {
      await dispatch(exportStatisticsReport(dateRange, format) as any)
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
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen  py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <StatisticsHeader
          dateRange={dateRange}
          onDateRangeChange={handleDateRangeChange}
          onExport={handleExport}
          loading={loading}
          keyMetrics={keyMetrics}
        />

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Tournament Analytics */}
          <StatisticsCard
            title="Tournament Performance"
            subtitle="Tournament participation and revenue metrics"
            loading={loading}
          >
            {tournamentAnalytics && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <MetricDisplay
                    label="Total Tournaments"
                    value={tournamentAnalytics.total_tournaments}
                    colorClass="text-blue-600"
                  />
                  <MetricDisplay
                    label="Completion Rate"
                    value={`${tournamentAnalytics.participation_metrics.completion_rate.toFixed(1)}%`}
                    colorClass="text-green-600"
                  />
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Status Distribution</h4>
                  <div className="space-y-2">
                    <ProgressBar
                      label="Completed"
                      value={tournamentAnalytics.tournaments_by_status.completed}
                      max={tournamentAnalytics.total_tournaments}
                      colorClass="bg-green-600"
                    />
                    <ProgressBar
                      label="Upcoming"
                      value={tournamentAnalytics.tournaments_by_status.upcoming}
                      max={tournamentAnalytics.total_tournaments}
                      colorClass="bg-blue-600"
                    />
                    <ProgressBar
                      label="Ongoing"
                      value={tournamentAnalytics.tournaments_by_status.ongoing}
                      max={tournamentAnalytics.total_tournaments}
                      colorClass="bg-yellow-600"
                    />
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Revenue Metrics</h4>
                  <div className="space-y-2">
                    <ListItem
                      label="Total Revenue"
                      value={formatCurrency(tournamentAnalytics.revenue_metrics.total_revenue)}
                    />
                    <ListItem
                      label="Average Entry Fee"
                      value={formatCurrency(tournamentAnalytics.revenue_metrics.average_entry_fee)}
                    />
                  </div>
                </div>
              </div>
            )}
          </StatisticsCard>

          {/* Player Analytics */}
          <StatisticsCard
            title="Player Growth"
            subtitle="Player registration and demographics"
            loading={loading}
          >
            {playerAnalytics && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <MetricDisplay
                    label="Total Players"
                    value={playerAnalytics.total_players}
                    colorClass="text-purple-600"
                  />
                  <MetricDisplay
                    label="Growth Rate"
                    value={`${playerAnalytics.growth_metrics.growth_rate.toFixed(1)}%`}
                    change={playerAnalytics.growth_metrics.growth_rate}
                    colorClass="text-green-600"
                  />
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Recent Growth</h4>
                  <div className="space-y-2">
                    <ListItem
                      label="This Month"
                      value={playerAnalytics.growth_metrics.new_registrations_this_month}
                      subtitle="New registrations"
                    />
                    <ListItem
                      label="Last Month"
                      value={playerAnalytics.growth_metrics.new_registrations_last_month}
                      subtitle="New registrations"
                    />
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Activity Metrics</h4>
                  <div className="space-y-2">
                    <ListItem
                      label="Active Players"
                      value={playerAnalytics.activity_metrics.active_players}
                    />
                    <ListItem
                      label="Tournament Participants"
                      value={playerAnalytics.activity_metrics.tournament_participants}
                    />
                  </div>
                </div>
              </div>
            )}
          </StatisticsCard>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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