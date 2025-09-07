import React, { useState } from 'react'
import { RuleSection as RuleSectionType } from '../../types/common'

interface RuleSectionProps {
  rule: RuleSectionType
  index: number
}

const RuleSection: React.FC<RuleSectionProps> = ({ rule, index }) => {
  const [isExpanded, setIsExpanded] = useState(true)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatContent = (content: string) => {
    // Split content by paragraphs and render each one
    return content.split('\n\n').map((paragraph, index) => {
      // Handle numbered lists
      if (paragraph.match(/^\d+\./)) {
        return (
          <ol key={index} className="list-decimal list-inside space-y-2 mb-4">
            {paragraph.split('\n').map((item, itemIndex) => (
              <li key={itemIndex} className="text-gray-700 leading-relaxed">
                {item.replace(/^\d+\.\s*/, '')}
              </li>
            ))}
          </ol>
        )
      }
      
      // Handle bullet points
      if (paragraph.match(/^[-•]/)) {
        return (
          <ul key={index} className="list-disc list-inside space-y-2 mb-4">
            {paragraph.split('\n').map((item, itemIndex) => (
              <li key={itemIndex} className="text-gray-700 leading-relaxed">
                {item.replace(/^[-•]\s*/, '')}
              </li>
            ))}
          </ul>
        )
      }
      
      // Regular paragraphs
      return (
        <p key={index} className="text-gray-700 leading-relaxed mb-4">
          {paragraph}
        </p>
      )
    })
  }

  return (
    <div id={`rule-${rule.id}`} className="bg-white rounded-lg shadow-md overflow-hidden">
      <div
        className="px-6 py-4 bg-gray-50 border-b cursor-pointer hover:bg-gray-100 transition-colors duration-200"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {index}. {rule.title}
            </h2>
            <div className="text-sm text-gray-500 mt-1">
              Published: {formatDate(rule.created_at)}
            </div>
          </div>
          <div className="flex-shrink-0 ml-4">
            <svg
              className={`w-5 h-5 text-gray-400 transform transition-transform duration-200 ${
                isExpanded ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="px-6 py-6">
          <div className="prose max-w-none">
            {formatContent(rule.content)}
          </div>

          {rule.updated_at && rule.updated_at !== rule.created_at && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                Last updated: {formatDate(rule.updated_at)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default RuleSection