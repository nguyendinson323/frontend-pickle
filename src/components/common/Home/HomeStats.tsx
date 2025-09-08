import React from 'react'
import { FederationStatistics } from '../../../types/common'

interface HomeStatsProps {
  statistics: FederationStatistics
}

const HomeStats: React.FC<HomeStatsProps> = ({ statistics }) => {
  const stats = [
    { label: 'Registered Players', value: statistics.total_players.toLocaleString() },
    { label: 'Active Clubs', value: statistics.total_clubs.toLocaleString() },
    { label: 'Tournaments Hosted', value: statistics.total_tournaments.toLocaleString() },
    { label: 'States Covered', value: statistics.total_states.toString() }
  ]

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={stat.label} className="text-center">
              <div className={`text-3xl md:text-4xl font-bold text-indigo-600 mb-2 animate-count-up animation-delay-${index * 200}`}>
                {stat.value}
              </div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HomeStats