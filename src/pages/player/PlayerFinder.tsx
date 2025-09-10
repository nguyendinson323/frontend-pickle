import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState, AppDispatch } from '../../store'
import {
  searchPlayers,
  fetchSentRequests,
  fetchReceivedRequests,
  sendMatchRequest,
  respondToMatchRequest,
  cancelMatchRequest,
  setFilters,
  updatePlayerSearchability,
  PlayerFinderFilters
} from '../../store/slices/playerFinderSlice'
import { fetchStates } from '../../store/slices/playerSlice'
import {
  PlayerFinderHeader,
  PlayerFinderTabs,
  PlayerFinderSearchFilters,
  PlayerFinderResults,
  PlayerFinderSentRequests,
  PlayerFinderReceivedRequests,
  PlayerFinderMatchRequestModal
} from '../../components/player/finder'

const PlayerFinderPage: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  
  const { user } = useSelector((state: RootState) => state.auth)
  const { 
    players, 
    sentRequests, 
    receivedRequests, 
    filters, 
    searchPerformed 
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
    
  }, [user, navigate, dispatch])


  const handleFilterChange = (key: keyof PlayerFinderFilters, value: string | number | null) => {
    dispatch(setFilters({ [key]: value }))
  }

  const handleSearch = () => {
    dispatch(searchPlayers({ filters }))
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
      response: status, 
      response_message: responseMessage 
    }))
  }

  const handleCancelRequest = (requestId: number) => {
    dispatch(cancelMatchRequest(requestId))
  }

  const handleToggleSearchability = (isSearchable: boolean) => {
    dispatch(updatePlayerSearchability(isSearchable))
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
        <PlayerFinderHeader isPremium={user.is_premium} />
        
        {/* Privacy Settings */}
        <div className="mb-8 bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Privacy Settings</h3>
              <p className="text-sm text-gray-600">Control whether other players can find you in searches</p>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="searchable"
                checked={user.is_searchable}
                onChange={(e) => handleToggleSearchability(e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="searchable" className="ml-2 block text-sm text-gray-900">
                {user.is_searchable ? 'Visible in searches' : 'Hidden from searches'}
              </label>
            </div>
          </div>
          {!user.is_searchable && (
            <div className="mt-3 p-3 bg-yellow-50 rounded-md">
              <p className="text-sm text-yellow-700">
                You are currently hidden from player searches. Other players will not be able to find and connect with you.
              </p>
            </div>
          )}
        </div>
        
        <PlayerFinderTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          sentRequestsCount={sentRequests.length}
          receivedRequestsCount={receivedRequests.length}
        />

        {/* Search Tab */}
        {activeTab === 'search' && (
          <div className="space-y-8">
            <PlayerFinderSearchFilters
              isPremium={user.is_premium}
              filters={filters}
              statesList={statesList}
              userLocation={null}
              locationPermission={null}
              onFilterChange={handleFilterChange}
              onSearch={handleSearch}
              onLocationRequest={() => {}}
            />

            <PlayerFinderResults
              searchPerformed={searchPerformed}
              players={players}
              onSendMatchRequest={handleSendMatchRequest}
            />
          </div>
        )}

        {/* Sent Requests Tab */}
        {activeTab === 'sent' && (
          <PlayerFinderSentRequests
            sentRequests={sentRequests}
            onCancelRequest={handleCancelRequest}
          />
        )}

        {/* Received Requests Tab */}
        {activeTab === 'received' && (
          <PlayerFinderReceivedRequests
            receivedRequests={receivedRequests}
            onRespondToRequest={handleRespondToRequest}
          />
        )}
      </div>

      <PlayerFinderMatchRequestModal
        showModal={showMatchRequestModal}
        matchRequestForm={matchRequestForm}
        onFormChange={setMatchRequestForm}
        onSubmit={submitMatchRequest}
        onClose={() => {
          setShowMatchRequestModal(false)
          setSelectedPlayer(null)
          setMatchRequestForm({ preferred_date: '', preferred_time: '', message: '' })
        }}
      />
    </div>
  )
}

export default PlayerFinderPage