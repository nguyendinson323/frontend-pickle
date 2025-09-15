import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FiCalendar, FiMapPin, FiUsers, FiDollarSign, FiAward, FiArrowLeft, FiClock, FiCheckCircle, FiUserPlus, FiStar, FiTarget } from 'react-icons/fi'
import { RootState, AppDispatch } from '../../store'
import { fetchTournamentDetails, registerForTournament, clearCurrentTournament } from '../../store/slices/tournamentsSlice'
import { LoadingSpinner } from '../../components/common'

const TournamentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  
  const { currentTournament, isLoading, registrations } = useSelector((state: RootState) => state.tournaments)
  const { user } = useSelector((state: RootState) => state.auth)
  
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [showRegistrationModal, setShowRegistrationModal] = useState(false)

  useEffect(() => {
    if (id) {
      dispatch(fetchTournamentDetails(parseInt(id)))
    }
    
    return () => {
      dispatch(clearCurrentTournament())
    }
  }, [dispatch, id])

  const handleRegister = async () => {
    if (!selectedCategory || !currentTournament) return
    
    try {
      await dispatch(registerForTournament(currentTournament.id, selectedCategory))
      setShowRegistrationModal(false)
      setSelectedCategory(null)
      // Refresh tournament details to get updated registration count
      dispatch(fetchTournamentDetails(parseInt(id!)))
    } catch (error) {
      console.error('Registration failed:', error)
    }
  }

  if (isLoading || !currentTournament) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse">
              <FiAward className="w-10 h-10 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-bounce"></div>
          </div>
          <LoadingSpinner size="lg" message="Loading tournament details..." />
          <p className="text-purple-600 font-medium">Preparing the competition details for you...</p>
        </div>
      </div>
    )
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-200'
      case 'ongoing':
        return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-200 animate-pulse'
      case 'completed':
        return 'bg-gradient-to-r from-gray-500 to-slate-500 text-white shadow-lg shadow-gray-200'
      case 'canceled':
        return 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg shadow-red-200'
      default:
        return 'bg-gradient-to-r from-gray-500 to-slate-500 text-white shadow-lg shadow-gray-200'
    }
  }

  const isRegistrationOpen = () => {
    const now = new Date()
    const regStart = new Date(currentTournament.registration_start)
    const regEnd = new Date(currentTournament.registration_end)
    return now >= regStart && now <= regEnd && currentTournament.status === 'upcoming'
  }

  const userRegistrations = registrations.filter(reg => reg.player?.user_id === user?.id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      {/* Enhanced Hero Section */}
      <div className="relative h-80 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 right-20 w-32 h-32 bg-white rounded-full blur-xl animate-pulse" />
          <div className="absolute bottom-20 left-10 w-40 h-40 bg-yellow-300 rounded-full blur-2xl animate-bounce opacity-30" />
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-purple-300 rounded-full blur-lg animate-ping opacity-40" />
        </div>

        {currentTournament.banner_url && (
          <img
            src={currentTournament.banner_url}
            alt={currentTournament.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
            <button
              onClick={() => navigate('/tournaments')}
              className="mb-6 text-white/90 hover:text-white flex items-center group transition-all duration-300"
            >
              <FiArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="font-medium">Back to Tournaments</span>
            </button>

            <div className="flex items-end justify-between">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                    <FiAward className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                    {currentTournament.name}
                  </h1>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <span className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusBadgeColor(currentTournament.status)} flex items-center space-x-2`}>
                    <FiTarget className="w-4 h-4" />
                    <span>{currentTournament.status.charAt(0).toUpperCase() + currentTournament.status.slice(1)}</span>
                  </span>
                  <div className="flex items-center text-white/90 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                    <FiAward className="w-4 h-4 mr-2" />
                    <span className="font-medium">{currentTournament.tournament_type} Tournament</span>
                  </div>
                  <div className="flex items-center text-white/90 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                    <FiMapPin className="w-4 h-4 mr-2" />
                    <span className="font-medium">{currentTournament.state?.name}</span>
                  </div>
                </div>
              </div>

              {isRegistrationOpen() && user?.role === 'player' && userRegistrations.length === 0 && (
                <button
                  onClick={() => setShowRegistrationModal(true)}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
                >
                  <FiUserPlus className="w-5 h-5" />
                  <span>Register Now</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Enhanced Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Enhanced Description */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-purple-100">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4">
                  <FiAward className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  About This Tournament
                </h2>
              </div>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">
                  {currentTournament.description}
                </p>
              </div>
            </div>

            {/* Enhanced Categories */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-purple-100">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                  <FiTarget className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Tournament Categories
                </h2>
              </div>

              {currentTournament.categories && currentTournament.categories.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {currentTournament.categories.map((category, index) => (
                    <div key={category.id} className="group relative bg-gradient-to-br from-white to-purple-50 border-2 border-purple-200 rounded-xl p-6 hover:shadow-lg hover:border-purple-300 transition-all duration-300">
                      <div className="absolute top-4 right-4">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-white font-bold text-sm">{index + 1}</span>
                        </div>
                      </div>

                      <h3 className="font-bold text-xl text-gray-900 mb-4 pr-12">{category.name}</h3>

                      <div className="space-y-3">
                        {category.gender && (
                          <div className="flex items-center">
                            <FiUsers className="w-4 h-4 text-purple-500 mr-3" />
                            <span className="text-sm text-gray-700">
                              <span className="font-semibold">Gender:</span> {category.gender}
                            </span>
                          </div>
                        )}
                        {(category.min_age || category.max_age) && (
                          <div className="flex items-center">
                            <FiClock className="w-4 h-4 text-purple-500 mr-3" />
                            <span className="text-sm text-gray-700">
                              <span className="font-semibold">Age:</span>
                              {category.min_age && category.max_age ? ` ${category.min_age}-${category.max_age}` :
                               category.min_age ? ` ${category.min_age}+` :
                               category.max_age ? ` Under ${category.max_age}` : ''}
                            </span>
                          </div>
                        )}
                        {(category.min_skill_level || category.max_skill_level) && (
                          <div className="flex items-center">
                            <FiStar className="w-4 h-4 text-purple-500 mr-3" />
                            <span className="text-sm text-gray-700">
                              <span className="font-semibold">Skill Level:</span>
                              {category.min_skill_level && category.max_skill_level ? ` ${category.min_skill_level}-${category.max_skill_level}` :
                               category.min_skill_level ? ` ${category.min_skill_level}+` :
                               category.max_skill_level ? ` Up to ${category.max_skill_level}` : ''}
                            </span>
                          </div>
                        )}
                        {category.format && (
                          <div className="flex items-center">
                            <FiAward className="w-4 h-4 text-purple-500 mr-3" />
                            <span className="text-sm text-gray-700">
                              <span className="font-semibold">Format:</span> {category.format}
                            </span>
                          </div>
                        )}
                        {category.max_participants && (
                          <div className="flex items-center">
                            <FiUsers className="w-4 h-4 text-purple-500 mr-3" />
                            <span className="text-sm text-gray-700">
                              <span className="font-semibold">Max Participants:</span> {category.max_participants}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-indigo-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiClock className="w-8 h-8 text-purple-500" />
                  </div>
                  <p className="text-gray-500 text-lg font-medium">Categories will be announced soon.</p>
                  <p className="text-gray-400 text-sm mt-2">Check back later for category details</p>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Enhanced Tournament Info */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-purple-100">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                  <FiCalendar className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Tournament Details
                </h3>
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-200">
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <FiCalendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-purple-700 mb-1">Tournament Dates</p>
                      <p className="text-gray-900 font-bold text-lg">
                        {new Date(currentTournament.start_date).toLocaleDateString()} -
                        {new Date(currentTournament.end_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-4 border border-indigo-200">
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <FiClock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-indigo-700 mb-1">Registration Period</p>
                      <p className="text-gray-900 font-bold">
                        {new Date(currentTournament.registration_start).toLocaleDateString()} -
                        {new Date(currentTournament.registration_end).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <FiMapPin className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-green-700 mb-1">Venue</p>
                      <p className="text-gray-900 font-bold">{currentTournament.venue_name}</p>
                      {currentTournament.venue_address && (
                        <p className="text-gray-600 text-sm mt-1">{currentTournament.venue_address}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <FiUsers className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-700 mb-1">Participants</p>
                      <div className="flex items-center space-x-2">
                        <p className="text-gray-900 font-bold text-lg">
                          {currentTournament.totalRegistrations || 0} / {currentTournament.max_participants}
                        </p>
                        <span className="text-blue-600 text-sm">registered</span>
                      </div>
                      <div className="mt-2 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(100, ((currentTournament.totalRegistrations || 0) / (currentTournament.max_participants || 1)) * 100)}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {currentTournament.entry_fee && currentTournament.entry_fee > 0 && (
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-200">
                    <div className="flex items-start">
                      <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                        <FiDollarSign className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-yellow-700 mb-1">Entry Fee</p>
                        <p className="text-gray-900 font-bold text-2xl">${currentTournament.entry_fee}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Registration Status */}
            {user?.role === 'player' && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-purple-100">
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-3">
                    <FiUserPlus className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    Registration Status
                  </h3>
                </div>

                {userRegistrations.length > 0 ? (
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                      <div className="flex items-center mb-3">
                        <FiCheckCircle className="w-6 h-6 text-green-600 mr-3" />
                        <p className="text-green-700 font-bold text-lg">Successfully Registered!</p>
                      </div>
                      <div className="space-y-2">
                        {userRegistrations.map((registration) => (
                          <div key={registration.id} className="bg-white/60 rounded-lg p-3 border border-green-300">
                            <div className="flex items-center">
                              <FiAward className="w-4 h-4 text-green-600 mr-2" />
                              <span className="font-semibold text-green-800">Category:</span>
                              <span className="ml-2 text-gray-900 font-medium">{registration.category?.name}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : isRegistrationOpen() ? (
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                      <div className="flex items-center mb-2">
                        <FiClock className="w-5 h-5 text-blue-600 mr-2" />
                        <p className="text-blue-700 font-semibold">Registration Open</p>
                      </div>
                      <p className="text-gray-700 text-sm">Join this tournament and compete with other players!</p>
                    </div>
                    <button
                      onClick={() => setShowRegistrationModal(true)}
                      className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                    >
                      <FiUserPlus className="w-5 h-5" />
                      <span>Register for Tournament</span>
                    </button>
                  </div>
                ) : (
                  <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-4 border border-gray-200">
                    <div className="flex items-center mb-2">
                      <FiClock className="w-5 h-5 text-gray-500 mr-2" />
                      <p className="text-gray-600 font-semibold">Registration Closed</p>
                    </div>
                    <p className="text-gray-500 text-sm">Registration is not currently available for this tournament.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Registration Modal */}
      {showRegistrationModal && currentTournament.categories && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl max-w-lg w-full p-8 shadow-2xl border border-purple-200 animate-fade-in-up">
            {/* Modal Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <FiAward className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                Tournament Registration
              </h3>
              <p className="text-gray-600">Select your competition category</p>
            </div>

            {/* Category Selection */}
            <div className="space-y-3 mb-8">
              {currentTournament.categories.map((category, index) => (
                <label
                  key={category.id}
                  className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-indigo-50 shadow-lg'
                      : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="category"
                    value={category.id}
                    checked={selectedCategory === category.id}
                    onChange={() => setSelectedCategory(category.id)}
                    className="w-5 h-5 text-purple-600 focus:ring-purple-500 border-gray-300 mr-4"
                  />
                  <div className="flex-1">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white font-bold text-sm">{index + 1}</span>
                      </div>
                      <span className="font-semibold text-gray-900 text-lg">{category.name}</span>
                    </div>
                    <div className="ml-11 mt-1 flex flex-wrap gap-2">
                      {category.gender && (
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
                          {category.gender}
                        </span>
                      )}
                      {(category.min_age || category.max_age) && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                          Age: {category.min_age && category.max_age ? `${category.min_age}-${category.max_age}` :
                               category.min_age ? `${category.min_age}+` :
                               category.max_age ? `Under ${category.max_age}` : ''}
                        </span>
                      )}
                      {category.format && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                          {category.format}
                        </span>
                      )}
                    </div>
                  </div>
                </label>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => setShowRegistrationModal(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-4 rounded-xl font-bold transition-all duration-300 hover:shadow-md"
              >
                Cancel
              </button>
              <button
                onClick={handleRegister}
                disabled={!selectedCategory}
                className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white px-6 py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:transform-none disabled:shadow-none flex items-center justify-center space-x-2"
              >
                <FiCheckCircle className="w-5 h-5" />
                <span>Confirm Registration</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TournamentDetailPage