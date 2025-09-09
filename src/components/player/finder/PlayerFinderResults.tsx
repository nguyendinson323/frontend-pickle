import React from 'react'

interface Player {
  id: number
  full_name: string
  birth_date: string
  gender: string
  nrtp_level: number
  profile_photo_url?: string
  club?: { name: string }
  state?: { name: string }
  distance?: number
  user: { is_premium: boolean }
}

interface PlayerFinderResultsProps {
  searchPerformed: boolean
  players: Player[]
  onSendMatchRequest: (playerId: number) => void
}

const PlayerFinderResults: React.FC<PlayerFinderResultsProps> = ({
  searchPerformed,
  players,
  onSendMatchRequest
}) => {
  const calculateAge = (birthDate: string) => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  if (!searchPerformed) {
    return null
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Search Results ({players.length} players found)
        </h3>
      </div>
      <div className="divide-y divide-gray-200">
        {players.length === 0 ? (
          <div className="p-6 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M34 40h10v-4a6 6 0 00-10.712-3.714M34 40H14m20 0v-4a9.971 9.971 0 00-.712-3.714M14 40H4v-4a6 6 0 0110.713-3.714M14 40v-4c0-1.313.253-2.566.713-3.714m0 0A9.971 9.971 0 0124 30c4.21 0 7.813 2.602 9.288 6.286M30 14a6 6 0 11-12 0 6 6 0 0112 0zm12 6a4 4 0 11-8 0 4 4 0 018 0zm-28 0a4 4 0 11-8 0 4 4 0 018 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No players found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search filters to find more players.
            </p>
          </div>
        ) : (
          players.map((player) => (
            <div key={player.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {player.profile_photo_url ? (
                      <img
                        className="h-12 w-12 rounded-full"
                        src={player.profile_photo_url}
                        alt={player.full_name}
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center">
                        <svg className="h-6 w-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{player.full_name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Age: {calculateAge(player.birth_date)}</span>
                      <span>NRTP: {player.nrtp_level}</span>
                      <span>{player.gender}</span>
                      {player.state && <span>{player.state.name}</span>}
                      {player.distance && <span>{player.distance.toFixed(1)} km away</span>}
                      {player.user.is_premium && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Premium
                        </span>
                      )}
                    </div>
                    {player.club && (
                      <p className="text-sm text-gray-600 mt-1">Club: {player.club.name}</p>
                    )}
                  </div>
                </div>
                <div>
                  <button
                    onClick={() => onSendMatchRequest(player.id)}
                    className="bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
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