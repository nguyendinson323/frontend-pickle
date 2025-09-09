import React from 'react'
import { AnnouncementTemplate } from '../../../store/slices/stateInboxSlice'

interface TemplatesTabProps {
  templates: AnnouncementTemplate[]
  onCreateTemplate: () => void
  onEditTemplate: (template: AnnouncementTemplate) => void
  onDeleteTemplate: (templateId: number) => void
  onUseTemplate: (template: AnnouncementTemplate) => void
}

const TemplatesTab: React.FC<TemplatesTabProps> = ({
  templates,
  onCreateTemplate,
  onEditTemplate,
  onDeleteTemplate,
  onUseTemplate
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getTargetAudienceColor = (targetAudience: string) => {
    const audiences = targetAudience.toLowerCase()
    if (audiences.includes('all') || audiences.includes('everyone')) {
      return 'bg-purple-100 text-purple-800'
    } else if (audiences.includes('player')) {
      return 'bg-blue-100 text-blue-800'
    } else if (audiences.includes('club')) {
      return 'bg-orange-100 text-orange-800'
    } else if (audiences.includes('partner')) {
      return 'bg-green-100 text-green-800'
    } else if (audiences.includes('coach')) {
      return 'bg-indigo-100 text-indigo-800'
    } else {
      return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Message Templates</h3>
          <p className="text-sm text-gray-500">Create and manage reusable message templates for announcements</p>
        </div>
        <button
          onClick={onCreateTemplate}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center text-sm"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Template
        </button>
      </div>

      {templates.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No templates</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating your first message template.</p>
        </div>
      ) : (
        templates.map((template) => (
          <div 
            key={template.id} 
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-medium text-gray-900">
                    {template.name}
                  </h3>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTargetAudienceColor(template.target_audience)}`}>
                    {template.target_audience}
                  </span>
                </div>

                <div className="mb-3">
                  <p className="text-sm text-gray-600">
                    Subject: <span className="font-medium">{template.subject}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Created: {formatDate(template.created_at)}
                  </p>
                </div>

                <div className="mb-3">
                  <p className="text-sm text-gray-700 line-clamp-3">
                    {template.content.length > 200 
                      ? `${template.content.substring(0, 200)}...`
                      : template.content
                    }
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => onUseTemplate(template)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium"
                  title="Use this template"
                >
                  Use Template
                </button>

                <button
                  onClick={() => onEditTemplate(template)}
                  className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                  title="Edit template"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>

                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this template?')) {
                      onDeleteTemplate(template.id)
                    }
                  }}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                  title="Delete template"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default TemplatesTab