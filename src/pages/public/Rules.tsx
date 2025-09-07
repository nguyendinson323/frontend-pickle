import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import RuleSection from '../../components/rules/RuleSection'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'

const Rules: React.FC = () => {
  const { data: appData, loading, error } = useSelector((state: RootState) => state.appData)

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <ErrorMessage message={error} />
  }

  if (!appData?.rules) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Rules Found</h2>
          <p className="text-gray-600">Official rules and regulations will be available soon.</p>
        </div>
      </div>
    )
  }

  const rules = appData.rules

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Official Rules & Regulations</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Official pickleball rules and regulations as adopted by the Mexican Pickleball Federation.
          </p>
        </div>

        {/* Table of Contents */}
        {rules.length > 1 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Table of Contents</h2>
            <nav className="space-y-2">
              {rules.map((rule, index) => (
                <a
                  key={rule.id}
                  href={`#rule-${rule.id}`}
                  className="block text-blue-600 hover:text-blue-800 transition-colors duration-200"
                >
                  {index + 1}. {rule.title}
                </a>
              ))}
            </nav>
          </div>
        )}

        {/* Rules Content */}
        <div className="space-y-8">
          {rules.map((rule, index) => (
            <RuleSection
              key={rule.id}
              rule={rule}
              index={index + 1}
            />
          ))}
        </div>

        {rules.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No rules available</h3>
            <p className="text-gray-500">Official rules and regulations will be published soon.</p>
          </div>
        )}

        {/* Footer Notice */}
        <div className="mt-12 bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <strong>Important Notice:</strong> These rules are subject to updates and modifications. 
                Players are encouraged to stay informed about the latest rule changes. 
                For questions or clarifications, please contact the Mexican Pickleball Federation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Rules