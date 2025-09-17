import React from 'react'
import {
  FiFileText,
  FiDownload,
  FiBarChart2,
  FiArrowRight,
  FiDatabase,
  FiClock,
  FiRefreshCw,
  FiInfo
} from 'react-icons/fi'

const ReportsTable: React.FC = () => {
  return (
    <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white mr-4">
            <FiFileText className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Report History</h3>
            <p className="text-gray-600 font-medium">View and manage previously generated reports</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        <div className="text-center py-16">
          {/* Icon Container */}
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-100 to-indigo-200 rounded-3xl flex items-center justify-center mb-6 shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white">
                <FiDatabase className="h-8 w-8" />
              </div>
            </div>
            <div className="flex justify-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                <FiBarChart2 className="h-6 w-6 text-green-600" />
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                <FiDownload className="h-6 w-6 text-purple-600" />
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center">
                <FiClock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>

          {/* Main Message */}
          <div className="max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">No Report History Available</h3>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-2xl p-6 border-2 border-blue-200 mb-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white flex-shrink-0 mt-1">
                  <FiInfo className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <p className="text-lg font-bold text-blue-900 mb-2">Real-time Report Generation</p>
                  <p className="text-blue-700 font-medium leading-relaxed">
                    Reports are generated and downloaded directly to maintain data security.
                    The system creates fresh reports with the latest data each time you request them.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 border-2 border-green-200 shadow-lg transform hover:scale-105 transition-all duration-200">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white mr-3">
                    <FiBarChart2 className="h-6 w-6" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900">Generate New Report</h4>
                </div>
                <p className="text-green-700 font-medium mb-4 leading-relaxed">
                  Create comprehensive reports with custom filters and data fields
                </p>
                <div className="flex items-center text-green-600 font-bold">
                  <span>Go to Generate Reports</span>
                  <FiArrowRight className="ml-2 h-4 w-4" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-2xl p-6 border-2 border-purple-200 shadow-lg transform hover:scale-105 transition-all duration-200">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white mr-3">
                    <FiRefreshCw className="h-6 w-6" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900">Real-time Data</h4>
                </div>
                <p className="text-purple-700 font-medium mb-4 leading-relaxed">
                  Always get the most current data with instant report generation
                </p>
                <div className="flex items-center text-purple-600 font-bold">
                  <span>Fresh data every time</span>
                  <FiRefreshCw className="ml-2 h-4 w-4" />
                </div>
              </div>
            </div>

            {/* Benefits List */}
            <div className="mt-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border-2 border-gray-200">
              <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <FiDatabase className="mr-2 h-5 w-5" />
                Report Generation Benefits
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-md">
                  <div className="flex items-center mb-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white mr-2">
                      <FiBarChart2 className="h-3 w-3" />
                    </div>
                    <span className="font-bold text-gray-900">Current Data</span>
                  </div>
                  <p className="text-gray-600 font-medium">Always includes the latest information</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-md">
                  <div className="flex items-center mb-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center text-white mr-2">
                      <FiDownload className="h-3 w-3" />
                    </div>
                    <span className="font-bold text-gray-900">Instant Download</span>
                  </div>
                  <p className="text-gray-600 font-medium">Direct download without storage delays</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-md">
                  <div className="flex items-center mb-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center text-white mr-2">
                      <FiDatabase className="h-3 w-3" />
                    </div>
                    <span className="font-bold text-gray-900">Data Security</span>
                  </div>
                  <p className="text-gray-600 font-medium">No sensitive data stored on servers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReportsTable