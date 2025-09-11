import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState, AppDispatch } from '../../store'
import { fetchReports } from '../../store/slices/adminReportsSlice'
import {
  ReportsTable,
  ReportStats,
  ReportGenerator,
  ScheduledReportsTable
} from '../../components/admin/reports'

const AdminReports: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { user } = useSelector((state: RootState) => state.auth)
  const { error } = useSelector((state: RootState) => state.adminReports)
  
  const [activeTab, setActiveTab] = useState<'generate' | 'reports' | 'scheduled'>('generate')

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login')
      return
    }

    // Fetch initial data
    dispatch(fetchReports())
  }, [dispatch, user, navigate])

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  const tabs = [
    { id: 'generate', label: 'Generate Reports', icon: '📊' },
    { id: 'reports', label: 'Report History', icon: '📋' },
    { id: 'scheduled', label: 'Scheduled Reports', icon: '⏰' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
              <p className="mt-2 text-gray-600">
                Generate comprehensive reports and manage automated data exports
              </p>
            </div>
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  {error}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Report Statistics */}
        <ReportStats />

        {/* Navigation Tabs */}
        <div className="bg-white shadow-sm rounded-lg mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'generate' | 'reports' | 'scheduled')}
                  className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'generate' && (
            <>
              <ReportGenerator />
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Available Report Types</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-2">👥</span>
                      <h4 className="font-medium text-gray-900">User Activity</h4>
                    </div>
                    <p className="text-sm text-gray-600">Comprehensive user data with activity metrics and engagement statistics</p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-2">🏆</span>
                      <h4 className="font-medium text-gray-900">Tournament Analytics</h4>
                    </div>
                    <p className="text-sm text-gray-600">Tournament performance data including participation and revenue metrics</p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-2">🎾</span>
                      <h4 className="font-medium text-gray-900">Courts Utilization</h4>
                    </div>
                    <p className="text-sm text-gray-600">Court usage statistics and revenue analysis across all facilities</p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-2">💰</span>
                      <h4 className="font-medium text-gray-900">Financial Summary</h4>
                    </div>
                    <p className="text-sm text-gray-600">Complete financial overview including payments, subscriptions, and revenue trends</p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-2">🏅</span>
                      <h4 className="font-medium text-gray-900">Player Rankings</h4>
                    </div>
                    <p className="text-sm text-gray-600">Player ranking data with progression tracking and tournament performance</p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-2">🌐</span>
                      <h4 className="font-medium text-gray-900">Microsites Performance</h4>
                    </div>
                    <p className="text-sm text-gray-600">Microsite analytics including traffic data and content performance metrics</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'reports' && (
            <ReportsTable />
          )}

          {activeTab === 'scheduled' && (
            <ScheduledReportsTable />
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminReports