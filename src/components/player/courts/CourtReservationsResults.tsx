import React from 'react'
import CalendarView from './CalendarView'
import { Court, TimeSlot } from '../../../store/slices/courtReservationSlice'
import {
  FiMapPin,
  FiDollarSign,
  FiUsers,
  FiHome,
  FiSun,
  FiLayers,
  FiSearch,
  FiCalendar
} from 'react-icons/fi'

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
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl border border-gray-200 p-12 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
          <FiSearch className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Find Your Perfect Court</h3>
        <p className="text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
          Use the filters above to search for pickleball courts near you.
          Select your preferences and click "Search Courts" to get started.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Courts List */}
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-green-600 to-blue-700 rounded-2xl p-6 text-white">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mr-4">
              <FiMapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">
                Courts Found ({courts.length})
              </h3>
              <p className="text-green-100">Select a court to view availability</p>
            </div>
          </div>
        </div>
        
        {courts.length === 0 ? (
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <FiSearch className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No courts found</h3>
            <p className="text-lg text-gray-600 mb-6 max-w-md mx-auto">No courts match your current search criteria.</p>
            <p className="text-sm text-gray-500 bg-gray-100 rounded-2xl px-6 py-3 inline-block">
              Try adjusting your filters or expanding your search area.
            </p>
          </div>
        ) : (
          courts.map(court => (
            <div
              key={court.id}
              className={`bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg border-2 cursor-pointer transition-all duration-300 hover:transform hover:scale-105 hover:shadow-xl ${
                selectedCourt?.id === court.id
                  ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 shadow-xl transform scale-105'
                  : 'border-gray-200 hover:border-green-400'
              }`}
              onClick={() => onCourtSelect(court.id)}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-start mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mr-3 flex-shrink-0">
                        <FiMapPin className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-gray-900 mb-1">{court.name}</h4>
                        <p className="text-sm text-gray-600 flex items-center">
                          <FiMapPin className="w-4 h-4 mr-1" />
                          {court.address}
                        </p>
                      </div>
                    </div>

                    {court.owner && (
                      <div className="bg-blue-100 rounded-2xl px-4 py-2 mb-4">
                        <p className="text-sm text-blue-800 font-medium flex items-center">
                          <FiUsers className="w-4 h-4 mr-2" />
                          Managed by {court.owner.name} ({court.owner.type === 'club' ? 'Club' : 'Partner'})
                        </p>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-3 mt-4">
                      <div className="inline-flex items-center bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 px-4 py-2 rounded-2xl text-sm font-medium">
                        <FiLayers className="w-4 h-4 mr-2" />
                        {court.surface_type || 'Mixed surface'}
                      </div>
                      <div className={`inline-flex items-center px-4 py-2 rounded-2xl text-sm font-medium ${
                        court.indoor
                          ? 'bg-gradient-to-r from-blue-100 to-indigo-200 text-blue-800'
                          : 'bg-gradient-to-r from-green-100 to-emerald-200 text-green-800'
                      }`}>
                        <FiHome className="w-4 h-4 mr-2" />
                        {court.indoor ? 'Indoor' : 'Outdoor'}
                      </div>
                      {court.lights && (
                        <div className="inline-flex items-center bg-gradient-to-r from-yellow-100 to-amber-200 text-yellow-800 px-4 py-2 rounded-2xl text-sm font-medium">
                          <FiSun className="w-4 h-4 mr-2" />
                          Lit Courts
                        </div>
                      )}
                      {court.court_count > 1 && (
                        <div className="inline-flex items-center bg-gradient-to-r from-purple-100 to-pink-200 text-purple-800 px-4 py-2 rounded-2xl text-sm font-medium">
                          <FiUsers className="w-4 h-4 mr-2" />
                          {court.court_count} Courts
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-4">
                    {court.hourlyRate && (
                      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-2xl">
                        <div className="flex items-center">
                          <FiDollarSign className="w-4 h-4 mr-1" />
                          <span className="text-lg font-bold">${court.hourlyRate}/hr</span>
                        </div>
                      </div>
                    )}
                    {court.distance && (
                      <div className="bg-gray-100 text-gray-700 px-3 py-2 rounded-2xl text-sm font-medium">
                        <div className="flex items-center">
                          <FiMapPin className="w-4 h-4 mr-1" />
                          {court.distance} km away
                        </div>
                      </div>
                    )}
                  </div>

                  <div className={`px-4 py-2 rounded-2xl text-sm font-bold ${
                    selectedCourt?.id === court.id
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}>
                    {selectedCourt?.id === court.id ? 'Selected' : 'Select'}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Court Details and Booking */}
      <div>
        {selectedCourt ? (
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-6 text-white">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mr-4">
                  <FiCalendar className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-1">
                    Book {selectedCourt.name}
                  </h3>
                  <p className="text-blue-100">Select your preferred time slot</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <CalendarView
                selectedDate={selectedDate}
                onDateChange={onDateChange}
                availableTimeSlots={availableTimeSlots}
                onTimeSlotSelect={(timeSlot) => onTimeSlotSelect(selectedCourt.id, timeSlot)}
                courtName={selectedCourt.name}
                isAuthenticated={isAuthenticated}
              />
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <FiCalendar className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Ready to Book?</h3>
            <p className="text-gray-600 text-lg">Select a court to view availability and book your session</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CourtReservationsResults