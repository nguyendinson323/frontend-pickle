import React, { useEffect } from 'react'
import { FiTarget, FiTrendingUp, FiUsers, FiHome, FiActivity, FiLoader, FiFolder, FiPlus, FiEye, FiSettings, FiCalendar, FiMapPin, FiStar, FiCheckCircle, FiClock, FiAlertCircle, FiBarChart } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../../../store'
import { fetchStateManagementData } from '../../../../store/slices/stateManagementSlice'

export const StateManagementTab: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const {
    tournaments,
    clubs,
    courts,
    upcomingEvents,
    pendingApprovals,
    stats,
    loading,
    error
  } = useSelector((state: RootState) => state.stateManagement)

  useEffect(() => {
    dispatch(fetchStateManagementData())
  }, [dispatch])

  if (loading && !tournaments.length) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
          ))}
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header Section with Modern Design */}
      <div className="bg-gradient-to-br from-white to-emerald-50 rounded-3xl shadow-2xl border-2 border-gray-200/50 p-8 backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
          <div className="flex items-center space-x-6">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-3xl flex items-center justify-center shadow-xl">
              <FiTarget className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-emerald-900 via-teal-900 to-blue-900 bg-clip-text text-transparent mb-2">State Management Hub</h3>
              <p className="text-lg text-gray-600 font-medium">Comprehensive management of tournaments, clubs, courts, and state operations</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/state/management')}
            className="flex items-center justify-center px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-bold rounded-3xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            <FiBarChart className="w-5 h-5 mr-3" />
            Full Management Dashboard
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Management Overview */}
      <div className="bg-gradient-to-br from-emerald-500 via-teal-500 to-blue-600 rounded-3xl shadow-2xl border-2 border-emerald-200/50 p-8 text-white backdrop-blur-sm overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/20 rounded-full translate-y-24 -translate-x-24 blur-2xl"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h4 className="text-3xl font-bold mb-4">State Operations Command Center</h4>
            <p className="text-emerald-100 mb-6 text-lg leading-relaxed">
              Comprehensive management platform for all state pickleball activities, tournaments, and member organizations with advanced analytics.
            </p>
            <div className="flex items-center space-x-8 text-base">
              <div className="flex items-center space-x-2 bg-white/20 rounded-2xl px-4 py-2 backdrop-blur-sm">
                <FiStar className="w-5 h-5" />
                <span className="font-bold">Tournaments</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/20 rounded-2xl px-4 py-2 backdrop-blur-sm">
                <FiHome className="w-5 h-5" />
                <span className="font-bold">Clubs</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/20 rounded-2xl px-4 py-2 backdrop-blur-sm">
                <FiMapPin className="w-5 h-5" />
                <span className="font-bold">Courts</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/20 rounded-2xl px-4 py-2 backdrop-blur-sm">
                <FiUsers className="w-5 h-5" />
                <span className="font-bold">Members</span>
              </div>
            </div>
          </div>
          <div className="text-center">
            <button
              onClick={() => navigate('/state/management')}
              className="bg-white text-emerald-600 px-8 py-4 rounded-3xl font-bold text-lg shadow-xl hover:shadow-2xl hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-white/50 transform hover:scale-105 transition-all duration-300"
            >
              <FiSettings className="w-5 h-5 inline mr-3" />
              Manage State
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Active Tournaments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeTournaments}</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Registered Clubs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalClubs}</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Available Courts</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCourts}</p>
              </div>
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending Approvals</p>
                <p className="text-2xl font-bold text-gray-900">{pendingApprovals.length}</p>
              </div>
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Tournaments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h4 className="font-medium text-gray-900">Recent Tournaments</h4>
            <button
              onClick={() => navigate('/state/management?section=tournaments')}
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              Manage All
            </button>
          </div>
          {tournaments.length === 0 ? (
            <div className="text-center py-8">
              <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">No Recent Tournaments</h4>
              <p className="text-gray-600 mb-4">Start by creating your first state tournament.</p>
              <button
                onClick={() => navigate('/state/management?action=create-tournament')}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Create Tournament
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {tournaments.slice(0, 3).map((tournament) => (
                <div key={tournament.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-sm font-medium text-gray-900">{tournament.name}</h5>
                      <p className="text-xs text-gray-500">
                        {new Date(tournament.start_date).toLocaleDateString()} • {tournament.venue_name}
                      </p>
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      tournament.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                      tournament.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                      tournament.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {tournament.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Approvals */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h4 className="font-medium text-gray-900">Pending Approvals</h4>
            <button
              onClick={() => navigate('/state/management?section=approvals')}
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              View All
            </button>
          </div>
          {pendingApprovals.length === 0 ? (
            <div className="text-center py-8">
              <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">No Pending Approvals</h4>
              <p className="text-gray-600">All items have been reviewed.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {pendingApprovals.slice(0, 4).map((approval) => (
                <div key={approval.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{approval.type}</p>
                      <p className="text-xs text-gray-500">{approval.description}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">
                        Approve
                      </button>
                      <button className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded">
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <button
          onClick={() => navigate('/state/management?action=create-tournament')}
          className="flex items-center justify-center px-4 py-3 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Create Tournament
        </button>
        <button
          onClick={() => navigate('/state/management?section=clubs')}
          className="flex items-center justify-center px-4 py-3 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          Manage Clubs
        </button>
        <button
          onClick={() => navigate('/state/management?section=courts')}
          className="flex items-center justify-center px-4 py-3 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Monitor Courts
        </button>
        <button
          onClick={() => navigate('/state/management?section=events')}
          className="flex items-center justify-center px-4 py-3 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Schedule Events
        </button>
      </div>
    </div>
  )
}