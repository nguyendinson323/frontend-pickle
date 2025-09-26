import React from 'react'
import { AnnouncementTemplate } from '../../../store/slices/stateInboxSlice'
import { FiFileText, FiPlus, FiEdit3, FiTrash2, FiPlay, FiUsers } from 'react-icons/fi'

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
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-4">
          <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-4 rounded-2xl shadow-lg">
            <FiFileText className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-indigo-900 bg-clip-text text-transparent">Message Templates</h3>
            <p className="text-gray-600 mt-1 text-lg">Create and manage reusable message templates for announcements</p>
          </div>
        </div>
        <button
          onClick={onCreateTemplate}
          className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white px-6 py-3 rounded-xl flex items-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-medium"
        >
          <FiPlus className="w-5 h-5 mr-3" />
          Create Template
        </button>
      </div>

      {templates.length === 0 ? (
        <div className="text-center py-16">
          <div className="bg-gradient-to-br from-purple-100 to-indigo-200 p-8 rounded-full mx-auto w-24 h-24 flex items-center justify-center shadow-lg">
            <FiFileText className="w-12 h-12 text-purple-600" />
          </div>
          <h3 className="mt-6 text-xl font-bold text-gray-900">No templates</h3>
          <p className="mt-3 text-gray-600 max-w-sm mx-auto leading-relaxed">Get started by creating your first message template to streamline your communications.</p>
        </div>
      ) : (
        templates.map((template) => (
          <div
            key={template.id}
            className="border border-gray-200/50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm transform hover:scale-[1.02] shadow-lg"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">
                    {template.name}
                  </h3>
                  <span className={`inline-flex items-center px-3 py-2 text-xs font-bold rounded-xl shadow-sm ${getTargetAudienceColor(template.target_audience)}`}>
                    <FiUsers className="w-3 h-3 mr-1" />
                    {template.target_audience}
                  </span>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-700 flex items-center space-x-2">
                    <span className="font-medium text-gray-500">Subject:</span>
                    <span className="font-bold text-gray-900">{template.subject}</span>
                  </p>
                  <p className="text-sm text-gray-500 mt-2 flex items-center space-x-1">
                    <span>📅</span>
                    <span>Created: {formatDate(template.created_at)}</span>
                  </p>
                </div>

                <div className="mb-4">
                  <p className="text-gray-700 line-clamp-3 leading-relaxed">
                    {template.content.length > 250
                      ? `${template.content.substring(0, 250)}...`
                      : template.content
                    }
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 ml-6">
                <button
                  onClick={() => onUseTemplate(template)}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-xl font-semibold flex items-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  title="Use this template"
                >
                  <FiPlay className="w-4 h-4 mr-2" />
                  Use Template
                </button>

                <button
                  onClick={() => onEditTemplate(template)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-xl transition-all duration-200 hover:scale-110 shadow-sm"
                  title="Edit template"
                >
                  <FiEdit3 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this template?')) {
                      onDeleteTemplate(template.id)
                    }
                  }}
                  className="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-xl transition-all duration-200 hover:scale-110 shadow-sm"
                  title="Delete template"
                >
                  <FiTrash2 className="w-4 h-4" />
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