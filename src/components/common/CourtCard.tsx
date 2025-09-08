import React from 'react'

interface CourtCardProps {
  name: string
  location: string
  address: string
  surface: string
  courtType: 'indoor' | 'outdoor'
  pricePerHour: number
  amenities: string[]
  rating: number
  totalReviews: number
  availability: 'available' | 'busy' | 'closed'
  distance?: number
  images?: string[]
  onBook?: () => void
  onViewDetails?: () => void
}

export const CourtCard: React.FC<CourtCardProps> = ({
  name,
  location,
  address,
  surface,
  courtType,
  pricePerHour,
  amenities,
  rating,
  totalReviews,
  availability,
  distance,
  images,
  onBook,
  onViewDetails
}) => {
  const getAvailabilityColor = () => {
    switch (availability) {
      case 'available': return 'bg-green-100 text-green-800'
      case 'busy': return 'bg-yellow-100 text-yellow-800'
      case 'closed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getAvailabilityText = () => {
    switch (availability) {
      case 'available': return 'Available'
      case 'busy': return 'Busy'
      case 'closed': return 'Closed'
      default: return 'Unknown'
    }
  }

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={index < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}
      >
        ★
      </span>
    ))
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {images && images.length > 0 && (
        <div className="h-48 bg-gray-200">
          <img 
            src={images[0]} 
            alt={name} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">{name}</h3>
            <p className="text-sm text-gray-600">{location}</p>
            <p className="text-xs text-gray-500">{address}</p>
          </div>
          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getAvailabilityColor()}`}>
            {getAvailabilityText()}
          </span>
        </div>

        <div className="flex items-center mb-3">
          <div className="flex items-center mr-2">
            {renderStars()}
          </div>
          <span className="text-sm text-gray-600">
            {rating.toFixed(1)} ({totalReviews} reviews)
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
          <div className="flex items-center text-gray-600">
            <span className="mr-2">🏓</span>
            <span>{surface}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <span className="mr-2">{courtType === 'indoor' ? '🏢' : '🌤️'}</span>
            <span>{courtType.charAt(0).toUpperCase() + courtType.slice(1)}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <span className="mr-2">💰</span>
            <span>${pricePerHour}/hour</span>
          </div>
          {distance && (
            <div className="flex items-center text-gray-600">
              <span className="mr-2">📍</span>
              <span>{distance.toFixed(1)} km</span>
            </div>
          )}
        </div>

        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Amenities</h4>
          <div className="flex flex-wrap gap-2">
            {amenities.slice(0, 4).map((amenity, index) => (
              <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                {amenity}
              </span>
            ))}
            {amenities.length > 4 && (
              <span className="text-xs text-gray-500">
                +{amenities.length - 4} more
              </span>
            )}
          </div>
        </div>

        <div className="flex space-x-2">
          {onViewDetails && (
            <button
              onClick={onViewDetails}
              className="flex-1 border border-indigo-600 text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            >
              View Details
            </button>
          )}
          
          {onBook && (
            <button
              onClick={onBook}
              disabled={availability === 'closed'}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                availability === 'available'
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  : availability === 'busy'
                  ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {availability === 'available' ? 'Book Now' : 
               availability === 'busy' ? 'Join Waitlist' : 
               'Closed'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}