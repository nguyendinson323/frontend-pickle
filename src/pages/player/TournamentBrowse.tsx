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
  setSelectedTournament,
  TournamentFilters,
  Tournament,
  TournamentCategory
} from '../../store/slices/tournamentBrowseSlice'
import { fetchStates } from '../../store/slices/playerSlice'
import {
  TournamentBrowseHeader,
  TournamentBrowseTabs,
  TournamentBrowseFilters,
  TournamentBrowseResults,
  TournamentBrowseRegistrations,
  TournamentRegistrationModal
} from '../../components/player/tournaments'

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
    <div className="min-h-screen  py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TournamentBrowseHeader />
        
        <TournamentBrowseTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          registrationCount={userRegistrations.length}
        />

        {/* Browse Tab */}
        {activeTab === 'browse' && (
          <div className="space-y-8">
            <TournamentBrowseFilters
              filters={filters}
              statesList={statesList}
              onFilterChange={handleFilterChange}
              onSearch={handleSearch}
            />

            <TournamentBrowseResults
              searchPerformed={searchPerformed}
              tournaments={tournaments}
              selectedTournamentId={selectedTournamentId}
              selectedTournament={selectedTournament}
              onTournamentClick={handleTournamentClick}
              onRegisterClick={handleRegisterClick}
              canRegisterForTournament={canRegisterForTournament}
            />
          </div>
        )}

        {/* Registered Tab */}
        {activeTab === 'registered' && (
          <TournamentBrowseRegistrations
            userRegistrations={userRegistrations}
            onWithdraw={handleWithdraw}
            onBrowseClick={() => setActiveTab('browse')}
          />
        )}
      </div>

      <TournamentRegistrationModal
        registrationModal={registrationModal}
        registrationForm={registrationForm}
        onFormChange={setRegistrationForm}
        onSubmit={handleRegistrationSubmit}
      />
    </div>
  )
}

export default TournamentBrowsePage