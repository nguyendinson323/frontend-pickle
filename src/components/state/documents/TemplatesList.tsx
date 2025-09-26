import React from 'react'
import { DocumentTemplate } from '../../../store/slices/stateDocumentsSlice'
import { FiFile, FiEdit, FiTrash2, FiCalendar, FiTag, FiSettings, FiLoader, FiFolder, FiCopy, FiEye, FiToggleLeft, FiToggleRight } from 'react-icons/fi'

interface TemplatesListProps {
  templates: DocumentTemplate[]
  onEdit: (template: DocumentTemplate) => void
  onDelete: (templateId: number) => void
  loading: boolean
}

const TemplatesList: React.FC<TemplatesListProps> = ({
  templates,
  onEdit,
  onDelete,
  loading
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getTemplateTypeColor = (type: string) => {
    const colors = {
      invoice: 'from-green-500 to-emerald-600',
      contract: 'from-blue-500 to-blue-600',
      certificate: 'from-yellow-500 to-orange-600',
      report: 'from-purple-500 to-purple-600',
      letter: 'from-orange-500 to-red-600'
    }
    return colors[type as keyof typeof colors] || 'from-gray-500 to-gray-600'
  }

  const getTemplateTypeIcon = (type: string) => {
    const icons = {
      invoice: FiFile,
      contract: FiFile,
      certificate: FiFile,
      report: FiFile,
      letter: FiFile
    }
    return icons[type as keyof typeof icons] || FiFile
  }

  const getVariables = (variables: any[]): string[] => {
    return Array.isArray(variables) ? variables : []
  }

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl border-2 border-gray-200/50 p-8 backdrop-blur-sm">
        <div className="flex items-center justify-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-xl">
            <FiLoader className="w-8 h-8 text-white animate-spin" />
          </div>
        </div>
        <div className="animate-pulse space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gradient-to-r from-gray-100 to-gray-200 h-20 rounded-3xl shadow-lg"></div>
          ))}
        </div>
        <p className="text-center text-lg font-bold text-gray-700 mt-8">Loading templates...</p>
      </div>
    )
  }

  if (templates.length === 0) {
    return (
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl border-2 border-gray-200/50 p-16 text-center backdrop-blur-sm">
        <div className="w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
          <FiFolder className="w-12 h-12 text-white" />
        </div>
        <h3 className="text-3xl font-bold text-gray-900 mb-4">No Templates Found</h3>
        <p className="text-lg text-gray-600 font-medium mb-8 max-w-md mx-auto leading-relaxed">
          Create reusable document templates to standardize and streamline your workflow.
        </p>
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl p-6 border-2 border-purple-200/50 inline-block">
          <p className="text-sm text-purple-700 font-bold flex items-center">
            <FiFile className="w-4 h-4 mr-2" />
            Tip: Templates help maintain consistency across documents
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl border-2 border-gray-200/50 backdrop-blur-sm">
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-xl">
              <FiFile className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Document Templates</h3>
              <p className="text-gray-600 font-medium">{templates.length} template{templates.length !== 1 ? 's' : ''} available</p>
            </div>
          </div>
        </div>

        {/* Modern Card-based Layout */}
        <div className="space-y-6">
          {templates.map((template) => {
            const IconComponent = getTemplateTypeIcon(template.template_type)
            const colorClass = getTemplateTypeColor(template.template_type)
            const variables = getVariables(template.variables || [])

            return (
              <div key={template.id} className="bg-white rounded-3xl shadow-xl border-2 border-gray-200/50 p-8 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] backdrop-blur-sm">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
                  <div className="flex items-start space-x-6 flex-1">
                    {/* Template Type Icon */}
                    <div className={`w-16 h-16 bg-gradient-to-r ${colorClass} rounded-3xl flex items-center justify-center shadow-xl flex-shrink-0`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>

                    {/* Template Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xl font-bold text-gray-900 mb-2 break-words">{template.name}</h4>
                      {template.description && (
                        <p className="text-gray-600 font-medium mb-4 leading-relaxed">{template.description}</p>
                      )}

                      {/* Metadata Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Template Type */}
                        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-2xl border-2 border-purple-200/50">
                          <div className="flex items-center space-x-2 mb-2">
                            <IconComponent className="w-4 h-4 text-purple-600" />
                            <span className="text-xs font-bold text-purple-700 uppercase">Type</span>
                          </div>
                          <p className="font-bold text-purple-900 capitalize">{template.template_type}</p>
                        </div>

                        {/* Creation Date */}
                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-2xl border-2 border-blue-200/50">
                          <div className="flex items-center space-x-2 mb-2">
                            <FiCalendar className="w-4 h-4 text-blue-600" />
                            <span className="text-xs font-bold text-blue-700 uppercase">Created</span>
                          </div>
                          <p className="font-bold text-blue-900">{formatDate(template.created_at)}</p>
                        </div>

                        {/* Variables Count */}
                        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-2xl border-2 border-green-200/50">
                          <div className="flex items-center space-x-2 mb-2">
                            <FiTag className="w-4 h-4 text-green-600" />
                            <span className="text-xs font-bold text-green-700 uppercase">Variables</span>
                          </div>
                          <p className="font-bold text-green-900">{variables.length} variable{variables.length !== 1 ? 's' : ''}</p>
                        </div>

                        {/* Status */}
                        <div className={`p-4 rounded-2xl border-2 ${
                          template.is_active
                            ? 'bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200/50'
                            : 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200/50'
                        }`}>
                          <div className="flex items-center space-x-2 mb-2">
                            {template.is_active ? (
                              <FiToggleRight className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <FiToggleLeft className="w-4 h-4 text-gray-600" />
                            )}
                            <span className={`text-xs font-bold uppercase ${
                              template.is_active ? 'text-emerald-700' : 'text-gray-700'
                            }`}>Status</span>
                          </div>
                          <p className={`font-bold ${
                            template.is_active ? 'text-emerald-900' : 'text-gray-900'
                          }`}>
                            {template.is_active ? 'Active' : 'Inactive'}
                          </p>
                        </div>
                      </div>

                      {/* Variables Display */}
                      {variables.length > 0 && (
                        <div className="mt-4 bg-white/60 rounded-2xl p-4 backdrop-blur-sm">
                          <div className="flex items-center space-x-2 mb-3">
                            <FiTag className="w-4 h-4 text-gray-600" />
                            <span className="text-sm font-bold text-gray-700">Template Variables:</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {variables.slice(0, 5).map((variable, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-3 py-1 text-xs font-bold bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 rounded-full shadow-sm"
                              >
                                <FiSettings className="w-3 h-3 mr-1" />
                                {variable}
                              </span>
                            ))}
                            {variables.length > 5 && (
                              <span className="inline-flex items-center px-3 py-1 text-xs font-bold bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 rounded-full shadow-sm">
                                <FiEye className="w-3 h-3 mr-1" />
                                +{variables.length - 5} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-row lg:flex-col space-x-3 lg:space-x-0 lg:space-y-3 flex-shrink-0">
                    <button
                      onClick={() => {/* Add duplicate functionality */}}
                      className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                      title="Duplicate template"
                    >
                      <FiCopy className="w-4 h-4 mr-2" />
                      Duplicate
                    </button>
                    <button
                      onClick={() => onEdit(template)}
                      className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                      title="Edit template"
                    >
                      <FiEdit className="w-4 h-4 mr-2" />
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(template.id)}
                      className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                      title="Delete template"
                    >
                      <FiTrash2 className="w-4 h-4 mr-2" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default TemplatesList