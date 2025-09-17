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
import {
  FiBarChart2,
  FiFileText,
  FiClock,
  FiArrowLeft,
  FiAlertCircle,
  FiLoader,
  FiUsers,
  FiAward,
  FiActivity,
  FiDollarSign,
  FiTrendingUp,
  FiGlobe
} from 'react-icons/fi'

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FiLoader className="animate-spin h-16 w-16 text-indigo-600 mx-auto mb-4" />
          <p className="text-xl font-semibold text-gray-700">Loading reports...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait while we verify your access</p>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'generate', label: 'Generate Reports', icon: FiBarChart2 },
    { id: 'reports', label: 'Report History', icon: FiFileText },
    { id: 'scheduled', label: 'Scheduled Reports', icon: FiClock }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="bg-white shadow-lg rounded-2xl border border-gray-100 p-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                  <FiBarChart2 className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">Reports & Analytics</h1>
                  <p className="mt-2 text-lg text-gray-600 font-medium">
                    Generate comprehensive reports and manage automated data exports
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-200 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <FiArrowLeft className="mr-2 h-5 w-5" />
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-8 bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 rounded-2xl p-6 shadow-lg">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                <FiAlertCircle className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-red-800 mb-2">Error</h3>
                <div className="text-lg text-red-700 font-medium">
                  {error}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Report Statistics */}
        <ReportStats />

        {/* Navigation Tabs */}
        <div className="bg-white shadow-lg rounded-2xl border border-gray-100 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white mr-3">
                <FiFileText className="h-4 w-4" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Report Management</h3>
            </div>
          </div>
          <div className="p-2">
            <nav className="flex space-x-2" aria-label="Tabs">
              {tabs.map((tab) => {
                const TabIcon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as 'generate' | 'reports' | 'scheduled')}
                    className={`flex-1 flex items-center justify-center px-6 py-4 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <TabIcon className="mr-3 h-5 w-5" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'generate' && (
            <>
              <ReportGenerator />
              <div className="bg-gradient-to-r from-blue-50 to-indigo-100 border-2 border-blue-200 rounded-2xl p-8 shadow-lg">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white mr-4">
                    <FiBarChart2 className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-blue-900">Available Report Types</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white rounded-2xl p-6 border-2 border-blue-200 shadow-lg transform hover:scale-105 transition-all duration-200">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white mr-3">
                        <FiUsers className="h-6 w-6" />
                      </div>
                      <h4 className="text-xl font-bold text-gray-900">User Activity</h4>
                    </div>
                    <p className="text-gray-600 font-medium leading-relaxed">Comprehensive user data with activity metrics and engagement statistics</p>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border-2 border-blue-200 shadow-lg transform hover:scale-105 transition-all duration-200">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white mr-3">
                        <FiAward className="h-6 w-6" />
                      </div>
                      <h4 className="text-xl font-bold text-gray-900">Tournament Analytics</h4>
                    </div>
                    <p className="text-gray-600 font-medium leading-relaxed">Tournament performance data including participation and revenue metrics</p>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border-2 border-blue-200 shadow-lg transform hover:scale-105 transition-all duration-200">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white mr-3">
                        <FiActivity className="h-6 w-6" />
                      </div>
                      <h4 className="text-xl font-bold text-gray-900">Courts Utilization</h4>
                    </div>
                    <p className="text-gray-600 font-medium leading-relaxed">Court usage statistics and revenue analysis across all facilities</p>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border-2 border-blue-200 shadow-lg transform hover:scale-105 transition-all duration-200">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center text-white mr-3">
                        <FiDollarSign className="h-6 w-6" />
                      </div>
                      <h4 className="text-xl font-bold text-gray-900">Financial Summary</h4>
                    </div>
                    <p className="text-gray-600 font-medium leading-relaxed">Complete financial overview including payments, subscriptions, and revenue trends</p>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border-2 border-blue-200 shadow-lg transform hover:scale-105 transition-all duration-200">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center text-white mr-3">
                        <FiTrendingUp className="h-6 w-6" />
                      </div>
                      <h4 className="text-xl font-bold text-gray-900">Player Rankings</h4>
                    </div>
                    <p className="text-gray-600 font-medium leading-relaxed">Player ranking data with progression tracking and tournament performance</p>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border-2 border-blue-200 shadow-lg transform hover:scale-105 transition-all duration-200">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center text-white mr-3">
                        <FiGlobe className="h-6 w-6" />
                      </div>
                      <h4 className="text-xl font-bold text-gray-900">Microsites Performance</h4>
                    </div>
                    <p className="text-gray-600 font-medium leading-relaxed">Microsite analytics including traffic data and content performance metrics</p>
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