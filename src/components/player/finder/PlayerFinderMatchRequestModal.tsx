import React from 'react'
import {
  FiSend,
  FiCalendar,
  FiClock,
  FiMessageSquare,
  FiX
} from 'react-icons/fi'

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
    <div className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-black bg-opacity-60 transition-opacity"></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
        <div className="inline-block align-bottom bg-gradient-to-br from-white to-gray-50 rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full border-2 border-gray-200">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mr-4">
                  <FiSend className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Send Match Request
                </h3>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors"
              >
                <FiX className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          <div className="p-8 space-y-8">
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
              <div className="flex items-center mb-4">
                <FiCalendar className="w-5 h-5 text-blue-600 mr-3" />
                <label className="block text-lg font-bold text-blue-800">
                  Preferred Date
                </label>
              </div>
              <input
                type="date"
                value={matchRequestForm.preferred_date}
                onChange={(e) => onFormChange({...matchRequestForm, preferred_date: e.target.value})}
                className="w-full px-6 py-4 border-2 border-blue-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium bg-white text-lg"
              />
            </div>

            <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
              <div className="flex items-center mb-4">
                <FiClock className="w-5 h-5 text-green-600 mr-3" />
                <label className="block text-lg font-bold text-green-800">
                  Preferred Time
                </label>
              </div>
              <input
                type="time"
                value={matchRequestForm.preferred_time}
                onChange={(e) => onFormChange({...matchRequestForm, preferred_time: e.target.value})}
                className="w-full px-6 py-4 border-2 border-green-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 font-medium bg-white text-lg"
              />
            </div>

            <div className="bg-purple-50 rounded-2xl p-6 border border-purple-200">
              <div className="flex items-center mb-4">
                <FiMessageSquare className="w-5 h-5 text-purple-600 mr-3" />
                <label className="block text-lg font-bold text-purple-800">
                  Message (Optional)
                </label>
              </div>
              <textarea
                rows={4}
                value={matchRequestForm.message}
                onChange={(e) => onFormChange({...matchRequestForm, message: e.target.value})}
                className="w-full px-6 py-4 border-2 border-purple-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-medium bg-white resize-none"
                placeholder="Add a personal message to introduce yourself..."
              />
            </div>
          </div>

          <div className="bg-gray-100 px-8 py-6 flex flex-col sm:flex-row gap-4">
            <button
              onClick={onClose}
              className="flex-1 inline-flex items-center justify-center px-8 py-4 bg-gray-200 text-gray-700 font-bold rounded-2xl hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-300"
            >
              <FiX className="w-5 h-5 mr-3" />
              Cancel
            </button>
            <button
              onClick={onSubmit}
              disabled={!matchRequestForm.preferred_date || !matchRequestForm.preferred_time}
              className="flex-1 inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-xl hover:shadow-2xl hover:transform hover:scale-105"
            >
              <FiSend className="w-5 h-5 mr-3" />
              Send Request
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlayerFinderMatchRequestModal