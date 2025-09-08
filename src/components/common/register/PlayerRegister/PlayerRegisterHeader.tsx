import React from 'react'

const PlayerRegisterHeader: React.FC = () => {
  return (
    <div className="text-center mb-8">
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center">
          <span className="text-2xl">🏓</span>
        </div>
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Player Registration
      </h1>
      <p className="text-lg text-gray-600">
        Join the federation as a player and access tournaments, court reservations, and player connections
      </p>
    </div>
  )
}

export default PlayerRegisterHeader