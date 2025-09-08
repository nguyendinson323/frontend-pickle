import React from 'react'
import { FederationStatistics as FederationStatsType } from '../../../types/common'

interface FederationStatisticsProps {
  statistics: FederationStatsType
}

const FederationStatistics: React.FC<FederationStatisticsProps> = ({ statistics }) => {
  return (
    <section className="py-16 bg-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Our Growing Community
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands of players, coaches, clubs, and organizations across all 32 states of Mexico
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-indigo-600 mb-2">
              {statistics.total_players.toLocaleString()}
            </div>
            <div className="text-gray-600 font-medium">Players</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-indigo-600 mb-2">
              {statistics.total_coaches.toLocaleString()}
            </div>
            <div className="text-gray-600 font-medium">Coaches</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-indigo-600 mb-2">
              {statistics.total_clubs.toLocaleString()}
            </div>
            <div className="text-gray-600 font-medium">Clubs</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-indigo-600 mb-2">
              {statistics.total_partners.toLocaleString()}
            </div>
            <div className="text-gray-600 font-medium">Partners</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-indigo-600 mb-2">
              {statistics.total_courts.toLocaleString()}
            </div>
            <div className="text-gray-600 font-medium">Courts</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-indigo-600 mb-2">
              {statistics.total_states}
            </div>
            <div className="text-gray-600 font-medium">States</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FederationStatistics