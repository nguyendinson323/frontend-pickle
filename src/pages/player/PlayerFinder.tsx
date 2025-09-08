import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Layout } from '../../components/layout'
import { RootState, AppDispatch } from '../../store'
import {
  searchPlayers,
  fetchSentRequests,
  fetchReceivedRequests,
  sendMatchRequest,
  respondToMatchRequest,
  cancelMatchRequest,
  setFilters,
  setUserLocation,
  setLocationPermission,
  PlayerFinderFilters
} from '../../store/slices/playerFinderSlice'
import { fetchStates } from '../../store/slices/playerSlice'

const PlayerFinderPage: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  
  const { user } = useSelector((state: RootState) => state.auth)
  const { 
    players, 
    sentRequests, 
    receivedRequests, 
    filters, 
    searchPerformed,
    userLocation,
    locationPermission 
  } = useSelector((state: RootState) => state.playerFinder)
  const { statesList } = useSelector((state: RootState) => state.player)

  const [activeTab, setActiveTab] = useState<'search' | 'sent' | 'received'>('search')
  const [showMatchRequestModal, setShowMatchRequestModal] = useState(false)
  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null)
  const [matchRequestForm, setMatchRequestForm] = useState({
    preferred_date: '',
    preferred_time: '',
    message: ''
  })

  useEffect(() => {
    if (!user || user.role !== 'player') {
      navigate('/login')
      return
    }

    // Load initial data
    dispatch(fetchStates())
    dispatch(fetchSentRequests())
    dispatch(fetchReceivedRequests())
    
    // Request location permission
    handleLocationRequest()
  }, [user, navigate, dispatch])

  const handleLocationRequest = () => {
    if (!navigator.geolocation) {
      dispatch(setLocationPermission('denied'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        dispatch(setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }))
        dispatch(setLocationPermission('granted'))
      },
      (error) => {
        console.log('Location permission denied:', error)
        dispatch(setLocationPermission('denied'))
      }
    )
  }

  const handleFilterChange = (key: keyof PlayerFinderFilters, value: string | number | null) => {
    dispatch(setFilters({ [key]: value }))
  }

  const handleSearch = () => {
    dispatch(searchPlayers(filters))
  }

  const handleSendMatchRequest = (playerId: number) => {
    setSelectedPlayer(playerId)
    setShowMatchRequestModal(true)
  }

  const submitMatchRequest = () => {
    if (!selectedPlayer) return

    dispatch(sendMatchRequest({
      receiver_id: selectedPlayer,
      preferred_date: matchRequestForm.preferred_date,
      preferred_time: matchRequestForm.preferred_time,
      message: matchRequestForm.message
    }))

    setShowMatchRequestModal(false)
    setSelectedPlayer(null)
    setMatchRequestForm({
      preferred_date: '',
      preferred_time: '',
      message: ''
    })
  }

  const handleRespondToRequest = (requestId: number, status: 'accepted' | 'rejected', responseMessage?: string) => {
    dispatch(respondToMatchRequest(requestId, { 
      status, 
      response_message: responseMessage 
    }))
  }

  const handleCancelRequest = (requestId: number) => {
    dispatch(cancelMatchRequest(requestId))
  }

  const calculateAge = (birthDate: string) => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  if (!user || user.role !== 'player') {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Navigation Breadcrumb */}
          <div className="mb-8">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-4">
                <li>
                  <button
                    onClick={() => navigate('/player/dashboard')}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    Dashboard
                  </button>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg
                      className="flex-shrink-0 h-5 w-5 text-gray-300"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                    </svg>
                    <span className="ml-4 text-sm font-medium text-gray-500" aria-current="page">
                      Player Finder
                    </span>
                  </div>
                </li>
              </ol>
            </nav>
          </div>

          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Player Finder</h1>
            <p className="mt-1 text-sm text-gray-600">
              Find nearby players for matches and practice sessions
              {!user.is_premium && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Premium Feature
                </span>
              )}
            </p>
          </div>

          {/* Tabs */}
          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab('search')}
                  className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'search'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Search Players
                </button>
                <button
                  onClick={() => setActiveTab('sent')}
                  className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'sent'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Sent Requests ({sentRequests.length})
                </button>
                <button
                  onClick={() => setActiveTab('received')}
                  className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'received'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Received Requests ({receivedRequests.length})
                </button>
              </nav>
            </div>
          </div>

          {/* Search Tab */}
          {activeTab === 'search' && (
            <div className="space-y-8">
              
              {/* Premium Check */}
              {!user.is_premium ? (
                <div className="rounded-md bg-yellow-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">
                        Premium Feature Required
                      </h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>Player Finder is a premium feature. Upgrade your account to find and connect with nearby players.</p>
                      </div>
                      <div className="mt-4">
                        <div className="-mx-2 -my-1.5 flex">
                          <button
                            onClick={() => navigate('/player/profile')}
                            className="bg-yellow-50 px-2 py-1.5 rounded-md text-sm font-medium text-yellow-800 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-yellow-50 focus:ring-yellow-600"
                          >
                            Upgrade Account
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Location Permission */}
                  {locationPermission === 'denied' && (
                    <div className="rounded-md bg-blue-50 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3 flex-1 md:flex md:justify-between">
                          <p className="text-sm text-blue-700">
                            Enable location services to find players near you.
                          </p>
                          <p className="mt-3 text-sm md:mt-0 md:ml-6">
                            <button
                              onClick={handleLocationRequest}
                              className="whitespace-nowrap font-medium text-blue-700 hover:text-blue-600"
                            >
                              Enable Location
                            </button>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Search Filters */}
                  <div className="bg-white shadow rounded-lg">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">Search Filters</h3>
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        
                        {/* State Filter */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700">State</label>
                          <select
                            value={filters.state_id || ''}
                            onChange={(e) => handleFilterChange('state_id', e.target.value ? parseInt(e.target.value) : null)}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                          >
                            <option value="">All States</option>
                            {statesList.map(state => (
                              <option key={state.id} value={state.id}>
                                {state.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Gender Filter */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Gender</label>
                          <select
                            value={filters.gender || ''}
                            onChange={(e) => handleFilterChange('gender', e.target.value || null)}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                          >
                            <option value="">Any Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        {/* Distance Filter */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Distance (km) {userLocation ? '' : '(Location required)'}
                          </label>
                          <select
                            value={filters.distance_km || ''}
                            onChange={(e) => handleFilterChange('distance_km', e.target.value ? parseInt(e.target.value) : null)}
                            disabled={!userLocation}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md disabled:bg-gray-100"
                          >
                            <option value="">Any Distance</option>
                            <option value={5}>Within 5 km</option>
                            <option value={10}>Within 10 km</option>
                            <option value={25}>Within 25 km</option>
                            <option value={50}>Within 50 km</option>
                            <option value={100}>Within 100 km</option>
                          </select>
                        </div>

                        {/* NRTP Level Min */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Min NRTP Level</label>
                          <select
                            value={filters.nrtp_level_min || ''}
                            onChange={(e) => handleFilterChange('nrtp_level_min', e.target.value ? parseFloat(e.target.value) : null)}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                          >
                            <option value="">Any Level</option>
                            <option value={1.0}>1.0+</option>
                            <option value={1.5}>1.5+</option>
                            <option value={2.0}>2.0+</option>
                            <option value={2.5}>2.5+</option>
                            <option value={3.0}>3.0+</option>
                            <option value={3.5}>3.5+</option>
                            <option value={4.0}>4.0+</option>
                            <option value={4.5}>4.5+</option>
                            <option value={5.0}>5.0</option>
                          </select>
                        </div>

                        {/* NRTP Level Max */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Max NRTP Level</label>
                          <select
                            value={filters.nrtp_level_max || ''}
                            onChange={(e) => handleFilterChange('nrtp_level_max', e.target.value ? parseFloat(e.target.value) : null)}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                          >
                            <option value="">Any Level</option>
                            <option value={1.5}>Up to 1.5</option>
                            <option value={2.0}>Up to 2.0</option>
                            <option value={2.5}>Up to 2.5</option>
                            <option value={3.0}>Up to 3.0</option>
                            <option value={3.5}>Up to 3.5</option>
                            <option value={4.0}>Up to 4.0</option>
                            <option value={4.5}>Up to 4.5</option>
                            <option value={5.0}>Up to 5.0</option>
                          </select>
                        </div>

                        {/* Age Min */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Min Age</label>
                          <select
                            value={filters.age_min || ''}
                            onChange={(e) => handleFilterChange('age_min', e.target.value ? parseInt(e.target.value) : null)}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                          >
                            <option value="">Any Age</option>
                            <option value={18}>18+</option>
                            <option value={25}>25+</option>
                            <option value={35}>35+</option>
                            <option value={45}>45+</option>
                            <option value={55}>55+</option>
                            <option value={65}>65+</option>
                          </select>
                        </div>

                      </div>
                      
                      <div className="flex justify-end">
                        <button
                          onClick={handleSearch}
                          className="bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Search Players
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Search Results */}
                  {searchPerformed && (
                    <div className="bg-white shadow rounded-lg">
                      <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          Search Results ({players.length} players found)
                        </h3>
                      </div>
                      <div className="divide-y divide-gray-200">
                        {players.length === 0 ? (
                          <div className="p-6 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                              <path d="M34 40h10v-4a6 6 0 00-10.712-3.714M34 40H14m20 0v-4a9.971 9.971 0 00-.712-3.714M14 40H4v-4a6 6 0 0110.713-3.714M14 40v-4c0-1.313.253-2.566.713-3.714m0 0A9.971 9.971 0 0124 30c4.21 0 7.813 2.602 9.288 6.286M30 14a6 6 0 11-12 0 6 6 0 0112 0zm12 6a4 4 0 11-8 0 4 4 0 018 0zm-28 0a4 4 0 11-8 0 4 4 0 018 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No players found</h3>
                            <p className="mt-1 text-sm text-gray-500">
                              Try adjusting your search filters to find more players.
                            </p>
                          </div>
                        ) : (
                          players.map((player) => (
                            <div key={player.id} className="p-6">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <div className="flex-shrink-0">
                                    {player.profile_photo_url ? (
                                      <img
                                        className="h-12 w-12 rounded-full"
                                        src={player.profile_photo_url}
                                        alt={player.full_name}
                                      />
                                    ) : (
                                      <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center">
                                        <svg className="h-6 w-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                        </svg>
                                      </div>
                                    )}
                                  </div>
                                  <div>
                                    <h3 className="text-lg font-medium text-gray-900">{player.full_name}</h3>
                                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                                      <span>Age: {calculateAge(player.birth_date)}</span>
                                      <span>NRTP: {player.nrtp_level}</span>
                                      <span>{player.gender}</span>
                                      {player.state && <span>{player.state.name}</span>}
                                      {player.distance && <span>{player.distance.toFixed(1)} km away</span>}
                                      {player.user.is_premium && (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                          Premium
                                        </span>
                                      )}
                                    </div>
                                    {player.club && (
                                      <p className="text-sm text-gray-600 mt-1">Club: {player.club.name}</p>
                                    )}
                                  </div>
                                </div>
                                <div>
                                  <button
                                    onClick={() => handleSendMatchRequest(player.id)}
                                    className="bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                  >
                                    Send Request
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Sent Requests Tab */}
          {activeTab === 'sent' && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Sent Requests</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {sentRequests.length === 0 ? (
                  <div className="p-6 text-center">
                    <p className="text-sm text-gray-500">No sent requests yet.</p>
                  </div>
                ) : (
                  sentRequests.map((request) => (
                    <div key={request.id} className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {request.receiver?.full_name}
                          </h3>
                          <div className="text-sm text-gray-500 space-y-1">
                            <p>Date: {request.preferred_date}</p>
                            <p>Time: {request.preferred_time}</p>
                            {request.message && <p>Message: {request.message}</p>}
                            <p>Status: <span className={`font-medium ${
                              request.status === 'pending' ? 'text-yellow-600' :
                              request.status === 'accepted' ? 'text-green-600' :
                              request.status === 'rejected' ? 'text-red-600' :
                              'text-gray-600'
                            }`}>{request.status}</span></p>
                          </div>
                        </div>
                        <div>
                          {request.status === 'pending' && (
                            <button
                              onClick={() => handleCancelRequest(request.id)}
                              className="bg-red-600 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Received Requests Tab */}
          {activeTab === 'received' && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Received Requests</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {receivedRequests.length === 0 ? (
                  <div className="p-6 text-center">
                    <p className="text-sm text-gray-500">No received requests yet.</p>
                  </div>
                ) : (
                  receivedRequests.map((request) => (
                    <div key={request.id} className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {request.requester?.full_name}
                          </h3>
                          <div className="text-sm text-gray-500 space-y-1">
                            <p>Date: {request.preferred_date}</p>
                            <p>Time: {request.preferred_time}</p>
                            {request.message && <p>Message: {request.message}</p>}
                            <p>Status: <span className={`font-medium ${
                              request.status === 'pending' ? 'text-yellow-600' :
                              request.status === 'accepted' ? 'text-green-600' :
                              request.status === 'rejected' ? 'text-red-600' :
                              'text-gray-600'
                            }`}>{request.status}</span></p>
                          </div>
                        </div>
                        <div className="space-x-2">
                          {request.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleRespondToRequest(request.id, 'accepted')}
                                className="bg-green-600 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => handleRespondToRequest(request.id, 'rejected')}
                                className="bg-red-600 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Match Request Modal */}
      {showMatchRequestModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Send Match Request
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Preferred Date</label>
                    <input
                      type="date"
                      value={matchRequestForm.preferred_date}
                      onChange={(e) => setMatchRequestForm({...matchRequestForm, preferred_date: e.target.value})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Preferred Time</label>
                    <input
                      type="time"
                      value={matchRequestForm.preferred_time}
                      onChange={(e) => setMatchRequestForm({...matchRequestForm, preferred_time: e.target.value})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Message (Optional)</label>
                    <textarea
                      rows={3}
                      value={matchRequestForm.message}
                      onChange={(e) => setMatchRequestForm({...matchRequestForm, message: e.target.value})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Add a personal message..."
                    />
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={submitMatchRequest}
                  disabled={!matchRequestForm.preferred_date || !matchRequestForm.preferred_time}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:bg-gray-400"
                >
                  Send Request
                </button>
                <button
                  onClick={() => {
                    setShowMatchRequestModal(false)
                    setSelectedPlayer(null)
                    setMatchRequestForm({ preferred_date: '', preferred_time: '', message: '' })
                  }}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}

export default PlayerFinderPage