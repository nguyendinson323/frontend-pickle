import React, { useState } from 'react'
import {
  FiMapPin,
  FiPlus,
  FiCalendar,
  FiEdit2,
  FiTrash2,
  FiHome,
  FiSun,
  FiZap,
  FiInfo,
  FiX,
  FiAlertTriangle,
  FiEye
} from 'react-icons/fi'

interface Court {
  id: number
  name: string
  owner_type: string
  owner_id: number
  address: string
  state_id: number
  court_count: number
  surface_type: string
  indoor: boolean
  lights: boolean
  amenities: string
  description: string
  status: 'active' | 'maintenance' | 'inactive'
  created_at: string
  updated_at: string
}

interface CourtsListProps {
  courts: Court[]
  onEditCourt: (court: Court) => void
  onDeleteCourt: (courtId: number) => void
  onAddCourt: () => void
  onManageSchedule: (court: Court) => void
  onViewReservations: (court: Court) => void
}

const CourtsList: React.FC<CourtsListProps> = ({
  courts,
  onEditCourt,
  onDeleteCourt,
  onAddCourt,
  onManageSchedule,
  onViewReservations
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState<number | null>(null)

  const handleDeleteCourt = (courtId: number) => {
    onDeleteCourt(courtId)
    setShowDeleteModal(null)
  }

  if (courts.length === 0) {
    return (
      <div className="bg-white shadow-2xl rounded-3xl p-8 mb-8 border border-gray-100">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white mr-4">
              <FiMapPin className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">My Courts</h2>
          </div>
          <button
            onClick={onAddCourt}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold rounded-2xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiPlus className="h-5 w-5 mr-2" />
            Add Court
          </button>
        </div>
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <FiMapPin className="h-12 w-12 text-gray-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">No Courts Added</h3>
          <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
            Start by adding your first court to manage reservations and schedules with our comprehensive management system.
          </p>
          <button
            onClick={onAddCourt}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold rounded-2xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiPlus className="h-5 w-5 mr-2" />
            Add Your First Court
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow-2xl rounded-3xl overflow-hidden mb-8 border border-gray-100">
      <div className="flex justify-between items-center p-8 border-b-2 border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white mr-4">
            <FiMapPin className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My Courts</h2>
            <p className="text-gray-600 font-medium">{courts.length} court{courts.length > 1 ? 's' : ''} under management</p>
          </div>
        </div>
        <button
          onClick={onAddCourt}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold rounded-2xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FiPlus className="h-5 w-5 mr-2" />
          Add Court
        </button>
      </div>

      <div className="divide-y-2 divide-gray-100">
        {courts.map((court, index) => (
          <div key={court.id} className="p-8 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 transition-all duration-200 animate-table-row" style={{ animationDelay: `${index * 100}ms` }}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <FiMapPin className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{court.name}</h3>
                    <div className="flex items-center space-x-3">
                      <span className="inline-flex items-center px-3 py-1 text-sm font-bold rounded-2xl border-2 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-200 shadow-sm">
                        <FiHome className="h-4 w-4 mr-2" />
                        {court.court_count} Court{court.court_count > 1 ? 's' : ''}
                      </span>
                      {court.indoor && (
                        <span className="inline-flex items-center px-3 py-1 text-sm font-bold rounded-2xl border-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200 shadow-sm">
                          <FiHome className="h-4 w-4 mr-2" />
                          Indoor
                        </span>
                      )}
                      {court.lights && (
                        <span className="inline-flex items-center px-3 py-1 text-sm font-bold rounded-2xl border-2 bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border-yellow-200 shadow-sm">
                          <FiZap className="h-4 w-4 mr-2" />
                          Lights
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center p-3 bg-white rounded-xl border border-gray-200 shadow-sm">
                      <FiMapPin className="h-5 w-5 text-indigo-500 mr-3 flex-shrink-0" />
                      <div>
                        <span className="text-sm font-bold text-gray-700">Address:</span>
                        <p className="text-sm font-medium text-gray-900">{court.address}</p>
                      </div>
                    </div>
                    <div className="flex items-center p-3 bg-white rounded-xl border border-gray-200 shadow-sm">
                      <FiSun className="h-5 w-5 text-indigo-500 mr-3 flex-shrink-0" />
                      <div>
                        <span className="text-sm font-bold text-gray-700">Surface:</span>
                        <p className="text-sm font-medium text-gray-900">{court.surface_type}</p>
                      </div>
                    </div>
                    <div className="flex items-center p-3 bg-white rounded-xl border border-gray-200 shadow-sm">
                      <div className={`w-5 h-5 rounded-full mr-3 flex-shrink-0 ${
                        court.status === 'active' ? 'bg-green-500' :
                        court.status === 'maintenance' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                      <div>
                        <span className="text-sm font-bold text-gray-700">Status:</span>
                        <p className={`text-sm font-medium ${
                          court.status === 'active' ? 'text-green-600' :
                          court.status === 'maintenance' ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {court.status.charAt(0).toUpperCase() + court.status.slice(1)}
                        </p>
                      </div>
                    </div>
                  </div>
                  {court.description && (
                    <div className="flex items-start p-3 bg-white rounded-xl border border-gray-200 shadow-sm">
                      <FiInfo className="h-5 w-5 text-indigo-500 mr-3 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-sm font-bold text-gray-700">Description:</span>
                        <p className="text-sm font-medium text-gray-900">{court.description}</p>
                      </div>
                    </div>
                  )}
                  {court.amenities && (
                    <div className="flex items-start p-3 bg-white rounded-xl border border-gray-200 shadow-sm">
                      <FiHome className="h-5 w-5 text-indigo-500 mr-3 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-sm font-bold text-gray-700">Amenities:</span>
                        <p className="text-sm font-medium text-gray-900">{court.amenities}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col space-y-3 ml-6">
                <div className="flex space-x-3">
                  <button
                    onClick={() => onViewReservations(court)}
                    className="inline-flex items-center px-4 py-2 text-sm font-bold text-purple-700 bg-gradient-to-r from-purple-100 to-purple-200 border-2 border-purple-200 rounded-xl hover:from-purple-200 hover:to-purple-300 hover:border-purple-300 shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    <FiEye className="h-4 w-4 mr-2" />
                    Reservations
                  </button>

                  <button
                    onClick={() => onManageSchedule(court)}
                    className="inline-flex items-center px-4 py-2 text-sm font-bold text-green-700 bg-gradient-to-r from-green-100 to-green-200 border-2 border-green-200 rounded-xl hover:from-green-200 hover:to-green-300 hover:border-green-300 shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <FiCalendar className="h-4 w-4 mr-2" />
                    Schedule
                  </button>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => onEditCourt(court)}
                    className="inline-flex items-center px-4 py-2 text-sm font-bold text-blue-700 bg-gradient-to-r from-blue-100 to-blue-200 border-2 border-blue-200 rounded-xl hover:from-blue-200 hover:to-blue-300 hover:border-blue-300 shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <FiEdit2 className="h-4 w-4 mr-2" />
                    Edit
                  </button>

                  <button
                    onClick={() => setShowDeleteModal(court.id)}
                    className="inline-flex items-center px-4 py-2 text-sm font-bold text-red-700 bg-gradient-to-r from-red-100 to-red-200 border-2 border-red-200 rounded-xl hover:from-red-200 hover:to-red-300 hover:border-red-300 shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <FiTrash2 className="h-4 w-4 mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center text-white mr-4">
                <FiAlertTriangle className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Delete Court</h3>
            </div>
            <p className="text-gray-600 font-medium mb-8 leading-relaxed">
              Are you sure you want to delete this court? This action cannot be undone.
              All associated schedules and reservations will be permanently removed.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="flex-1 inline-flex items-center justify-center px-6 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                <FiX className="h-5 w-5 mr-2" />
                Cancel
              </button>
              <button
                onClick={() => handleDeleteCourt(showDeleteModal)}
                className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-2xl hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <FiTrash2 className="h-5 w-5 mr-2" />
                Delete Court
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CourtsList