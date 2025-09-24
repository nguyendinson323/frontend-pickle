import React from 'react'
import { useDispatch } from 'react-redux'
import { setSearchQuery, closeNewConversationModal } from '../../../store/slices/playerMessagesSlice'
import { AppDispatch } from '../../../store'
import {
  FiSearch,
  FiMessageCircle,
  FiX,
  FiUser,
  FiLoader,
  FiUsers,
  FiClock
} from 'react-icons/fi'

interface NewConversationModalProps {
  isOpen: boolean
  searchQuery: string
  searchResults: any[]
  contacts: any[]
  isSearching: boolean
  onStartConversation: (playerId: number) => void
}

const NewConversationModal: React.FC<NewConversationModalProps> = ({
  isOpen,
  searchQuery,
  searchResults,
  contacts,
  isSearching,
  onStartConversation
}) => {
  const dispatch = useDispatch<AppDispatch>()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative mx-auto max-w-2xl w-full bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl border-2 border-gray-200">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mr-4">
                <FiMessageCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">
                Start New Conversation
              </h3>
            </div>
            <button
              onClick={() => dispatch(closeNewConversationModal())}
              className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors duration-200"
            >
              <FiX className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <div className="p-8">
          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FiSearch className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                placeholder="Search for players..."
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-medium text-lg bg-white"
              />
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {searchQuery.length >= 2 ? (
              isSearching ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiLoader className="w-8 h-8 text-white animate-spin" />
                  </div>
                  <p className="text-gray-600 font-medium">Searching for players...</p>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center mb-4">
                    <FiSearch className="w-5 h-5 text-indigo-600 mr-2" />
                    <h4 className="text-base font-bold text-gray-900">Search Results</h4>
                  </div>
                  {searchResults.map(player => (
                    <div
                      key={player.id}
                      onClick={() => onStartConversation(player.user?.id)}
                      className="flex items-center space-x-4 p-4 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 rounded-2xl cursor-pointer transition-all duration-300 border-2 border-transparent hover:border-indigo-200 hover:shadow-lg"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-sm">
                          {player.full_name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-base font-bold text-gray-900">{player.full_name}</p>
                        <div className="flex items-center text-sm text-indigo-600 font-medium">
                          <FiUser className="w-4 h-4 mr-1" />
                          {player.skill_level}
                        </div>
                      </div>
                      <FiMessageCircle className="w-5 h-5 text-gray-400" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiSearch className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-gray-600 font-medium">No players found</p>
                </div>
              )
            ) : (
              <div>
                <div className="flex items-center mb-6">
                  <FiClock className="w-5 h-5 text-blue-600 mr-2" />
                  <h4 className="text-base font-bold text-gray-900">Recent Contacts</h4>
                </div>
                <div className="space-y-4">
                  {contacts.slice(0, 5).map(contact => (
                    <div
                      key={contact.id}
                      onClick={() => onStartConversation(contact.user_id)}
                      className="flex items-center space-x-4 p-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 rounded-2xl cursor-pointer transition-all duration-300 border-2 border-transparent hover:border-blue-200 hover:shadow-lg"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-sm">
                          {contact.full_name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-base font-bold text-gray-900">{contact.full_name}</p>
                        <div className="flex items-center text-sm text-blue-600 font-medium">
                          <FiUsers className="w-4 h-4 mr-1" />
                          {contact.skill_level}
                        </div>
                      </div>
                      <FiMessageCircle className="w-5 h-5 text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewConversationModal