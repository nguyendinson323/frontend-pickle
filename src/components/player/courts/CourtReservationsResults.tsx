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
            
            <CalendarView
              selectedDate={selectedDate}
              onDateChange={onDateChange}
              availableTimeSlots={availableTimeSlots}
              onTimeSlotSelect={(timeSlot) => onTimeSlotSelect(selectedCourt.id, timeSlot)}
              courtName={selectedCourt.name}
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