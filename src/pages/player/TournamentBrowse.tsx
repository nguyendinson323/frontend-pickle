import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState, AppDispatch } from '../../store'
import {
  searchTournaments,
  getTournamentDetails,
  fetchUserRegistrations,
  registerForTournament,
  withdrawFromTournament,
  setFilters,
  openRegistrationModal,
  closeRegistrationModal,
  setSelectedPartner,
  TournamentFilters,
  Tournament,
  TournamentCategory
} from '../../store/slices/tournamentBrowseSlice'
import { fetchStates } from '../../store/slices/playerSlice'

const TournamentBrowsePage: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  
  const { user } = useSelector((state: RootState) => state.auth)
  const { 
    tournaments, 
    selectedTournament,
    userRegistrations, 
    filters, 
    searchPerformed,
    registrationModal
  } = useSelector((state: RootState) => state.tournamentBrowse)
  const { statesList } = useSelector((state: RootState) => state.player)

  const [activeTab, setActiveTab] = useState<'browse' | 'registered'>('browse')
  const [selectedTournamentId, setSelectedTournamentId] = useState<number | null>(null)
  const [registrationForm, setRegistrationForm] = useState({
    partnerName: '',
    partnerLevel: ''
  })

  useEffect(() => {
    if (!user || user.role !== 'player') {
      navigate('/login')
      return
    }

    // Load initial data
    dispatch(fetchStates())
    dispatch(fetchUserRegistrations())
    
    // Auto-search with default filters
    handleSearch()
  }, [user, navigate, dispatch])

  const handleFilterChange = (key: keyof TournamentFilters, value: string | number | boolean | null) => {
    dispatch(setFilters({ [key]: value }))
  }

  const handleSearch = () => {
    dispatch(searchTournaments(filters))
  }

  const handleTournamentClick = (tournamentId: number) => {
    if (selectedTournamentId === tournamentId) {
      setSelectedTournamentId(null)
      dispatch(setSelectedTournament(null))
    } else {
      setSelectedTournamentId(tournamentId)
      dispatch(getTournamentDetails(tournamentId))
    }
  }

  const handleRegisterClick = (tournament: Tournament, category: TournamentCategory) => {
    const isDoubles = category.format?.toLowerCase().includes('doubles') || 
                     category.name.toLowerCase().includes('doubles')
    
    dispatch(openRegistrationModal({
      tournamentId: tournament.id,
      category,
      partnerRequired: isDoubles
    }))
  }

  const handleRegistrationSubmit = () => {
    if (!registrationModal.tournamentId || !registrationModal.selectedCategory) return

    const registrationData: {
      tournament_id: number
      category_id: number
      partner_player_id?: number
    } = {
      tournament_id: registrationModal.tournamentId,
      category_id: registrationModal.selectedCategory.id
    }

    if (registrationModal.selectedPartner) {
      registrationData.partner_player_id = registrationModal.selectedPartner
    }

    dispatch(registerForTournament(registrationData))
  }

  const handleWithdraw = (registrationId: number) => {
    if (window.confirm('Are you sure you want to withdraw from this tournament?')) {
      dispatch(withdrawFromTournament(registrationId))
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-green-100 text-green-800'
      case 'ongoing': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      case 'canceled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRegistrationStatus = (tournament: Tournament) => {
    if (!tournament.isRegistered) return null
    
    const registration = tournament.userRegistrations?.[0]
    if (!registration) return null

    switch (registration.status) {
      case 'registered': return 'bg-blue-100 text-blue-800'
      case 'confirmed': return 'bg-green-100 text-green-800'
      case 'waitlisted': return 'bg-yellow-100 text-yellow-800'
      case 'withdrawn': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const canRegisterForTournament = (tournament: Tournament) => {
    const now = new Date()
    const regStart = new Date(tournament.registration_start)
    const regEnd = new Date(tournament.registration_end)
    
    return now >= regStart && now <= regEnd && 
           tournament.status === 'upcoming' &&
           !tournament.isRegistered &&
           (!tournament.max_participants || tournament.availableSpots! > 0)
  }

  if (!user || user.role !== 'player') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
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
                      Tournaments
                    </span>
                  </div>
                </li>
              </ol>
            </nav>
          </div>

          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Tournaments</h1>
            <p className="mt-1 text-sm text-gray-600">
              Browse and register for upcoming tournaments
            </p>
          </div>

          {/* Tabs */}
          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab('browse')}
                  className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'browse'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Browse Tournaments
                </button>
                <button
                  onClick={() => setActiveTab('registered')}
                  className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'registered'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  My Registrations ({userRegistrations.length})
                </button>
              </nav>
            </div>
          </div>

          {/* Browse Tab */}
          {activeTab === 'browse' && (
            <div className="space-y-8">
              
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

                    {/* Status Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <select
                        value={filters.status || ''}
                        onChange={(e) => handleFilterChange('status', e.target.value || null)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      >
                        <option value="">All Status</option>
                        <option value="upcoming">Upcoming</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>

                    {/* Tournament Type Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Tournament Type</label>
                      <select
                        value={filters.tournament_type || ''}
                        onChange={(e) => handleFilterChange('tournament_type', e.target.value || null)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      >
                        <option value="">All Types</option>
                        <option value="Singles">Singles</option>
                        <option value="Doubles">Doubles</option>
                        <option value="Mixed">Mixed</option>
                      </select>
                    </div>

                    {/* Organizer Type Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Organizer</label>
                      <select
                        value={filters.organizer_type || ''}
                        onChange={(e) => handleFilterChange('organizer_type', e.target.value || null)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      >
                        <option value="">All Organizers</option>
                        <option value="federation">Federation</option>
                        <option value="state">State</option>
                        <option value="club">Club</option>
                        <option value="partner">Partner</option>
                      </select>
                    </div>

                    {/* Entry Fee Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Max Entry Fee</label>
                      <select
                        value={filters.entry_fee_max || ''}
                        onChange={(e) => handleFilterChange('entry_fee_max', e.target.value ? parseFloat(e.target.value) : null)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      >
                        <option value="">Any Fee</option>
                        <option value={0}>Free</option>
                        <option value={100}>Up to $100</option>
                        <option value={250}>Up to $250</option>
                        <option value={500}>Up to $500</option>
                        <option value={1000}>Up to $1000</option>
                      </select>
                    </div>

                    {/* Available Spots Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Availability</label>
                      <select
                        value={filters.has_available_spots ? 'true' : 'false'}
                        onChange={(e) => handleFilterChange('has_available_spots', e.target.value === 'true')}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      >
                        <option value="false">All Tournaments</option>
                        <option value="true">Available Spots Only</option>
                      </select>
                    </div>

                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      onClick={handleSearch}
                      className="bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Search Tournaments
                    </button>
                  </div>
                </div>
              </div>

              {/* Tournament Results */}
              {searchPerformed && (
                <div className="bg-white shadow rounded-lg">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Tournament Results ({tournaments.length} found)
                    </h3>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {tournaments.length === 0 ? (
                      <div className="p-6 text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                          <path d="M20 12a8 8 0 018 8v8l4-4H8l4 4v-8a8 8 0 018-8z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No tournaments found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Try adjusting your search filters to find tournaments.
                        </p>
                      </div>
                    ) : (
                      tournaments.map((tournament) => (
                        <div key={tournament.id} className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3">
                                <h3 className="text-lg font-medium text-gray-900">{tournament.name}</h3>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(tournament.status)}`}>
                                  {tournament.status}
                                </span>
                                {tournament.is_ranking && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                    Ranking Tournament
                                  </span>
                                )}
                                {tournament.isRegistered && (
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRegistrationStatus(tournament)}`}>
                                    Registered
                                  </span>
                                )}
                              </div>
                              
                              <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                                <span>📅 {formatDate(tournament.start_date)} - {formatDate(tournament.end_date)}</span>
                                {tournament.venue_name && <span>📍 {tournament.venue_name}</span>}
                                {tournament.state && <span>🏛️ {tournament.state.name}</span>}
                                {tournament.entry_fee && <span>💰 ${tournament.entry_fee}</span>}
                                {tournament.totalParticipants !== undefined && (
                                  <span>👥 {tournament.totalParticipants} participants</span>
                                )}
                                {tournament.availableSpots !== null && tournament.max_participants && (
                                  <span>🎯 {tournament.availableSpots} spots left</span>
                                )}
                              </div>

                              {tournament.description && (
                                <p className="mt-2 text-sm text-gray-600 line-clamp-2">{tournament.description}</p>
                              )}

                              {/* Categories */}
                              {tournament.categories && tournament.categories.length > 0 && (
                                <div className="mt-3">
                                  <div className="flex flex-wrap gap-2">
                                    {tournament.categories.map((category) => (
                                      <span
                                        key={category.id}
                                        className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                                      >
                                        {category.name}
                                        {category.gender && ` (${category.gender})`}
                                        {category.min_skill_level && category.max_skill_level && 
                                          ` - ${category.min_skill_level}-${category.max_skill_level}`
                                        }
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            <div className="ml-4 flex space-x-2">
                              <button
                                onClick={() => handleTournamentClick(tournament.id)}
                                className="bg-gray-100 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                              >
                                {selectedTournamentId === tournament.id ? 'Hide Details' : 'View Details'}
                              </button>
                            </div>
                          </div>

                          {/* Expanded Details */}
                          {selectedTournamentId === tournament.id && selectedTournament && (
                            <div className="mt-6 border-t border-gray-200 pt-6">
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                
                                {/* Tournament Info */}
                                <div>
                                  <h4 className="text-sm font-medium text-gray-900 mb-3">Tournament Information</h4>
                                  <div className="space-y-2 text-sm">
                                    {selectedTournament.organizer && (
                                      <div>
                                        <span className="font-medium">Organizer:</span> {selectedTournament.organizer.name}
                                      </div>
                                    )}
                                    <div>
                                      <span className="font-medium">Registration Period:</span>{' '}
                                      {formatDate(selectedTournament.registration_start)} - {formatDate(selectedTournament.registration_end)}
                                    </div>
                                    {selectedTournament.venue_address && (
                                      <div>
                                        <span className="font-medium">Address:</span> {selectedTournament.venue_address}
                                      </div>
                                    )}
                                    {selectedTournament.ranking_multiplier !== 1 && (
                                      <div>
                                        <span className="font-medium">Ranking Multiplier:</span> {selectedTournament.ranking_multiplier}x
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Categories and Registration */}
                                <div>
                                  <h4 className="text-sm font-medium text-gray-900 mb-3">Categories</h4>
                                  <div className="space-y-3">
                                    {selectedTournament.categories.map((category) => (
                                      <div key={category.id} className="border border-gray-200 rounded-md p-3">
                                        <div className="flex items-center justify-between mb-2">
                                          <h5 className="font-medium text-sm">{category.name}</h5>
                                          {canRegisterForTournament(selectedTournament) && (
                                            <button
                                              onClick={() => handleRegisterClick(selectedTournament, category)}
                                              disabled={category.availableSpots === 0}
                                              className="bg-indigo-600 border border-transparent rounded-md shadow-sm py-1 px-3 text-xs font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
                                            >
                                              {category.availableSpots === 0 ? 'Full' : 'Register'}
                                            </button>
                                          )}
                                        </div>
                                        <div className="text-xs text-gray-600 space-y-1">
                                          {category.gender && (
                                            <div><span className="font-medium">Gender:</span> {category.gender}</div>
                                          )}
                                          {(category.min_age || category.max_age) && (
                                            <div>
                                              <span className="font-medium">Age:</span>{' '}
                                              {category.min_age && `${category.min_age}+`}
                                              {category.min_age && category.max_age && ' - '}
                                              {category.max_age && `${category.max_age}`}
                                            </div>
                                          )}
                                          {(category.min_skill_level || category.max_skill_level) && (
                                            <div>
                                              <span className="font-medium">Skill Level:</span>{' '}
                                              {category.min_skill_level}-{category.max_skill_level}
                                            </div>
                                          )}
                                          {category.format && (
                                            <div><span className="font-medium">Format:</span> {category.format}</div>
                                          )}
                                          {category.participantsCount !== undefined && (
                                            <div>
                                              <span className="font-medium">Participants:</span> {category.participantsCount}
                                              {category.max_participants && `/${category.max_participants}`}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Registered Tab */}
          {activeTab === 'registered' && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">My Tournament Registrations</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {userRegistrations.length === 0 ? (
                  <div className="p-6 text-center">
                    <p className="text-sm text-gray-500">You haven't registered for any tournaments yet.</p>
                    <button
                      onClick={() => setActiveTab('browse')}
                      className="mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Browse tournaments
                    </button>
                  </div>
                ) : (
                  userRegistrations.map((registration) => (
                    <div key={registration.id} className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900">
                            {registration.tournament?.name}
                          </h3>
                          <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                            <span>Category: {registration.category?.name}</span>
                            <span>Status: <span className={`font-medium ${
                              registration.status === 'registered' ? 'text-blue-600' :
                              registration.status === 'confirmed' ? 'text-green-600' :
                              registration.status === 'waitlisted' ? 'text-yellow-600' :
                              'text-red-600'
                            }`}>{registration.status}</span></span>
                            <span>Payment: <span className={`font-medium ${
                              registration.payment_status === 'paid' ? 'text-green-600' :
                              registration.payment_status === 'pending' ? 'text-yellow-600' :
                              'text-red-600'
                            }`}>{registration.payment_status}</span></span>
                            {registration.amount_paid && (
                              <span>Fee: ${registration.amount_paid}</span>
                            )}
                          </div>
                          {registration.tournament && (
                            <div className="mt-1 text-sm text-gray-500">
                              📅 {formatDate(registration.tournament.start_date)} - {formatDate(registration.tournament.end_date)}
                              {registration.tournament.venue_name && (
                                <span className="ml-4">📍 {registration.tournament.venue_name}</span>
                              )}
                            </div>
                          )}
                          {registration.partner && (
                            <div className="mt-1 text-sm text-gray-600">
                              Partner: {registration.partner.full_name} (Level {registration.partner.nrtp_level})
                            </div>
                          )}
                        </div>
                        <div>
                          {registration.status === 'registered' && (
                            <button
                              onClick={() => handleWithdraw(registration.id)}
                              className="bg-red-600 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                              Withdraw
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

        </div>

      {/* Registration Modal */}
      {registrationModal.isOpen && registrationModal.selectedCategory && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Register for Tournament
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Category:</span> {registrationModal.selectedCategory.name}
                    </p>
                    {registrationModal.selectedCategory.gender && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Gender:</span> {registrationModal.selectedCategory.gender}
                      </p>
                    )}
                    {registrationModal.selectedCategory.min_skill_level && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Skill Level:</span>{' '}
                        {registrationModal.selectedCategory.min_skill_level}-{registrationModal.selectedCategory.max_skill_level}
                      </p>
                    )}
                  </div>

                  {registrationModal.partnerRequired && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Partner (Required)</label>
                      <div className="mt-2 space-y-2">
                        <input
                          type="text"
                          placeholder="Partner's name"
                          value={registrationForm.partnerName}
                          onChange={(e) => setRegistrationForm({...registrationForm, partnerName: e.target.value})}
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Partner's skill level"
                          value={registrationForm.partnerLevel}
                          onChange={(e) => setRegistrationForm({...registrationForm, partnerLevel: e.target.value})}
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Note: Your partner must also register separately for doubles tournaments.
                      </p>
                    </div>
                  )}

                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                    <p className="text-sm text-yellow-800">
                      🚧 Registration will require payment processing. This is currently in development mode.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={handleRegistrationSubmit}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Register
                </button>
                <button
                  onClick={() => dispatch(closeRegistrationModal())}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TournamentBrowsePage