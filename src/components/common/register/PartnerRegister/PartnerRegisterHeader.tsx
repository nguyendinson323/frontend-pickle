import React from 'react'

const PartnerRegisterHeader: React.FC = () => {
  return (
    <div className="text-center mb-8">
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center">
          <span className="text-2xl">🏨</span>
        </div>
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Partner Registration</h1>
      <p className="text-gray-600">Register your business as a federation partner</p>
    </div>
  )
}

export default PartnerRegisterHeader