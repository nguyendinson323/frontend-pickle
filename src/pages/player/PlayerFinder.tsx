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
    dispatch(respondToMatchRequest({ 
      requestId, 
      responseData: { 
        response: status, 
        response_message: responseMessage 
      }
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mx-auto mb-6"></div>
          <p className="text-lg font-medium text-gray-700">Loading Player Finder...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PlayerFinderHeader isPremium={user.is_premium} />
        
        {/* Privacy Settings */}
        <div className="mb-8 bg-gradient-to-r from-white to-gray-50 rounded-3xl shadow-xl border-2 border-gray-100 p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Privacy Settings</h3>
              <p className="text-gray-700 font-medium">Control whether other players can find you in searches</p>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="searchable"
                checked={user.is_searchable}
                onChange={(e) => handleToggleSearchability(e.target.checked)}
                className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded-lg"
              />
              <label htmlFor="searchable" className="ml-3 block text-sm font-bold text-gray-900">
                {user.is_searchable ? 'Visible in searches' : 'Hidden from searches'}
              </label>
            </div>
          </div>
          {!user.is_searchable && (
            <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border-2 border-yellow-200">
              <p className="text-sm font-medium text-yellow-800">
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