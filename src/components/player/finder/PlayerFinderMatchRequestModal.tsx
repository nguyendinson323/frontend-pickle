import React from 'react'

interface MatchRequestForm {
  preferred_date: string
  preferred_time: string
  message: string
}

interface PlayerFinderMatchRequestModalProps {
  showModal: boolean
  matchRequestForm: MatchRequestForm
  onFormChange: (form: MatchRequestForm) => void
  onSubmit: () => void
  onClose: () => void
}

const PlayerFinderMatchRequestModal: React.FC<PlayerFinderMatchRequestModalProps> = ({
  showModal,
  matchRequestForm,
  onFormChange,
  onSubmit,
  onClose
}) => {
  if (!showModal) return null

  return (
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
                  onChange={(e) => onFormChange({...matchRequestForm, preferred_date: e.target.value})}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Preferred Time</label>
                <input
                  type="time"
                  value={matchRequestForm.preferred_time}
                  onChange={(e) => onFormChange({...matchRequestForm, preferred_time: e.target.value})}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Message (Optional)</label>
                <textarea
                  rows={3}
                  value={matchRequestForm.message}
                  onChange={(e) => onFormChange({...matchRequestForm, message: e.target.value})}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Add a personal message..."
                />
              </div>
            </div>
          </div>
          <div className=" px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              onClick={onSubmit}
              disabled={!matchRequestForm.preferred_date || !matchRequestForm.preferred_time}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:bg-gray-400"
            >
              Send Request
            </button>
            <button
              onClick={onClose}
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

export default PlayerFinderMatchRequestModal