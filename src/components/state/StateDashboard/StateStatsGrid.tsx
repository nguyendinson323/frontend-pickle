import React from 'react'

interface StateData {
  totalPlayers: number
  totalClubs: number
  totalCoaches: number
  tournamentsThisYear: number
}

interface StateStatsGridProps {
  stateData: StateData
}

const StateStatsGrid: React.FC<StateStatsGridProps> = ({ stateData }) => {
  const stats = [
    { label: 'State Players', value: stateData.totalPlayers, icon: '👥', color: 'bg-blue-600' },
    { label: 'Active Clubs', value: stateData.totalClubs, icon: '🏢', color: 'bg-purple-600' },
    { label: 'Registered Coaches', value: stateData.totalCoaches, icon: '👨‍🏫', color: 'bg-green-600' },
    { label: 'Tournaments This Year', value: stateData.tournamentsThisYear, icon: '🏆', color: 'bg-yellow-600' }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
        >
          <div className="p-6">
            <div className="flex items-center">
              <div className={`${stat.color} rounded-lg p-3 text-white text-2xl`}>
                {stat.icon}
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default StateStatsGrid