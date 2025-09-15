import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../../store'
import { fetchCourt } from '../../store/thunks/courtsThunks'
import { clearCurrentCourt } from '../../store/slices/courtsSlice'
import { CourtReservationModal } from '../../components/common/Courts/CourtReservationModal'

const CourtDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  
  const { currentCourt, isLoading } = useSelector((state: RootState) => state.courts)
  const { user } = useSelector((state: RootState) => state.auth)
  
  const [showReservationModal, setShowReservationModal] = useState(false)

  useEffect(() => {
    if (id) {
      const courtId = parseInt(id)
      if (!isNaN(courtId)) {
        dispatch(fetchCourt(courtId))
      }
    }

    return () => {
      // Clear current court when leaving the page
      dispatch(clearCurrentCourt())
    }
  }, [dispatch, id])

  useEffect(() => {
    if (currentCourt) {
      document.title = `${currentCourt.name} - Courts - Mexican Pickleball Federation`
    } else {
      document.title = 'Court Details - Mexican Pickleball Federation'
    }
  }, [currentCourt])

  const handleReserve = () => {
    if (!user) {
      navigate('/login')
      return
    }
    setShowReservationModal(true)
  }

  const handleCloseModal = () => {
    setShowReservationModal(false)
  }

  const formatAddress = (address: string | null, state?: { name: string }) => {
    if (!address) return state?.name || 'Location not specified'
    return state?.name ? `${address}, ${state.name}` : address
  }


  const getDayName = (dayNumber: number) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    return days[dayNumber]
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center space-y-8">
          {/* Enhanced Loading Animation */}
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl animate-bounce">
              <span className="text-5xl animate-pulse">🏓</span>
            </div>
            <div className="absolute -inset-4">
              <div className="w-full h-full border-4 border-green-200 rounded-full animate-spin border-t-green-500"></div>
            </div>
            <div className="absolute -inset-8">
              <div className="w-full h-full border-2 border-emerald-100 rounded-full animate-ping"></div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Loading Court Details
            </h2>
            <p className="text-xl text-gray-600 max-w-md mx-auto">
              Fetching the latest information about this court facility...
            </p>

            {/* Loading Progress Indicators */}
            <div className="space-y-3 mt-8">
              <div className="flex items-center justify-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-500">Loading court information</span>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse animation-delay-200"></div>
                <span className="text-sm text-gray-500">Fetching availability</span>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse animation-delay-400"></div>
                <span className="text-sm text-gray-500">Loading amenities</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!currentCourt) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center space-y-8 max-w-lg mx-auto px-6">
          {/* Enhanced Error Animation */}
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center shadow-2xl">
              <span className="text-5xl animate-bounce">❌</span>
            </div>
            <div className="absolute -inset-4">
              <div className="w-full h-full border-4 border-red-200 rounded-full animate-pulse"></div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-4">
                Court Not Found
              </h3>
              <div className="w-16 h-1 bg-gradient-to-r from-red-500 to-pink-500 rounded-full mx-auto mb-6"></div>
            </div>

            <div className="bg-red-50 rounded-2xl p-8 border-2 border-red-200">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-red-500 rounded-full">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.982 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              </div>
              <p className="text-red-700 text-lg leading-relaxed">
                The court you're looking for doesn't exist or may have been removed. This could happen if the court was deleted or the URL is incorrect.
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => navigate('/courts')}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                <div className="flex items-center justify-center space-x-2">
                  <span>🏓</span>
                  <span>Browse All Courts</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </button>

              <button
                onClick={() => navigate(-1)}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span>Go Back</span>
                </div>
              </button>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500 mb-2">Still having trouble?</p>
              <button
                onClick={() => navigate('/contact')}
                className="text-blue-600 hover:text-blue-700 font-semibold underline transition-colors duration-200"
              >
                Contact our support team
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        {/* Enhanced Hero Section */}
        <div className="relative h-80 bg-gradient-to-br from-green-600 via-teal-600 to-blue-700 overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-bounce opacity-70" />
            <div className="absolute bottom-20 left-20 w-40 h-40 bg-yellow-300/20 rounded-full blur-xl animate-pulse opacity-50" />
            <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-green-200/30 rounded-full blur-lg animate-ping opacity-60" />
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
          <div className="relative z-10 h-full flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <button
                    onClick={() => navigate('/courts')}
                    className="text-white hover:text-green-200 mb-6 flex items-center text-sm font-medium transition-all duration-300 group hover:scale-105"
                  >
                    <svg className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Courts
                  </button>
                  <div className="space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 leading-tight">
                      <span className="bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
                        {currentCourt.name}
                      </span>
                    </h1>
                    <div className="flex items-center text-xl text-green-100 font-medium">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {formatAddress(currentCourt.address, currentCourt.state)}
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-green-100">
                        <span className="text-2xl mr-2">🏓</span>
                        <span className="font-semibold">{currentCourt.court_count} Court{currentCourt.court_count > 1 ? 's' : ''}</span>
                      </div>
                      <div className="w-1 h-6 bg-green-300/50 rounded-full"></div>
                      <div className="text-green-100 font-medium">
                        {currentCourt.owner_type === 'club' ? '🏢 Club Facility' : '🤝 Partner Facility'}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex flex-col items-end space-y-3">
                    <span className={`px-4 py-2 rounded-full text-sm font-bold backdrop-blur-sm border-2 border-white/30 ${
                      currentCourt.status === 'active'
                        ? 'bg-green-500/90 text-white shadow-lg shadow-green-500/25'
                        : currentCourt.status === 'maintenance'
                        ? 'bg-yellow-500/90 text-white shadow-lg shadow-yellow-500/25'
                        : 'bg-red-500/90 text-white shadow-lg shadow-red-500/25'
                    }`}>
                      {currentCourt.status === 'active' ? '✅ Available' :
                       currentCourt.status === 'maintenance' ? '🔧 Maintenance' : '❌ Inactive'}
                    </span>
                    <div className="flex flex-wrap gap-2 justify-end">
                      {currentCourt.indoor && (
                        <span className="bg-blue-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium border border-white/20">
                          🏠 Indoor
                        </span>
                      )}
                      {currentCourt.lights && (
                        <span className="bg-yellow-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium border border-white/20">
                          💡 Lights
                        </span>
                      )}
                      {!currentCourt.indoor && (
                        <span className="bg-green-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium border border-white/20">
                          🌞 Outdoor
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Court Information */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                    Court Information
                  </h2>
                  <div className="w-12 h-1 bg-gradient-to-r from-green-500 to-teal-500 rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Courts Available Card */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 hover:border-green-300 transition-all duration-300 group">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-green-700 uppercase tracking-wide">Courts Available</h3>
                      <div className="p-2 bg-green-500 rounded-lg group-hover:scale-110 transition-transform duration-300">
                        <span className="text-2xl">🏓</span>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-green-800">
                      {currentCourt.court_count} Court{currentCourt.court_count > 1 ? 's' : ''}
                    </div>
                  </div>

                  {/* Owner Type Card */}
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200 hover:border-blue-300 transition-all duration-300 group">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-blue-700 uppercase tracking-wide">Owner Type</h3>
                      <div className="p-2 bg-blue-500 rounded-lg group-hover:scale-110 transition-transform duration-300">
                        <span className="text-2xl">{currentCourt.owner_type === 'club' ? '🏢' : '🤝'}</span>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-blue-800">
                      {currentCourt.owner_type === 'club' ? 'Club Facility' : 'Partner Facility'}
                    </div>
                  </div>

                  {/* Surface Type Card */}
                  {currentCourt.surface_type && (
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200 hover:border-purple-300 transition-all duration-300 group">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-purple-700 uppercase tracking-wide">Surface Type</h3>
                        <div className="p-2 bg-purple-500 rounded-lg group-hover:scale-110 transition-transform duration-300">
                          <span className="text-2xl">🏟️</span>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-purple-800">{currentCourt.surface_type}</div>
                    </div>
                  )}

                  {/* Features Card */}
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200 hover:border-orange-300 transition-all duration-300 group">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-orange-700 uppercase tracking-wide">Features</h3>
                      <div className="p-2 bg-orange-500 rounded-lg group-hover:scale-110 transition-transform duration-300">
                        <span className="text-2xl">⭐</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {currentCourt.indoor && (
                        <div className="flex items-center bg-blue-500/90 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                          <span className="mr-2">🏠</span>
                          Indoor
                        </div>
                      )}
                      {currentCourt.lights && (
                        <div className="flex items-center bg-yellow-500/90 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                          <span className="mr-2">💡</span>
                          Lights
                        </div>
                      )}
                      {!currentCourt.indoor && (
                        <div className="flex items-center bg-green-500/90 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                          <span className="mr-2">🌞</span>
                          Outdoor
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description Section */}
                {currentCourt.description && (
                  <div className="mt-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center mb-4">
                      <div className="p-2 bg-gray-600 rounded-lg mr-3">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold text-gray-800">Description</h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed text-lg">{currentCourt.description}</p>
                  </div>
                )}

                {/* Amenities Section */}
                {currentCourt.amenities && (
                  <div className="mt-8 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-6 border border-teal-200">
                    <div className="flex items-center mb-4">
                      <div className="p-2 bg-teal-600 rounded-lg mr-3">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold text-teal-800">Amenities</h3>
                    </div>
                    <p className="text-teal-700 leading-relaxed text-lg">{currentCourt.amenities}</p>
                  </div>
                )}
              </div>

              {/* Enhanced Operating Schedule */}
              {currentCourt.schedules && currentCourt.schedules.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Operating Schedule
                    </h2>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-green-600">Live Schedule</span>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    {currentCourt.schedules.map((schedule) => {
                      const isToday = new Date().getDay() === schedule.day_of_week
                      return (
                        <div
                          key={schedule.id}
                          className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                            isToday
                              ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 shadow-lg shadow-green-100'
                              : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm ${
                              isToday
                                ? 'bg-green-500 text-white shadow-lg'
                                : 'bg-gray-300 text-gray-700'
                            }`}>
                              {getDayName(schedule.day_of_week).slice(0, 3).toUpperCase()}
                            </div>
                            <div>
                              <div className={`font-bold text-lg ${
                                isToday ? 'text-green-800' : 'text-gray-900'
                              }`}>
                                {getDayName(schedule.day_of_week)}
                              </div>
                              {isToday && (
                                <div className="text-sm text-green-600 font-medium">Today</div>
                              )}
                            </div>
                          </div>

                          <div className="text-right">
                            {schedule.is_closed ? (
                              <div className="flex items-center space-x-2">
                                <span className="text-xl">🔒</span>
                                <span className="text-red-600 font-bold text-lg">Closed</span>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-3">
                                <div className="text-right">
                                  <div className={`font-bold text-lg ${
                                    isToday ? 'text-green-800' : 'text-gray-700'
                                  }`}>
                                    {schedule.open_time} - {schedule.close_time}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {(() => {
                                      const openTime = new Date(`2000-01-01T${schedule.open_time}`)
                                      const closeTime = new Date(`2000-01-01T${schedule.close_time}`)
                                      const diffMs = closeTime.getTime() - openTime.getTime()
                                      const diffHours = Math.round(diffMs / (1000 * 60 * 60))
                                      return `${diffHours} hours`
                                    })()}
                                  </div>
                                </div>
                                <span className="text-2xl">🕐</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-8 sticky top-8 border border-gray-100 hover:shadow-2xl transition-all duration-300">
                {currentCourt.status === 'active' ? (
                  <div>
                    {/* Active Court Reservation */}
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <span className="text-3xl">🏓</span>
                      </div>
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3">
                        Reserve Court
                      </h2>
                      <div className="w-12 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto"></div>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">⚡</span>
                            <span className="font-bold text-green-800">Quick Booking</span>
                          </div>
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        </div>
                        <p className="text-green-700 text-sm leading-relaxed">
                          Book your game instantly at this premium facility. Enjoy quality courts with excellent amenities and professional maintenance.
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-lg">💰</span>
                            <span className="text-xs font-bold text-blue-700 uppercase">From</span>
                          </div>
                          <div className="text-xl font-bold text-blue-800">$50</div>
                          <div className="text-xs text-blue-600">per hour</div>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-lg">⭐</span>
                            <span className="text-xs font-bold text-purple-700 uppercase">Rating</span>
                          </div>
                          <div className="text-xl font-bold text-purple-800">4.8</div>
                          <div className="text-xs text-purple-600">excellent</div>
                        </div>
                      </div>

                      <button
                        onClick={handleReserve}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 px-6 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <span>🎾</span>
                          <span>Reserve Now</span>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </div>
                      </button>

                      {!user && (
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-lg">🔐</span>
                            <span className="font-bold text-amber-800">Login Required</span>
                          </div>
                          <p className="text-sm text-amber-700">
                            Please log in to your account to make court reservations.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    {/* Inactive Court Display */}
                    <div className="text-center mb-8">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg ${
                        currentCourt.status === 'maintenance'
                          ? 'bg-gradient-to-br from-yellow-500 to-orange-500'
                          : 'bg-gradient-to-br from-red-500 to-pink-500'
                      }`}>
                        <span className="text-3xl">{currentCourt.status === 'maintenance' ? '🔧' : '❌'}</span>
                      </div>
                      <h2 className={`text-2xl font-bold mb-3 ${
                        currentCourt.status === 'maintenance'
                          ? 'text-yellow-700'
                          : 'text-red-700'
                      }`}>
                        {currentCourt.status === 'maintenance' ? 'Under Maintenance' : 'Currently Inactive'}
                      </h2>
                      <div className={`w-12 h-1 rounded-full mx-auto ${
                        currentCourt.status === 'maintenance'
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                          : 'bg-gradient-to-r from-red-500 to-pink-500'
                      }`}></div>
                    </div>

                    <div className={`rounded-xl p-6 border-2 ${
                      currentCourt.status === 'maintenance'
                        ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300'
                        : 'bg-gradient-to-r from-red-50 to-pink-50 border-red-300'
                    }`}>
                      <div className="flex items-start space-x-3 mb-4">
                        <div className={`p-2 rounded-lg ${
                          currentCourt.status === 'maintenance'
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}>
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.982 16.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className={`font-bold text-lg mb-2 ${
                            currentCourt.status === 'maintenance' ? 'text-yellow-800' : 'text-red-800'
                          }`}>
                            Temporarily Unavailable
                          </h3>
                          <p className={`text-sm leading-relaxed ${
                            currentCourt.status === 'maintenance' ? 'text-yellow-700' : 'text-red-700'
                          }`}>
                            {currentCourt.status === 'maintenance'
                              ? 'This court is currently undergoing maintenance to ensure the best playing experience. Please check back soon or contact support for updates.'
                              : 'This court is currently inactive and not accepting reservations. Please contact support for more information.'
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Enhanced Contact Information */}
                <div className="mt-8 pt-8 border-t-2 border-gray-100">
                  <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Need Help?</h3>
                  </div>

                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 mb-4 border border-gray-200">
                    <p className="text-gray-700 text-sm leading-relaxed text-center">
                      Our support team is here to help with reservations, court information, or any questions you may have.
                    </p>
                  </div>

                  <button
                    onClick={() => navigate('/contact')}
                    className="w-full bg-gradient-to-r from-gray-600 to-blue-600 hover:from-gray-700 hover:to-blue-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>Contact Support</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reservation Modal */}
        {currentCourt && (
          <CourtReservationModal
            isOpen={showReservationModal}
            onClose={handleCloseModal}
            court={currentCourt}
          />
        )}
      </div>
  )
}

export default CourtDetailPage