import React from 'react'
import { FederationStatistics } from '../../../types/common'

interface CourtsStatisticsProps {
  statistics: FederationStatistics
}

const CourtsStatistics: React.FC<CourtsStatisticsProps> = ({ statistics }) => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Court Network Across Mexico
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">
              {statistics.total_courts.toLocaleString()}
            </div>
            <div className="text-gray-600 font-medium">Total Courts</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">
              {statistics.total_clubs.toLocaleString()}
            </div>
            <div className="text-gray-600 font-medium">Clubs with Courts</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">
              {statistics.total_states}
            </div>
            <div className="text-gray-600 font-medium">States Covered</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CourtsStatistics