import React, { useState, useEffect } from 'react'
import { TimeSlot } from '../../../store/slices/courtReservationSlice'
import {
  FiCalendar,
  FiClock,
  FiChevronLeft,
  FiChevronRight,
  FiGrid,
  FiColumns,
  FiDollarSign
} from 'react-icons/fi'

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
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-blue-700 p-6 text-white">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigateMonth('prev')}
              className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors"
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <FiCalendar className="w-6 h-6 mr-3" />
                <h2 className="text-2xl font-bold">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
              </div>
              <button
                onClick={() => setViewMode('week')}
                className="inline-flex items-center px-4 py-2 bg-white bg-opacity-20 rounded-2xl hover:bg-opacity-30 transition-colors font-medium"
              >
                <FiColumns className="w-4 h-4 mr-2" />
                Week View
              </button>
            </div>
            <button
              onClick={() => navigateMonth('next')}
              className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors"
            >
              <FiChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-7 gap-2 mb-4">
            {dayNames.map(day => (
              <div key={day} className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl p-3 text-center text-sm font-bold text-gray-700">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {days.map((day, index) => (
              <div
                key={index}
                className={`h-12 flex items-center justify-center text-sm font-medium rounded-xl transition-all duration-300 ${
                  !day
                    ? ''
                    : isPastDate(day)
                    ? 'text-gray-300 cursor-not-allowed bg-gray-100'
                    : isSelected(day)
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold shadow-lg transform scale-110 cursor-pointer'
                    : isToday(day)
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold cursor-pointer hover:shadow-lg hover:transform hover:scale-105'
                    : 'bg-white border-2 border-gray-200 text-gray-700 cursor-pointer hover:border-green-400 hover:bg-green-50 hover:text-green-700 hover:transform hover:scale-105'
                }`}
                onClick={() => day && !isPastDate(day) && handleDateClick(day)}
              >
                {day ? day.getDate() : ''}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const renderWeekView = () => {
    const weekDays = getWeekDays(currentDate)

    return (
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-pink-700 p-6 text-white">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigateWeek('prev')}
              className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors"
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <FiColumns className="w-6 h-6 mr-3" />
                <h2 className="text-2xl font-bold">
                  {weekDays[0].toLocaleDateString()} - {weekDays[6].toLocaleDateString()}
                </h2>
              </div>
              <button
                onClick={() => setViewMode('month')}
                className="inline-flex items-center px-4 py-2 bg-white bg-opacity-20 rounded-2xl hover:bg-opacity-30 transition-colors font-medium"
              >
                <FiGrid className="w-4 h-4 mr-2" />
                Month View
              </button>
            </div>
            <button
              onClick={() => navigateWeek('next')}
              className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors"
            >
              <FiChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-7 gap-3">
            {weekDays.map((day, index) => (
              <div
                key={index}
                className={`rounded-2xl p-6 min-h-32 transition-all duration-300 cursor-pointer ${
                  isPastDate(day)
                    ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                    : isSelected(day)
                    ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-xl transform scale-105'
                    : isToday(day)
                    ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg hover:shadow-xl hover:transform hover:scale-105'
                    : 'bg-white border-2 border-gray-200 hover:border-purple-400 hover:bg-purple-50 hover:transform hover:scale-105 shadow-md'
                }`}
                onClick={() => !isPastDate(day) && handleDateClick(day)}
              >
                <div className="font-bold text-lg mb-3">
                  {dayNames[day.getDay()]}
                </div>
                <div className={`text-2xl font-bold mb-2 ${
                  isSelected(day) || isToday(day) ? 'text-white' : 'text-gray-700'
                }`}>
                  {day.getDate()}
                </div>
                {isSelected(day) && (
                  <div className="text-sm opacity-90 bg-white bg-opacity-20 rounded-xl px-3 py-2">
                    Selected
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const renderTimeSlots = () => {
    if (!selectedDate || availableTimeSlots.length === 0) {
      return (
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <FiClock className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            {!selectedDate ? 'Select a Date' : 'No Time Slots'}
          </h3>
          <p className="text-gray-600 text-lg">
            {!selectedDate ? 'Select a date to view available time slots' : 'No time slots available for selected date'}
          </p>
        </div>
      )
    }

    return (
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-yellow-600 p-6 text-white">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mr-4">
              <FiClock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-1">
                Available Times
              </h3>
              <p className="text-orange-100">
                {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                {courtName && <span> at {courtName}</span>}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableTimeSlots.map((slot, index) => (
              <button
                key={index}
                onClick={() => onTimeSlotSelect(slot)}
                disabled={!slot.available}
                className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                  slot.available
                    ? 'border-green-300 bg-gradient-to-br from-green-50 to-emerald-100 text-green-800 hover:from-green-100 hover:to-emerald-200 hover:shadow-xl hover:transform hover:scale-105 hover:border-green-400'
                    : 'border-red-200 bg-gradient-to-br from-red-50 to-pink-100 text-red-400 cursor-not-allowed opacity-60'
                }`}
                title={!isAuthenticated && slot.available ? 'Please log in to make a reservation' : ''}
              >
                <div className="flex items-center mb-3">
                  <FiClock className="w-5 h-5 mr-3" />
                  <div className="text-lg font-bold">
                    {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className={`inline-flex items-center px-3 py-1 rounded-xl text-sm font-medium ${
                    slot.available
                      ? 'bg-green-200 text-green-800'
                      : 'bg-red-200 text-red-600'
                  }`}>
                    {slot.available ? 'Available' : 'Reserved'}
                  </div>
                  {slot.available && (
                    <div className="inline-flex items-center bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-xl text-sm font-bold">
                      <FiDollarSign className="w-4 h-4 mr-1" />
                      ${slot.price}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
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