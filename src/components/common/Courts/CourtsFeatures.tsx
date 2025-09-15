import React from 'react'
import { FiMapPin, FiClock, FiCreditCard, FiInfo, FiShield, FiStar } from 'react-icons/fi'

const CourtsFeatures: React.FC = () => {
  const features = [
    {
      title: 'Location-Based Search',
      description: 'Find courts near you or in any city you\'re visiting across Mexico',
      icon: FiMapPin,
      gradient: 'from-blue-500 to-cyan-600',
      bg: 'bg-blue-100'
    },
    {
      title: 'Real-Time Availability',
      description: 'View live availability and book courts instantly with our real-time system',
      icon: FiClock,
      gradient: 'from-green-500 to-emerald-600',
      bg: 'bg-green-100'
    },
    {
      title: 'Secure Payments',
      description: 'Safe and secure online payments with instant booking confirmation',
      icon: FiCreditCard,
      gradient: 'from-purple-500 to-pink-600',
      bg: 'bg-purple-100'
    },
    {
      title: 'Court Information',
      description: 'Detailed information about surface type, lighting, amenities, and more',
      icon: FiInfo,
      gradient: 'from-orange-500 to-red-600',
      bg: 'bg-orange-100'
    },
    {
      title: 'Member Benefits',
      description: 'Federation members get priority booking and special rates at partner courts',
      icon: FiShield,
      gradient: 'from-teal-500 to-green-600',
      bg: 'bg-teal-100'
    },
    {
      title: 'Quality Guarantee',
      description: 'All courts are vetted and maintained to federation standards',
      icon: FiStar,
      gradient: 'from-indigo-500 to-purple-600',
      bg: 'bg-indigo-100'
    }
  ]

  return (
    <section className="py-20 bg-white opacity-0 animate-fade-in-up">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 opacity-0 animate-fade-in-up [animation-delay:0.2s]">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Court Booking Features
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to find and book the perfect court
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-blue-500 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 group border border-gray-100 hover:-translate-y-2 hover:scale-105 opacity-0 animate-fade-in-up"
              style={{animationDelay: `${0.4 + (index * 0.1)}s`}}
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg hover:scale-110 hover:rotate-6 transition-all duration-300`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-green-600 transition-colors">
                {feature.title}
              </h3>

              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CourtsFeatures