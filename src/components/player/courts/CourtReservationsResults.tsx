import React from 'react'
import CalendarView from './CalendarView'
import { Court, TimeSlot } from '../../../store/slices/courtReservationSlice'

interface CourtReservationsResultsProps {
  searchPerformed: boolean
  courts: Court[]
  selectedCourt: Court | null
  selectedDate: string
  availableTimeSlots: TimeSlot[]
  onCourtSelect: (courtId: number) => void
  onDateChange: (date: string) => void
  onTimeSlotSelect: (courtId: number, timeSlot: TimeSlot) => void
  isAuthenticated?: boolean
}

const CourtReservationsResults: React.FC<CourtReservationsResultsProps> = ({
  searchPerformed,
  courts,
  selectedCourt,
  selectedDate,
  availableTimeSlots,
  onCourtSelect,
  onDateChange,
  onTimeSlotSelect,
  isAuthenticated = true
}) => {
  if (!searchPerformed) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div className="text-gray-500 mb-4">
          <span className="text-4xl">🏓</span>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Find Your Perfect Court</h3>
        <p className="text-gray-600">
          Use the filters above to search for pickleball courts near you.
          Select your preferences and click "Search Courts" to get started.
        </p>
      </div>
    )
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
            <div className="text-gray-400 mb-4">
              <span className="text-4xl">🔍</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courts found</h3>
            <p className="text-gray-500 mb-4">No courts match your current search criteria.</p>
            <p className="text-sm text-gray-400">
              Try adjusting your filters or expanding your search area.
            </p>
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
                  <p className="text-sm text-gray-600 mb-2">{court.address}</p>
                  {court.owner && (
                    <p className="text-xs text-blue-600 mb-2">
                      Managed by {court.owner.name} ({court.owner.type === 'club' ? 'Club' : 'Partner'})
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">
                      {court.surface_type || 'Mixed surface'}
                    </span>
                    <span className={`px-2 py-1 rounded ${court.indoor ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                      {court.indoor ? '🏢 Indoor' : '🌤️ Outdoor'}
                    </span>
                    {court.lights && (
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                        💡 Lit courts
                      </span>
                    )}
                    {court.court_count > 1 && (
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                        {court.court_count} courts
                      </span>
                    )}
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
            
            <CalendarView
              selectedDate={selectedDate}
              onDateChange={onDateChange}
              availableTimeSlots={availableTimeSlots}
              onTimeSlotSelect={(timeSlot) => onTimeSlotSelect(selectedCourt.id, timeSlot)}
              courtName={selectedCourt.name}
              isAuthenticated={isAuthenticated}
            />
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