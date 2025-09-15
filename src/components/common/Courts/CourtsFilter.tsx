import React from 'react'
import { FiMapPin, FiFilter } from 'react-icons/fi'
import { State } from '../../../types/common'

interface CourtsFilterProps {
  states: State[]
  selectedState: string
  onStateFilter: (stateId: string) => void
}

const CourtsFilter: React.FC<CourtsFilterProps> = ({ states, selectedState, onStateFilter }) => {
  return (
    <section className="py-16 bg-white opacity-0 animate-fade-in-up">
      <div className="container mx-auto px-6">
        <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-3xl shadow-xl border border-gray-100 opacity-0 animate-fade-in-up [animation-delay:0.2s]">
          <div className="flex items-center gap-3 mb-6 opacity-0 animate-fade-in-left [animation-delay:0.3s]">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
              <FiFilter className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">Find Courts by State</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <button
              onClick={() => onStateFilter('')}
              className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 hover:-translate-y-1 active:scale-95 opacity-0 animate-fade-in-up [animation-delay:0.4s] ${
                selectedState === ''
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-200'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-green-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-center gap-2 justify-center">
                <FiMapPin className="w-4 h-4" />
                <span>All States</span>
              </div>
            </button>

            {states.map((state, index) => (
              <button
                key={state.id}
                onClick={() => onStateFilter(state.id.toString())}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 hover:-translate-y-1 active:scale-95 opacity-0 animate-fade-in-up ${
                  selectedState === state.id.toString()
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-200'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-green-300 hover:shadow-md'
                }`}
                style={{animationDelay: `${0.5 + (index * 0.05)}s`}}
              >
                {state.name}
              </button>
            ))}
          </div>

          <div className="mt-6 text-center opacity-0 animate-fade-in-up [animation-delay:0.8s]">
            <p className="text-sm text-gray-500">
              Select a state to filter courts in that region
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CourtsFilter