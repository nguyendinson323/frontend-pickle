import React, { useState, useEffect } from 'react'
import { TimeSlot } from '../../../store/slices/courtReservationSlice'

interface CalendarViewProps {
  selectedDate: string
  onDateChange: (date: string) => void
  availableTimeSlots: TimeSlot[]
  onTimeSlotSelect: (timeSlot: TimeSlot) => void
  courtName?: string
  isAuthenticated?: boolean
}

const CalendarView: React.FC<CalendarViewProps> = ({
  selectedDate,
  onDateChange,
  availableTimeSlots,
  onTimeSlotSelect,
  courtName,
  isAuthenticated = true
}) => {
  const [currentDate, setCurrentDate] = useState(new Date(selectedDate || new Date()))
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month')

  useEffect(() => {
    if (selectedDate) {
      setCurrentDate(new Date(selectedDate))
    }
  }, [selectedDate])

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

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
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    
    return days
  }

  const getWeekDays = (date: Date) => {
    const startOfWeek = new Date(date)
    const day = startOfWeek.getDay()
    const diff = startOfWeek.getDate() - day
    startOfWeek.setDate(diff)

    const week = []
    for (let i = 0; i < 7; i++) {
      const weekDay = new Date(startOfWeek)
      weekDay.setDate(startOfWeek.getDate() + i)
      week.push(weekDay)
    }
    
    return week
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
  }

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 7)
    } else {
      newDate.setDate(newDate.getDate() + 7)
    }
    setCurrentDate(newDate)
  }

  const handleDateClick = (date: Date) => {
    const dateString = date.toISOString().split('T')[0]
    onDateChange(dateString)
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isSelected = (date: Date) => {
    const selectedDateObj = new Date(selectedDate)
    return date.toDateString() === selectedDateObj.toDateString()
  }

  const isPastDate = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const renderMonthView = () => {
    const days = getDaysInMonth(currentDate)
    
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <span className="text-lg">←</span>
          </button>
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button
              onClick={() => setViewMode('week')}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Week View
            </button>
          </div>
          <button
            onClick={() => navigateMonth('next')}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <span className="text-lg">→</span>
          </button>
        </div>

        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {dayNames.map(day => (
            <div key={day} className="bg-gray-50 p-2 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
          {days.map((day, index) => (
            <div
              key={index}
              className={`bg-white p-2 h-12 flex items-center justify-center text-sm cursor-pointer hover:bg-gray-50 ${
                day && isPastDate(day) ? 'text-gray-300 cursor-not-allowed hover:bg-white' : ''
              } ${
                day && isSelected(day) ? 'bg-green-100 text-green-800 font-semibold hover:bg-green-200' : ''
              } ${
                day && isToday(day) ? 'bg-blue-50 text-blue-800 font-semibold' : ''
              }`}
              onClick={() => day && !isPastDate(day) && handleDateClick(day)}
            >
              {day ? day.getDate() : ''}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderWeekView = () => {
    const weekDays = getWeekDays(currentDate)
    
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <button
            onClick={() => navigateWeek('prev')}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <span className="text-lg">←</span>
          </button>
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold">
              {weekDays[0].toLocaleDateString()} - {weekDays[6].toLocaleDateString()}
            </h2>
            <button
              onClick={() => setViewMode('month')}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Month View
            </button>
          </div>
          <button
            onClick={() => navigateWeek('next')}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <span className="text-lg">→</span>
          </button>
        </div>

        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {weekDays.map((day, index) => (
            <div
              key={index}
              className={`bg-white p-4 min-h-32 cursor-pointer hover:bg-gray-50 ${
                isPastDate(day) ? 'text-gray-300 cursor-not-allowed hover:bg-white' : ''
              } ${
                isSelected(day) ? 'bg-green-100 text-green-800 hover:bg-green-200' : ''
              } ${
                isToday(day) ? 'bg-blue-50 text-blue-800' : ''
              }`}
              onClick={() => !isPastDate(day) && handleDateClick(day)}
            >
              <div className="font-semibold mb-2">
                {dayNames[day.getDay()]} {day.getDate()}
              </div>
              {isSelected(day) && (
                <div className="text-xs text-gray-600">
                  Click a time slot below
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderTimeSlots = () => {
    if (!selectedDate || availableTimeSlots.length === 0) {
      return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center text-gray-500">
          {!selectedDate ? 'Select a date to view available time slots' : 'No time slots available for selected date'}
        </div>
      )
    }

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Available Times - {new Date(selectedDate).toLocaleDateString()}
          {courtName && <span className="text-gray-600"> at {courtName}</span>}
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {availableTimeSlots.map((slot, index) => (
            <button
              key={index}
              onClick={() => onTimeSlotSelect(slot)}
              disabled={!slot.available}
              className={`p-4 text-sm rounded-lg border transition-all duration-200 ${
                slot.available
                  ? 'border-green-300 bg-green-50 text-green-800 hover:bg-green-100 hover:shadow-md transform hover:scale-105'
                  : 'border-red-200 bg-red-50 text-red-400 cursor-not-allowed'
              }`}
              title={!isAuthenticated && slot.available ? 'Please log in to make a reservation' : ''}
            >
              <div className="font-medium">
                {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
              </div>
              <div className="text-xs mt-1">
                {slot.available ? `$${slot.price}` : 'Reserved'}
              </div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {viewMode === 'month' ? renderMonthView() : renderWeekView()}
      {renderTimeSlots()}
    </div>
  )
}

export default CalendarView