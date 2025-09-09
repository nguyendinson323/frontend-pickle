import React from 'react'

const CourtReservationsHeader: React.FC = () => {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Court Reservations</h1>
            <p className="text-gray-600">Find and book pickleball courts</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourtReservationsHeader