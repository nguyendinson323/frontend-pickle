import React from 'react'
import { FiGift, FiCalendar, FiTrendingUp, FiGlobe, FiUsers, FiBarChart, FiStar, FiZap } from 'react-icons/fi'

const PartnerBenefitsSection: React.FC = () => {
  const benefits = [
    {
      icon: FiCalendar,
      title: 'Court Rental Management',
      description: 'Advanced booking system with automated scheduling'
    },
    {
      icon: FiStar,
      title: 'Event Hosting & Tournaments',
      description: 'Organize and manage pickleball events seamlessly'
    },
    {
      icon: FiGlobe,
      title: 'Business Microsite',
      description: 'Professional website with federation integration'
    },
    {
      icon: FiBarChart,
      title: 'Revenue Tracking',
      description: 'Comprehensive reporting and analytics tools'
    },
    {
      icon: FiTrendingUp,
      title: 'Partner Directory Listing',
      description: 'Featured placement in federation partner network'
    },
    {
      icon: FiUsers,
      title: 'Player Database Access',
      description: 'Connect with federation members and players'
    }
  ]

  return (
    <div className="bg-gradient-to-br from-orange-50/50 to-red-50/50 backdrop-blur-sm p-8 rounded-2xl border border-orange-200/50 shadow-lg">
      <div className="flex items-center mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
          <FiGift className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Partner Benefits & Features</h3>
          <p className="text-sm text-gray-600">Unlock powerful tools and opportunities for your business</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {benefits.map((benefit, index) => (
          <div key={index} className="group bg-white/70 backdrop-blur-sm border border-orange-200/50 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:bg-white/90 hover:border-orange-300">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                <benefit.icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 mb-2 group-hover:text-orange-900 transition-colors duration-200">
                  {benefit.title}
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-6 bg-gradient-to-r from-orange-100 to-red-100 rounded-xl border border-orange-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-300 rounded-full blur-2xl opacity-20 transform translate-x-16 -translate-y-16"></div>
        <div className="relative z-10">
          <div className="flex items-center mb-4">
            <FiZap className="w-6 h-6 text-orange-600 mr-3" />
            <h4 className="text-lg font-bold text-orange-900">Premium Partnership</h4>
          </div>
          <p className="text-orange-800 leading-relaxed">
            Join an exclusive network of businesses committed to growing the pickleball community in Mexico.
            Your partnership includes access to premium tools, marketing support, and direct connection to our
            extensive player base.
          </p>
          <div className="flex items-center mt-4 space-x-6">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
              <span className="text-sm font-medium text-orange-800">24/7 Support</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
              <span className="text-sm font-medium text-orange-800">Monthly Training</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
              <span className="text-sm font-medium text-orange-800">Priority Listing</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PartnerBenefitsSection