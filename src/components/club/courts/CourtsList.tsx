import React, { useState } from 'react'

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
      <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">My Courts</h2>
          <button
            onClick={onAddCourt}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200"
          >
            Add Court
          </button>
        </div>
        <div className="text-center py-8">
          <div className="text-gray-500">
            <div className="text-4xl mb-4">🏟️</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Courts Added</h3>
            <p className="text-gray-600 mb-4">
              Start by adding your first court to manage reservations and schedules.
            </p>
            <button
              onClick={onAddCourt}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200"
            >
              Add Your First Court
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-6">
      <div className="flex justify-between items-center p-6 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">My Courts ({courts.length})</h2>
        <button
          onClick={onAddCourt}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200"
        >
          Add Court
        </button>
      </div>

      <div className="divide-y divide-gray-200">
        {courts.map((court) => (
          <div key={court.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-medium text-gray-900">{court.name}</h3>
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    {court.court_count} Court{court.court_count > 1 ? 's' : ''}
                  </span>
                  {court.indoor && (
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Indoor
                    </span>
                  )}
                  {court.lights && (
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Lights
                    </span>
                  )}
                </div>
                
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex items-center space-x-4">
                    <span>
                      <span className="font-medium">Address:</span> {court.address}
                    </span>
                    <span>
                      <span className="font-medium">Surface:</span> {court.surface_type}
                    </span>
                    <span className={`font-medium ${
                      court.status === 'active' ? 'text-green-600' : 
                      court.status === 'maintenance' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      Status: {court.status.charAt(0).toUpperCase() + court.status.slice(1)}
                    </span>
                  </div>
                  {court.description && (
                    <div>
                      <span className="font-medium">Description:</span> {court.description}
                    </div>
                  )}
                  {court.amenities && (
                    <div>
                      <span className="font-medium">Amenities:</span> {court.amenities}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => onViewReservations(court)}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200"
                >
                  Reservations
                </button>
                
                <button
                  onClick={() => onManageSchedule(court)}
                  className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-200"
                >
                  Schedule
                </button>
                
                <button
                  onClick={() => onEditCourt(court)}
                  className="px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors duration-200"
                >
                  Edit
                </button>
                
                <button
                  onClick={() => setShowDeleteModal(court.id)}
                  className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Court</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this court? This action cannot be undone. 
              All associated schedules and reservations will be removed.
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteCourt(showDeleteModal)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
              >
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