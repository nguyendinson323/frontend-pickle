import React from 'react'

const UserSelectHeader: React.FC = () => {
  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Choose Your Account Type
      </h1>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto">
        Select the type of account that best describes your role in the pickleball federation. 
        Each account type has different features and requirements.
      </p>
    </div>
  )
}

export default UserSelectHeader