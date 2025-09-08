import React from 'react'
import { State } from '../../../types/common'

interface CourtsFilterProps {
  states: State[]
  selectedState: string
  onStateFilter: (stateId: string) => void
}

const CourtsFilter: React.FC<CourtsFilterProps> = ({ states, selectedState, onStateFilter }) => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Find Courts by State</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <button
              onClick={() => onStateFilter('')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedState === '' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All States
            </button>
            {states.map((state) => (
              <button
                key={state.id}
                onClick={() => onStateFilter(state.id.toString())}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedState === state.id.toString()
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {state.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default CourtsFilter