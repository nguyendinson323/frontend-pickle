import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FiActivity, FiChevronRight, FiInbox } from 'react-icons/fi'

interface Activity {
  icon: string
  message: string
  time: string
}

interface StateRecentActivityProps {
  recentActivity: Activity[]
}

const StateRecentActivity: React.FC<StateRecentActivityProps> = ({ recentActivity }) => {
  const navigate = useNavigate()

  return (
    <div className="bg-white rounded-3xl shadow-2xl border-2 border-gray-100 p-8">
      <div className="flex items-center mb-8">
        <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mr-4 shadow-xl">
          <FiActivity className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900">Recent Activity</h3>
      </div>
      {recentActivity.length > 0 ? (
        <div className="space-y-6">
          {recentActivity.slice(0, 4).map((activity, index) => (
            <div key={index} className="bg-gradient-to-r from-gray-50 to-white p-6 border-2 border-gray-200 rounded-3xl hover:shadow-lg transition-all duration-300">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                  <span className="text-2xl">{activity.icon}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 mb-2 leading-relaxed">{activity.message}</p>
                  <div className="flex items-center text-gray-500">
                    <FiActivity className="w-4 h-4 mr-2" />
                    <p className="text-xs font-medium">{activity.time}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={() => navigate('/state/activity')}
            className="flex items-center text-green-600 hover:text-green-700 text-sm font-bold group transition-colors duration-300"
          >
            View all activity
            <FiChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
            <FiInbox className="w-10 h-10 text-white" />
          </div>
          <h4 className="text-xl font-bold text-gray-900 mb-2">No Recent Activity</h4>
          <p className="text-gray-600 font-medium">Activity will appear here as things happen</p>
        </div>
      )}
    </div>
  )
}

export default StateRecentActivity