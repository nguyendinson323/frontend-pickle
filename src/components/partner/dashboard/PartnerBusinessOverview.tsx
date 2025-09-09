import React from 'react'
import { useNavigate } from 'react-router-dom'

interface PartnerData {
  revenueGrowth?: number
  bookingTrend?: number
}

interface PartnerBusinessOverviewProps {
  partnerData: PartnerData
}

const PartnerBusinessOverview: React.FC<PartnerBusinessOverviewProps> = ({ partnerData }) => {
  const navigate = useNavigate()

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Business Overview</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        
        <div className="text-center p-4  rounded-lg">
          <div className="text-3xl mb-2">📈</div>
          <h4 className="font-semibold text-gray-900 mb-1">Revenue Growth</h4>
          <p className="text-2xl font-bold text-green-600">+{partnerData.revenueGrowth || 0}%</p>
          <p className="text-sm text-gray-600">vs last quarter</p>
        </div>

        <div className="text-center p-4  rounded-lg">
          <div className="text-3xl mb-2">📅</div>
          <h4 className="font-semibold text-gray-900 mb-1">Booking Trends</h4>
          <p className="text-2xl font-bold text-blue-600">+{partnerData.bookingTrend || 0}%</p>
          <p className="text-sm text-gray-600">vs last month</p>
        </div>

        <div className="text-center p-4  rounded-lg">
          <div className="text-3xl mb-2">🎁</div>
          <h4 className="font-semibold text-gray-900 mb-1">Partner Benefits</h4>
          <p className="text-sm text-orange-600 font-medium">Premium Plan</p>
          <p className="text-sm text-gray-600">Full access</p>
        </div>
      </div>

      <div className="border-t pt-6">
        <h4 className="font-semibold text-gray-900 mb-4">Your Partner Benefits</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Court rental management system</span>
          </div>
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Event hosting platform</span>
          </div>
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Business microsite</span>
          </div>
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Revenue tracking tools</span>
          </div>
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Partner directory listing</span>
          </div>
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Access to player database</span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => navigate('/partner/microsite')}
          className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
        >
          Manage Business Website
        </button>
        <button
          onClick={() => navigate('/partner/support')}
          className="border border-orange-600 text-orange-600 hover:bg-orange-50 px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
        >
          Partner Support
        </button>
      </div>
    </div>
  )
}

export default PartnerBusinessOverview