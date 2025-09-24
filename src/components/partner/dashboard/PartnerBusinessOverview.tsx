import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FiTrendingUp,
  FiCalendar,
  FiGift,
  FiCheckCircle,
  FiGlobe,
  FiInbox,
  FiPieChart
} from 'react-icons/fi'

interface PartnerData {
  stats: {
    revenue_growth?: number
    booking_trend?: number
  }
}

interface PartnerBusinessOverviewProps {
  partnerData: PartnerData
}

const PartnerBusinessOverview: React.FC<PartnerBusinessOverviewProps> = ({ partnerData }) => {
  const navigate = useNavigate()

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-2xl rounded-3xl p-8">
      <div className="flex items-center mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-orange-700 rounded-2xl flex items-center justify-center mr-4">
          <FiPieChart className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-3xl font-bold text-gray-900">Business Overview</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300">
          <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiTrendingUp className="w-8 h-8 text-white" />
          </div>
          <h4 className="font-bold text-green-800 mb-2">Revenue Growth</h4>
          <p className="text-3xl font-bold text-green-900 mb-1">+{partnerData.stats.revenue_growth || 0}%</p>
          <p className="text-sm font-medium text-green-700">vs last quarter</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiCalendar className="w-8 h-8 text-white" />
          </div>
          <h4 className="font-bold text-blue-800 mb-2">Booking Trends</h4>
          <p className="text-3xl font-bold text-blue-900 mb-1">+{partnerData.stats.booking_trend || 0}%</p>
          <p className="text-sm font-medium text-blue-700">vs last month</p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-50 border border-orange-200 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-orange-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiGift className="w-8 h-8 text-white" />
          </div>
          <h4 className="font-bold text-orange-800 mb-2">Partner Benefits</h4>
          <p className="text-sm font-bold text-orange-700 mb-1">Premium Plan</p>
          <p className="text-sm font-medium text-orange-600">Full access</p>
        </div>
      </div>

      <div className="border-t-2 border-gray-200 pt-8">
        <h4 className="text-2xl font-bold text-gray-900 mb-6">Your Partner Benefits</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="flex items-center p-3 bg-gradient-to-r from-gray-50 to-white rounded-2xl">
            <FiCheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
            <span className="font-medium text-gray-800">Court rental management system</span>
          </div>
          <div className="flex items-center p-3 bg-gradient-to-r from-gray-50 to-white rounded-2xl">
            <FiCheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
            <span className="font-medium text-gray-800">Event hosting platform</span>
          </div>
          <div className="flex items-center p-3 bg-gradient-to-r from-gray-50 to-white rounded-2xl">
            <FiCheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
            <span className="font-medium text-gray-800">Business microsite</span>
          </div>
          <div className="flex items-center p-3 bg-gradient-to-r from-gray-50 to-white rounded-2xl">
            <FiCheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
            <span className="font-medium text-gray-800">Revenue tracking tools</span>
          </div>
          <div className="flex items-center p-3 bg-gradient-to-r from-gray-50 to-white rounded-2xl">
            <FiCheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
            <span className="font-medium text-gray-800">Partner directory listing</span>
          </div>
          <div className="flex items-center p-3 bg-gradient-to-r from-gray-50 to-white rounded-2xl">
            <FiCheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
            <span className="font-medium text-gray-800">Access to player database</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => navigate('/partner/microsite')}
          className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl hover:transform hover:scale-105 flex items-center justify-center"
        >
          <FiGlobe className="w-5 h-5 mr-2" />
          Manage Business Website
        </button>
        <button
          onClick={() => navigate('/partner/inbox')}
          className="border-2 border-orange-600 text-orange-600 hover:bg-orange-50 font-bold py-3 px-6 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl hover:transform hover:scale-105 flex items-center justify-center"
        >
          <FiInbox className="w-5 h-5 mr-2" />
          Partner Inbox
        </button>
      </div>
    </div>
  )
}

export default PartnerBusinessOverview