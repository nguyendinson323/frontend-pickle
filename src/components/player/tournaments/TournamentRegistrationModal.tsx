import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { 
  closeRegistrationModal, 
  TournamentBrowseState,
  setPartnerSearchQuery,
  setSelectedPartner,
  searchPartners
} from '../../../store/slices/tournamentBrowseSlice'
import { AppDispatch } from '../../../store'

interface RegistrationForm {
  partnerName: string
  partnerLevel: string
}

interface TournamentRegistrationModalProps {
  registrationModal: TournamentBrowseState['registrationModal']
  registrationForm: RegistrationForm
  onFormChange: (form: RegistrationForm) => void
  onSubmit: () => void
}

const TournamentRegistrationModal: React.FC<TournamentRegistrationModalProps> = ({
  registrationModal,
  registrationForm,
  onFormChange,
  onSubmit
}) => {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    if (registrationModal.partnerSearchQuery.length >= 2) {
      const searchTimeout = setTimeout(() => {
        dispatch(searchPartners(registrationModal.partnerSearchQuery))
      }, 300)
      
      return () => clearTimeout(searchTimeout)
    }
  }, [registrationModal.partnerSearchQuery, dispatch])

  const handlePartnerSelect = (partnerId: number, partnerName: string) => {
    dispatch(setSelectedPartner(partnerId))
    dispatch(setPartnerSearchQuery(partnerName))
  }

  if (!registrationModal.isOpen || !registrationModal.selectedCategory) {
    return null
  }

  return (
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
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search for your partner by name..."
                        value={registrationModal.partnerSearchQuery}
                        onChange={(e) => dispatch(setPartnerSearchQuery(e.target.value))}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                      {registrationModal.isSearchingPartners && (
                        <div className="absolute right-2 top-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                        </div>
                      )}
                      
                      {/* Search Results */}
                      {registrationModal.partnerSearchResults.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                          {registrationModal.partnerSearchResults.map((player) => (
                            <button
                              key={player.id}
                              type="button"
                              onClick={() => handlePartnerSelect(player.id, player.full_name)}
                              className="w-full px-3 py-2 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-medium text-sm">{player.full_name}</div>
                                  <div className="text-xs text-gray-500">Skill Level: {player.nrtp_level}</div>
                                </div>
                                {registrationModal.selectedPartner === player.id && (
                                  <div className="text-indigo-600">✓</div>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {registrationModal.selectedPartner && (
                      <div className="bg-green-50 border border-green-200 rounded-md p-2">
                        <div className="flex items-center">
                          <span className="text-green-600 mr-2">✓</span>
                          <span className="text-sm text-green-800">Partner selected: {registrationModal.partnerSearchQuery}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Search and select a registered player as your partner for doubles tournaments.
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
              onClick={onSubmit}
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
  )
}

export default TournamentRegistrationModal