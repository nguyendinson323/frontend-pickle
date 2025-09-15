import React from 'react'
import { FiMapPin, FiUsers, FiHome } from 'react-icons/fi'
import { FederationStatistics } from '../../../types/common'

interface CourtsStatisticsProps {
  statistics: FederationStatistics
}

const CourtsStatistics: React.FC<CourtsStatisticsProps> = ({ statistics }) => {
  const stats = [
    {
      value: statistics.total_courts.toLocaleString(),
      label: 'Total Courts',
      icon: FiHome,
      color: 'text-green-600',
      bg: 'bg-green-100',
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      value: statistics.total_clubs.toLocaleString(),
      label: 'Clubs with Courts',
      icon: FiUsers,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
      gradient: 'from-blue-500 to-cyan-600'
    },
    {
      value: statistics.total_states,
      label: 'States Covered',
      icon: FiMapPin,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
      gradient: 'from-purple-500 to-pink-600'
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white opacity-0 animate-fade-in-up">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 opacity-0 animate-fade-in-up [animation-delay:0.2s]">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Court Network Across Mexico
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-blue-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 group border border-gray-100 hover:-translate-y-2 hover:scale-105 opacity-0 animate-fade-in-up"
              style={{animationDelay: `${0.4 + (index * 0.2)}s`}}
            >
              <div className="text-center space-y-4">
                <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-white shadow-lg hover:scale-125 hover:rotate-12 transition-all duration-300`}>
                  <stat.icon className="w-8 h-8" />
                </div>

                <div>
                  <div
                    className={`text-4xl font-bold mb-2 ${stat.color} group-hover:scale-110 transition-transform opacity-0 animate-fade-in-up`}
                    style={{animationDelay: `${0.7 + (index * 0.1)}s`}}
                  >
                    {stat.value}
                  </div>
                  <p className="text-gray-600 font-medium text-lg">
                    {stat.label}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CourtsStatistics