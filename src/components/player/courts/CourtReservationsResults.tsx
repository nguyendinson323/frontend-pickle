import React from 'react'

interface Court {
  id: number
  name: string
  address: string
  surface_type?: string
  indoor: boolean
  lights?: boolean
  hourlyRate?: number
  distance?: number
}

interface TimeSlot {
  start_time: string
  end_time: string
  price: number
  available: boolean
}

interface CourtReservationsResultsProps {
  searchPerformed: boolean
  courts: Court[]
  selectedCourt: Court | null
  selectedDate: string
  availableTimeSlots: TimeSlot[]
  onCourtSelect: (courtId: number) => void
  onDateChange: (date: string) => void
  onTimeSlotSelect: (courtId: number, timeSlot: TimeSlot) => void
}

const CourtReservationsResults: React.FC<CourtReservationsResultsProps> = ({
  searchPerformed,
  courts,
  selectedCourt,
  selectedDate,
  availableTimeSlots,
  onCourtSelect,
  onDateChange,
  onTimeSlotSelect
}) => {
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  if (!searchPerformed) {
    return null
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Courts List */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">
          Courts Found ({courts.length})
        </h3>
        
        {courts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <p className="text-gray-500">No courts found matching your criteria.</p>
          </div>
        ) : (
          courts.map(court => (
            <div
              key={court.id}
              className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer hover:border-green-500 transition-colors ${
                selectedCourt?.id === court.id ? 'border-green-500 bg-green-50' : ''
              }`}
              onClick={() => onCourtSelect(court.id)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-lg font-medium text-gray-900">{court.name}</h4>
                  <p className="text-sm text-gray-600">{court.address}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <span>{court.surface_type || 'Mixed'}</span>
                    <span>{court.indoor ? 'Indoor' : 'Outdoor'}</span>
                    {court.lights && <span>🔆 Lit</span>}
                  </div>
                </div>
                <div className="text-right">
                  {court.hourlyRate && (
                    <p className="text-lg font-semibold text-green-600">
                      ${court.hourlyRate}/hr
                    </p>
                  )}
                  {court.distance && (
                    <p className="text-sm text-gray-500">{court.distance} km away</p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Court Details and Booking */}
      <div>
        {selectedCourt ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Book {selectedCourt.name}
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => onDateChange(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Available Times</h4>
              <div className="grid grid-cols-2 gap-2">
                {availableTimeSlots.map((slot, index) => (
                  <button
                    key={index}
                    onClick={() => onTimeSlotSelect(selectedCourt.id, slot)}
                    disabled={!slot.available}
                    className={`p-3 text-sm rounded-md border transition-colors ${
                      slot.available
                        ? 'border-green-300 bg-green-50 text-green-700 hover:bg-green-100'
                        : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <div>{formatTime(slot.start_time)} - {formatTime(slot.end_time)}</div>
                    <div className="text-xs">${slot.price}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <p className="text-gray-500">Select a court to view availability and book</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CourtReservationsResults