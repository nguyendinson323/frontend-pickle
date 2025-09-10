import React from 'react'
import { useDispatch } from 'react-redux'
import { closeRegistrationModal, TournamentBrowseState } from '../../../store/slices/tournamentBrowseSlice'
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
                    <input
                      type="text"
                      placeholder="Partner's name"
                      value={registrationForm.partnerName}
                      onChange={(e) => onFormChange({...registrationForm, partnerName: e.target.value})}
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Partner's skill level"
                      value={registrationForm.partnerLevel}
                      onChange={(e) => onFormChange({...registrationForm, partnerLevel: e.target.value})}
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
          <div className=" px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              onClick={onSubmit}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Register
            </button>
            <button
              onClick={() => dispatch(closeRegistrationModal())}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover: focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
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