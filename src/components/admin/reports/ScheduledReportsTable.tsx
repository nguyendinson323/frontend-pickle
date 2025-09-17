import React from 'react'
import {
  FiClock,
  FiCalendar,
  FiSettings,
  FiBarChart2,
  FiPlayCircle,
  FiPauseCircle,
  FiInfo,
  FiArrowRight,
  FiRefreshCw,
  FiCheckCircle,
  FiAlertCircle
} from 'react-icons/fi'

const ScheduledReportsTable: React.FC = () => {
  return (
    <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white mr-4">
            <FiClock className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Scheduled Reports</h3>
            <p className="text-gray-600 font-medium">Automated report generation and delivery</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        <div className="text-center py-16">
          {/* Icon Container */}
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-orange-100 to-yellow-200 rounded-3xl flex items-center justify-center mb-6 shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-yellow-600 rounded-2xl flex items-center justify-center text-white">
                <FiCalendar className="h-8 w-8" />
              </div>
            </div>
            <div className="flex justify-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                <FiClock className="h-6 w-6 text-blue-600" />
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                <FiPlayCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                <FiSettings className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Main Message */}
          <div className="max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Scheduled Reports Coming Soon</h3>
            <div className="bg-gradient-to-r from-orange-50 to-yellow-100 rounded-2xl p-6 border-2 border-orange-200 mb-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white flex-shrink-0 mt-1">
                  <FiInfo className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <p className="text-lg font-bold text-orange-900 mb-2">Feature in Development</p>
                  <p className="text-orange-700 font-medium leading-relaxed">
                    Scheduled reporting functionality is currently under development.
                    This feature will allow you to automate report generation and delivery on custom schedules.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature Preview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 border-2 border-blue-200 shadow-lg transform hover:scale-105 transition-all duration-200">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white mr-3">
                    <FiCalendar className="h-6 w-6" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900">Automated Scheduling</h4>
                </div>
                <p className="text-blue-700 font-medium mb-4 leading-relaxed">
                  Set up daily, weekly, or monthly report generation with custom timing
                </p>
                <div className="flex items-center text-blue-600 font-bold">
                  <span>Coming Soon</span>
                  <FiArrowRight className="ml-2 h-4 w-4" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 border-2 border-green-200 shadow-lg transform hover:scale-105 transition-all duration-200">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white mr-3">
                    <FiRefreshCw className="h-6 w-6" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900">Auto-Delivery</h4>
                </div>
                <p className="text-green-700 font-medium mb-4 leading-relaxed">
                  Automatic email delivery of reports to specified recipients
                </p>
                <div className="flex items-center text-green-600 font-bold">
                  <span>In Planning</span>
                  <FiRefreshCw className="ml-2 h-4 w-4" />
                </div>
              </div>
            </div>

            {/* Planned Features */}
            <div className="mt-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border-2 border-gray-200">
              <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <FiSettings className="mr-2 h-5 w-5" />
                Planned Features
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-md">
                  <div className="flex items-center mb-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white mr-2">
                      <FiClock className="h-3 w-3" />
                    </div>
                    <span className="font-bold text-gray-900">Custom Schedules</span>
                  </div>
                  <p className="text-gray-600 font-medium">Flexible timing options for report generation</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-md">
                  <div className="flex items-center mb-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center text-white mr-2">
                      <FiCheckCircle className="h-3 w-3" />
                    </div>
                    <span className="font-bold text-gray-900">Success Tracking</span>
                  </div>
                  <p className="text-gray-600 font-medium">Monitor delivery status and history</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-md">
                  <div className="flex items-center mb-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center text-white mr-2">
                      <FiAlertCircle className="h-3 w-3" />
                    </div>
                    <span className="font-bold text-gray-900">Failure Alerts</span>
                  </div>
                  <p className="text-gray-600 font-medium">Notifications when scheduled reports fail</p>
                </div>
              </div>
            </div>

            {/* Current Alternative */}
            <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-100 rounded-2xl p-6 border-2 border-indigo-200">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white mr-3">
                  <FiBarChart2 className="h-4 w-4" />
                </div>
                <h4 className="text-xl font-bold text-gray-900">Current Solution</h4>
              </div>
              <p className="text-indigo-700 font-medium mb-4 leading-relaxed">
                While waiting for scheduled reports, you can generate reports instantly using the
                "Generate Reports" tab with current data and custom filters.
              </p>
              <div className="flex items-center text-indigo-600 font-bold">
                <span>Generate reports now</span>
                <FiArrowRight className="ml-2 h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ScheduledReportsTable