import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState, AppDispatch } from '../../store'
import { CourtInfo } from '../../types/admin'
import {
  fetchCourts,
  fetchReservations
} from '../../store/slices/adminCourtsSlice'
import {
  CourtsTable,
  CourtStats,
  CourtFilters,
  ReservationsTable,
  CourtDetail,
  BulkReservationActions
} from '../../components/admin/courts'
import {
  FiMapPin,
  FiCalendar,
  FiArrowLeft,
  FiAlertCircle
} from 'react-icons/fi'

const AdminCourts: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { user } = useSelector((state: RootState) => state.auth)
  const { courtFilter, error } = useSelector((state: RootState) => state.adminCourts)
  
  const [activeTab, setActiveTab] = useState<'courts' | 'reservations'>('courts')
  const [selectedCourtForDetail, setSelectedCourtForDetail] = useState<CourtInfo | null>(null)

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login')
      return
    }

    // Fetch initial data
    dispatch(fetchCourts(courtFilter))
    dispatch(fetchReservations())
  }, [dispatch, user, navigate])

  useEffect(() => {
    // Refresh data when filters change
    if (activeTab === 'courts') {
      dispatch(fetchCourts(courtFilter))
    }
  }, [dispatch, courtFilter, activeTab])

  const handleCourtSelect = (court: CourtInfo) => {
    setSelectedCourtForDetail(court)
  }

  const handleCourtDetailClose = () => {
    setSelectedCourtForDetail(null)
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="text-center">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="mt-6 text-gray-600 font-medium">Verifying admin access...</p>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'courts', label: 'Courts Overview', icon: FiMapPin },
    { id: 'reservations', label: 'Reservations', icon: FiCalendar }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-10">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 via-green-600 to-teal-600 px-8 py-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
                <div className="flex items-center space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      <FiMapPin className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="text-white">
                    <h1 className="text-3xl lg:text-4xl font-bold mb-2">Courts Management</h1>
                    <p className="text-blue-100 text-lg">Monitor all courts, reservations, and performance across the federation</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/admin/dashboard')}
                  className="inline-flex items-center px-6 py-3 border-2 border-white/20 text-white font-medium rounded-xl hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200 backdrop-blur-sm"
                >
                  <FiArrowLeft className="mr-2 h-5 w-5" />
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 rounded-xl p-6 shadow-sm">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <FiAlertCircle className="h-5 w-5 text-red-600" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-base font-semibold text-red-800">System Error</h3>
                <div className="mt-2 text-sm text-red-700 leading-relaxed">
                  {error}
                </div>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-3 text-sm text-red-600 hover:text-red-500 font-medium transition-colors duration-200"
                >
                  Try refreshing the page →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Court Statistics */}
        <CourtStats />

        {/* Navigation Tabs */}
        <div className="bg-white shadow-lg rounded-2xl mb-8 border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Management Sections</h3>
          </div>
          <div className="px-6">
            <nav className="flex space-x-2" aria-label="Tabs">
              {tabs.map((tab) => {
                const IconComponent = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as 'courts' | 'reservations')}
                    className={`group relative flex items-center px-6 py-4 my-2 rounded-xl font-medium text-sm transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-lg transform scale-105'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <IconComponent className={`mr-3 h-5 w-5 transition-transform duration-200 ${
                      activeTab === tab.id ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'
                    }`} />
                    {tab.label}
                    {activeTab === tab.id && (
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-gradient-to-r from-blue-600 to-green-600 rounded-full shadow-lg"></div>
                    )}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'courts' && (
            <>
              <CourtFilters />
              <CourtsTable onCourtSelect={handleCourtSelect} />
            </>
          )}

          {activeTab === 'reservations' && (
            <>
              <BulkReservationActions />
              <ReservationsTable />
            </>
          )}
        </div>

        {/* Court Detail Modal */}
        {selectedCourtForDetail && (
          <CourtDetail
            court={selectedCourtForDetail}
            onClose={handleCourtDetailClose}
          />
        )}
      </div>
    </div>
  )
}

export default AdminCourts