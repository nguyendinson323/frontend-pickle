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
import { FiUserPlus, FiSearch, FiCheck, FiX, FiLoader, FiTarget, FiUsers, FiInfo } from 'react-icons/fi'

interface TournamentRegistrationModalProps {
  registrationModal: TournamentBrowseState['registrationModal']
  onSubmit: () => void
}

const TournamentRegistrationModal: React.FC<TournamentRegistrationModalProps> = ({
  registrationModal,
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
    <div className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
        <div className="inline-block align-bottom bg-white rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full border-2 border-gray-100">
          <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-8 py-8">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mr-4 shadow-xl">
                <FiUserPlus className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                Tournament Registration
              </h3>
            </div>
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl shadow-lg border-2 border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mr-3 shadow-lg">
                    <FiTarget className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900">Category Details</h4>
                </div>
                <div className="space-y-3">
                  <div className="bg-blue-50 p-4 rounded-2xl border-2 border-blue-100">
                    <span className="text-sm font-bold text-blue-700">Category:</span>
                    <p className="font-bold text-gray-900">{registrationModal.selectedCategory.name}</p>
                  </div>
                  {registrationModal.selectedCategory.gender && (
                    <div className="bg-pink-50 p-4 rounded-2xl border-2 border-pink-100">
                      <span className="text-sm font-bold text-pink-700">Gender:</span>
                      <p className="font-bold text-gray-900">{registrationModal.selectedCategory.gender}</p>
                    </div>
                  )}
                  {registrationModal.selectedCategory.min_skill_level && (
                    <div className="bg-green-50 p-4 rounded-2xl border-2 border-green-100">
                      <span className="text-sm font-bold text-green-700">Skill Level:</span>
                      <p className="font-bold text-gray-900">
                        {registrationModal.selectedCategory.min_skill_level}-{registrationModal.selectedCategory.max_skill_level}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {registrationModal.partnerRequired && (
                <div className="bg-white p-6 rounded-3xl shadow-lg border-2 border-gray-100">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mr-3 shadow-lg">
                      <FiUsers className="w-4 h-4 text-white" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900">Partner Selection (Required)</h4>
                  </div>
                  <div className="space-y-4">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FiSearch className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Search for your partner by name..."
                        value={registrationModal.partnerSearchQuery}
                        onChange={(e) => dispatch(setPartnerSearchQuery(e.target.value))}
                        className="w-full pl-12 pr-12 py-4 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-medium shadow-lg"
                      />
                      {registrationModal.isSearchingPartners && (
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                          <FiLoader className="w-5 h-5 text-indigo-600 animate-spin" />
                        </div>
                      )}
                      
                      {/* Search Results */}
                      {registrationModal.partnerSearchResults.length > 0 && (
                        <div className="absolute z-20 w-full mt-2 bg-white border-2 border-gray-200 rounded-2xl shadow-2xl max-h-60 overflow-y-auto">
                          {registrationModal.partnerSearchResults.map((player) => (
                            <button
                              key={player.id}
                              type="button"
                              onClick={() => handlePartnerSelect(player.id, player.full_name)}
                              className="w-full px-6 py-4 text-left hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 border-b-2 border-gray-100 last:border-b-0 transition-all duration-300"
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-bold text-gray-900">{player.full_name}</div>
                                  <div className="text-sm text-gray-600">Skill Level: {player.nrtp_level}</div>
                                </div>
                                {registrationModal.selectedPartner === player.id && (
                                  <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                                    <FiCheck className="w-4 h-4 text-white" />
                                  </div>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {registrationModal.selectedPartner && (
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-4">
                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mr-3">
                            <FiCheck className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-sm font-bold text-green-800">Partner selected: {registrationModal.partnerSearchQuery}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="bg-blue-50 p-4 rounded-2xl border-2 border-blue-100">
                    <div className="flex items-start">
                      <FiInfo className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                      <p className="text-sm font-medium text-blue-800">
                        Search and select a registered player as your partner for doubles tournaments.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl p-6">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mr-3 shadow-lg">
                    <FiInfo className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-sm font-bold text-yellow-800">
                    Registration will require payment processing. This is currently in development mode.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 sm:flex sm:flex-row-reverse sm:space-x-4 sm:space-x-reverse space-y-3 sm:space-y-0">
            <button
              onClick={onSubmit}
              disabled={registrationModal.partnerRequired && !registrationModal.selectedPartner}
              className={`w-full inline-flex justify-center items-center px-6 py-3 text-base font-bold rounded-2xl shadow-xl transition-all duration-300 transform sm:ml-3 sm:w-auto ${
                registrationModal.partnerRequired && !registrationModal.selectedPartner
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-2xl hover:scale-105'
              }`}
            >
              <FiUserPlus className="w-5 h-5 mr-2" />
              Register for Tournament
            </button>
            <button
              onClick={() => dispatch(closeRegistrationModal())}
              className="w-full inline-flex justify-center items-center px-6 py-3 text-base font-bold text-gray-700 bg-white rounded-2xl shadow-lg hover:bg-gray-50 border-2 border-gray-300 hover:border-gray-400 transition-all duration-300 transform hover:scale-105 sm:w-auto"
            >
              <FiX className="w-5 h-5 mr-2" />
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TournamentRegistrationModal