import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
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
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" message="Loading tournament details..." />
      </div>
    )
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800'
      case 'ongoing':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-gray-100 text-gray-800'
      case 'canceled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-64 bg-gradient-to-r from-indigo-600 to-purple-600">
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
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <button
              onClick={() => navigate('/tournaments')}
              className="mb-4 text-white hover:text-gray-200 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Tournaments
            </button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {currentTournament.name}
                </h1>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(currentTournament.status)}`}>
                    {currentTournament.status.charAt(0).toUpperCase() + currentTournament.status.slice(1)}
                  </span>
                  <span className="text-white">
                    {currentTournament.tournament_type} Tournament
                  </span>
                  <span className="text-white">
                    {currentTournament.state?.name}
                  </span>
                </div>
              </div>
              {isRegistrationOpen() && user?.role === 'player' && userRegistrations.length === 0 && (
                <button
                  onClick={() => setShowRegistrationModal(true)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Register Now
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Description */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Tournament</h2>
              <p className="text-gray-600 whitespace-pre-wrap">{currentTournament.description}</p>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Tournament Categories</h2>
              {currentTournament.categories && currentTournament.categories.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentTournament.categories.map((category) => (
                    <div key={category.id} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">{category.name}</h3>
                      <div className="space-y-1 text-sm text-gray-600">
                        {category.gender && (
                          <p><span className="font-medium">Gender:</span> {category.gender}</p>
                        )}
                        {(category.min_age || category.max_age) && (
                          <p>
                            <span className="font-medium">Age:</span> 
                            {category.min_age && category.max_age ? ` ${category.min_age}-${category.max_age}` :
                             category.min_age ? ` ${category.min_age}+` :
                             category.max_age ? ` Under ${category.max_age}` : ''}
                          </p>
                        )}
                        {(category.min_skill_level || category.max_skill_level) && (
                          <p>
                            <span className="font-medium">Skill Level:</span>
                            {category.min_skill_level && category.max_skill_level ? ` ${category.min_skill_level}-${category.max_skill_level}` :
                             category.min_skill_level ? ` ${category.min_skill_level}+` :
                             category.max_skill_level ? ` Up to ${category.max_skill_level}` : ''}
                          </p>
                        )}
                        {category.format && (
                          <p><span className="font-medium">Format:</span> {category.format}</p>
                        )}
                        {category.max_participants && (
                          <p><span className="font-medium">Max Participants:</span> {category.max_participants}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Categories will be announced soon.</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Tournament Info */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tournament Information</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-500">Tournament Dates</p>
                    <p className="font-medium">
                      {new Date(currentTournament.start_date).toLocaleDateString()} - 
                      {new Date(currentTournament.end_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-500">Registration Period</p>
                    <p className="font-medium">
                      {new Date(currentTournament.registration_start).toLocaleDateString()} - 
                      {new Date(currentTournament.registration_end).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-500">Venue</p>
                    <p className="font-medium">{currentTournament.venue_name}</p>
                    {currentTournament.venue_address && (
                      <p className="text-sm text-gray-600">{currentTournament.venue_address}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-500">Participants</p>
                    <p className="font-medium">
                      {currentTournament.totalRegistrations || 0} / {currentTournament.max_participants} registered
                    </p>
                  </div>
                </div>

                {currentTournament.entry_fee && currentTournament.entry_fee > 0 && (
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-500">Entry Fee</p>
                      <p className="font-medium">${currentTournament.entry_fee}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Registration Status */}
            {user?.role === 'player' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Registration Status</h3>
                {userRegistrations.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-green-600 font-medium">✓ You are registered for this tournament</p>
                    {userRegistrations.map((registration) => (
                      <div key={registration.id} className="text-sm text-gray-600">
                        Category: {registration.category?.name}
                      </div>
                    ))}
                  </div>
                ) : isRegistrationOpen() ? (
                  <div>
                    <p className="text-gray-600 mb-4">Registration is currently open.</p>
                    <button
                      onClick={() => setShowRegistrationModal(true)}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Register for Tournament
                    </button>
                  </div>
                ) : (
                  <p className="text-gray-500">Registration is not currently available.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      {showRegistrationModal && currentTournament.categories && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Category</h3>
            <div className="space-y-2 mb-4">
              {currentTournament.categories.map((category) => (
                <label key={category.id} className="flex items-center">
                  <input
                    type="radio"
                    name="category"
                    value={category.id}
                    checked={selectedCategory === category.id}
                    onChange={() => setSelectedCategory(category.id)}
                    className="mr-3"
                  />
                  <span>{category.name}</span>
                </label>
              ))}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowRegistrationModal(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRegister}
                disabled={!selectedCategory}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TournamentDetailPage