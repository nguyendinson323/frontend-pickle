import React, { useState, useEffect } from 'react'

interface CourtReservation {
  id: number
  court_id: number
  player_id: number
  date: string
  start_time: string
  end_time: string
  status: 'pending' | 'confirmed' | 'canceled'
  amount: number
  payment_status: 'pending' | 'paid' | 'refunded'
  player: {
    id: number
    full_name: string
    profile_photo_url: string | null
  }
}

interface CourtCalendarViewProps {
  reservations: CourtReservation[]
  selectedCourtId?: number
}

const CourtCalendarView: React.FC<CourtCalendarViewProps> = ({
  reservations,
  selectedCourtId
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())

  // Generate time slots from 6 AM to 10 PM (30-minute intervals)
  const generateTimeSlots = () => {
    const slots = []
    for (let hour = 6; hour < 22; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00:00`)
      slots.push(`${hour.toString().padStart(2, '0')}:30:00`)
    }
    return slots
  }

  const timeSlots = generateTimeSlots()

  // Get reservations for selected date and court
  const getDayReservations = () => {
    const selectedDateStr = selectedDate.toISOString().split('T')[0]
    return reservations.filter(res =>
      res.date === selectedDateStr &&
      (selectedCourtId ? res.court_id === selectedCourtId : true) &&
      res.status !== 'canceled'
    )
  }

  // Check if a time slot is reserved
  const isSlotReserved = (timeSlot: string) => {
    const dayReservations = getDayReservations()
    return dayReservations.find(res => {
      const startTime = res.start_time
      const endTime = res.end_time
      return timeSlot >= startTime && timeSlot < endTime
    })
  }

  // Format time for display
  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  // Calendar navigation
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }

  const days = getDaysInMonth(currentMonth)
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const isToday = (date: Date | null) => {
    if (!date) return false
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isSelectedDate = (date: Date | null) => {
    if (!date) return false
    return date.toDateString() === selectedDate.toDateString()
  }

  const hasReservations = (date: Date | null) => {
    if (!date) return false
    const dateStr = date.toISOString().split('T')[0]
    return reservations.some(res =>
      res.date === dateStr &&
      (selectedCourtId ? res.court_id === selectedCourtId : true) &&
      res.status !== 'canceled'
    )
  }

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Court Reservation Calendar</h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calendar */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-medium text-gray-900">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h4>
              <div className="flex space-x-1">
                <button
                  onClick={previousMonth}
                  className="p-2 hover:bg-gray-100 rounded-md"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextMonth}
                  className="p-2 hover:bg-gray-100 rounded-md"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-2 text-xs font-medium text-gray-500 text-center">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {days.map((date, index) => (
                <div key={index} className="h-10">
                  {date && (
                    <button
                      onClick={() => setSelectedDate(date)}
                      className={`w-full h-full text-sm rounded-md transition-colors duration-200 relative ${
                        isSelectedDate(date)
                          ? 'bg-indigo-600 text-white'
                          : isToday(date)
                          ? 'bg-indigo-100 text-indigo-600'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      {date.getDate()}
                      {hasReservations(date) && (
                        <div className={`absolute bottom-0 right-0 w-2 h-2 rounded-full ${
                          isSelectedDate(date) ? 'bg-white' : 'bg-indigo-600'
                        }`} />
                      )}
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 text-xs text-gray-500">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></div>
                  <span>Has reservations</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-indigo-100 rounded-full mr-2"></div>
                  <span>Today</span>
                </div>
              </div>
            </div>
          </div>

          {/* Time Slots */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-medium text-gray-900">
                Available Time Slots - {selectedDate.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </h4>
            </div>

            <div className="max-h-96 overflow-y-auto">
              <div className="grid grid-cols-2 gap-2">
                {timeSlots.map((slot) => {
                  const reservation = isSlotReserved(slot)
                  return (
                    <div
                      key={slot}
                      className={`p-2 rounded-md border text-sm text-center ${
                        reservation
                          ? 'bg-red-50 border-red-200 text-red-700'
                          : 'bg-green-50 border-green-200 text-green-700'
                      }`}
                    >
                      <div className="font-medium">
                        {formatTime(slot)}
                      </div>
                      {reservation ? (
                        <div className="text-xs mt-1">
                          Reserved by {reservation.player.full_name}
                        </div>
                      ) : (
                        <div className="text-xs mt-1">Available</div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="mt-4 text-xs text-gray-500">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-50 border border-green-200 rounded mr-2"></div>
                  <span>Available</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-50 border border-red-200 rounded mr-2"></div>
                  <span>Reserved</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourtCalendarView