import React from 'react'
import { useDispatch } from 'react-redux'
import { setSearchQuery, closeNewConversationModal } from '../../../store/slices/playerMessagesSlice'
import { AppDispatch } from '../../../store'

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
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Start New Conversation
          </h3>
          
          <div className="mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              placeholder="Search for players..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div className="max-h-60 overflow-y-auto">
            {searchQuery.length >= 2 ? (
              isSearching ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto"></div>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-2">
                  {searchResults.map(player => (
                    <div
                      key={player.id}
                      onClick={() => onStartConversation(player.id)}
                      className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-md cursor-pointer"
                    >
                      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {player.full_name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{player.full_name}</p>
                        <p className="text-xs text-gray-500">{player.skill_level}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-4 text-gray-500 text-sm">No players found</p>
              )
            ) : (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Recent Contacts</h4>
                <div className="space-y-2">
                  {contacts.slice(0, 5).map(contact => (
                    <div
                      key={contact.id}
                      onClick={() => onStartConversation(contact.id)}
                      className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-md cursor-pointer"
                    >
                      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {contact.full_name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{contact.full_name}</p>
                        <p className="text-xs text-gray-500">{contact.skill_level}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-end mt-6">
            <button
              onClick={() => dispatch(closeNewConversationModal())}
              className="px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-400 focus:outline-none"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewConversationModal