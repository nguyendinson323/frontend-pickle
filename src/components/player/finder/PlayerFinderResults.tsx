import React from 'react'
import { PlayerFinderPlayer } from '../../../store/slices/playerFinderSlice'
import {
  FiUser,
  FiMapPin,
  FiStar,
  FiUsers,
  FiSend,
  FiSearch
} from 'react-icons/fi'

interface PlayerFinderResultsProps {
  searchPerformed: boolean
  players: PlayerFinderPlayer[]
  onSendMatchRequest: (playerId: number) => void
}

const PlayerFinderResults: React.FC<PlayerFinderResultsProps> = ({
  searchPerformed,
  players,
  onSendMatchRequest
}) => {
  // Age is now calculated by the backend and provided in the player data

  if (!searchPerformed) {
    return null
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 shadow-xl rounded-3xl border-2 border-gray-100">
      <div className="px-8 py-6 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mr-4">
            <FiSearch className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            Search Results ({players.length} players found)
          </h3>
        </div>
      </div>
      <div className="divide-y divide-gray-100">
        {players.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <FiUsers className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">No players found</h3>
            <p className="text-gray-600 font-medium mb-6">
              Try adjusting your search filters to find more players.
            </p>
          </div>
        ) : (
          players.map((player) => (
            <div key={player.id} className="p-8 hover:bg-gray-50 transition-colors duration-200">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center space-x-6 mb-4 lg:mb-0">
                  <div className="flex-shrink-0 relative">
                    {player.profile_photo_url ? (
                      <img
                        className="h-16 w-16 rounded-3xl object-cover shadow-lg"
                        src={player.profile_photo_url}
                        alt={player.full_name}
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                        <FiUser className="h-8 w-8 text-white" />
                      </div>
                    )}
                    {player.user.is_premium && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                        <FiStar className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{player.full_name}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                      <div className="flex items-center text-gray-700">
                        <FiUser className="w-4 h-4 mr-2 text-gray-500" />
                        <span className="font-medium">Age: {player.age}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <FiStar className="w-4 h-4 mr-2 text-yellow-500" />
                        <span className="font-medium">NRTP: {player.nrtp_level}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <FiUsers className="w-4 h-4 mr-2 text-gray-500" />
                        <span className="font-medium">{player.gender}</span>
                      </div>
                      {player.state && (
                        <div className="flex items-center text-gray-700">
                          <FiMapPin className="w-4 h-4 mr-2 text-red-500" />
                          <span className="font-medium">{player.state.name}</span>
                        </div>
                      )}
                      {player.distance && (
                        <div className="flex items-center text-gray-700">
                          <FiMapPin className="w-4 h-4 mr-2 text-blue-500" />
                          <span className="font-medium">{player.distance.toFixed(1)} km away</span>
                        </div>
                      )}
                      {player.user.is_premium && (
                        <div className="flex items-center">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg">
                            <FiStar className="w-3 h-3 mr-1" />
                            Premium
                          </span>
                        </div>
                      )}
                    </div>
                    {player.club && (
                      <div className="mt-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Club: {player.club.name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-center lg:justify-end">
                  <button
                    onClick={() => onSendMatchRequest(player.id)}
                    className="inline-flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 border border-transparent rounded-2xl shadow-xl py-3 px-6 text-sm font-bold text-white hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 hover:transform hover:scale-105"
                  >
                    <FiSend className="w-4 h-4 mr-2" />
                    Send Request
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default PlayerFinderResults