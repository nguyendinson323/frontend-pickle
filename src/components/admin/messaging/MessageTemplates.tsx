import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../../store'
import { MessageTemplate } from '../../../types/admin'
import {
  createTemplate,
  updateTemplateAction,
  deleteTemplate,
  setSelectedTemplate
} from '../../../store/slices/adminMessagingSlice'
import {
  FiFileText,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiCheck,
  FiX,
  FiCalendar,
  FiMessageSquare,
  FiLoader,
  FiTag
} from 'react-icons/fi'

const MessageTemplates: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { templates, loading } = useSelector((state: RootState) => state.adminMessaging)
  
  const [showModal, setShowModal] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<MessageTemplate | null>(null)
  const [templateForm, setTemplateForm] = useState({
    name: '',
    subject: '',
    body: ''
  })

  const handleCreateTemplate = () => {
    setEditingTemplate(null)
    setTemplateForm({ name: '', subject: '', body: '' })
    setShowModal(true)
  }

  const handleEditTemplate = (template: MessageTemplate) => {
    setEditingTemplate(template)
    setTemplateForm({
      name: template.name,
      subject: template.subject,
      body: template.body
    })
    setShowModal(true)
  }

  const handleSaveTemplate = async () => {
    if (!templateForm.name || !templateForm.subject || !templateForm.body) {
      alert('All fields are required')
      return
    }

    try {
      if (editingTemplate) {
        await dispatch(updateTemplateAction(editingTemplate.id, templateForm))
      } else {
        await dispatch(createTemplate(templateForm))
      }
      setShowModal(false)
      setTemplateForm({ name: '', subject: '', body: '' })
    } catch (error) {
      console.error('Failed to save template:', error)
    }
  }

  const handleDeleteTemplate = async (templateId: number) => {
    const confirmed = window.confirm('Are you sure you want to delete this template?')
    if (confirmed) {
      try {
        await dispatch(deleteTemplate(templateId))
      } catch (error) {
        console.error('Failed to delete template:', error)
      }
    }
  }

  const handleUseTemplate = (template: MessageTemplate) => {
    dispatch(setSelectedTemplate(template))
  }

  return (
    <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white mr-3">
              <FiFileText className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Message Templates</h3>
          </div>
          <button
            onClick={handleCreateTemplate}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-medium rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <FiPlus className="mr-2 h-4 w-4" />
            Create Template
          </button>
        </div>
      </div>

      <div className="p-6">
        {templates.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiFileText className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-500 mb-4">Create your first message template to get started.</p>
            <button
              onClick={handleCreateTemplate}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <FiPlus className="mr-2 h-4 w-4" />
              Create First Template
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 max-h-screen overflow-auto">
            {templates.map((template, index) => (
              <div
                key={template.id}
                className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:border-indigo-300 transition-all duration-200 transform hover:scale-105"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white mr-3">
                      <FiTag className="h-4 w-4" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-lg">{template.name}</h4>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditTemplate(template)}
                      className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200"
                      title="Edit Template"
                    >
                      <FiEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteTemplate(template.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                      title="Delete Template"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="flex items-center mb-2">
                      <FiMessageSquare className="h-4 w-4 text-gray-500 mr-2" />
                      <p className="text-sm font-semibold text-gray-700">Subject</p>
                    </div>
                    <p className="text-sm text-gray-800 font-medium">{template.subject}</p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="flex items-center mb-2">
                      <FiFileText className="h-4 w-4 text-gray-500 mr-2" />
                      <p className="text-sm font-semibold text-gray-700">Message Body</p>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">{template.body}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <div className="flex items-center text-xs text-gray-500">
                    <FiCalendar className="mr-1 h-3 w-3" />
                    {new Date(template.created_at).toLocaleDateString()}
                  </div>
                  <button
                    onClick={() => handleUseTemplate(template)}
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-medium rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <FiCheck className="mr-1 h-3 w-3" />
                    Use Template
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Template Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative mx-auto border border-gray-200 max-w-2xl shadow-2xl rounded-2xl bg-white transform transition-all duration-300 max-h-[90vh] overflow-y-auto w-full">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white px-6 py-4 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mr-3">
                    {editingTemplate ? <FiEdit className="h-5 w-5" /> : <FiPlus className="h-5 w-5" />}
                  </div>
                  <h3 className="text-xl font-bold">
                    {editingTemplate ? 'Edit Template' : 'Create New Template'}
                  </h3>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-white hover:text-gray-300 transition-colors bg-white bg-opacity-20 rounded-xl p-2 hover:bg-opacity-30"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-lg font-bold text-gray-900 mb-3 flex items-center">
                    <FiTag className="mr-2 h-5 w-5" />
                    Template Name <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={templateForm.name}
                    onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
                    className="w-full border-2 border-gray-300 rounded-2xl shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200 px-4 py-3 text-lg hover:border-gray-400"
                    placeholder="Enter a descriptive template name..."
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-lg font-bold text-gray-900 mb-3 flex items-center">
                    <FiMessageSquare className="mr-2 h-5 w-5" />
                    Subject <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    id="subject"
                    value={templateForm.subject}
                    onChange={(e) => setTemplateForm({ ...templateForm, subject: e.target.value })}
                    className="w-full border-2 border-gray-300 rounded-2xl shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200 px-4 py-3 text-lg hover:border-gray-400"
                    placeholder="Enter the message subject..."
                  />
                </div>

                <div>
                  <label htmlFor="body" className="block text-lg font-bold text-gray-900 mb-3 flex items-center">
                    <FiFileText className="mr-2 h-5 w-5" />
                    Message Body <span className="text-red-500 ml-1">*</span>
                  </label>
                  <textarea
                    id="body"
                    value={templateForm.body}
                    onChange={(e) => setTemplateForm({ ...templateForm, body: e.target.value })}
                    rows={8}
                    className="w-full border-2 border-gray-300 rounded-2xl shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200 px-4 py-3 text-base hover:border-gray-400 resize-none"
                    placeholder="Enter the message body. Use {{variable}} for dynamic content..."
                  />
                  <div className="mt-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                        <FiTag className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-blue-800 mb-2">Variable Usage</p>
                        <p className="text-xs text-blue-700 leading-relaxed">
                          You can use variables like <code className="bg-blue-200 px-1 rounded">{'{{name}}'}</code>, <code className="bg-blue-200 px-1 rounded">{'{{tournament_name}}'}</code>, <code className="bg-blue-200 px-1 rounded">{'{{date}}'}</code> in your message. These will be automatically replaced with actual values when sent.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 mt-8 pt-6 border-t-2 border-gray-200">
                <button
                  onClick={() => setShowModal(false)}
                  className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <FiX className="mr-2 h-4 w-4" />
                  Cancel
                </button>
                <button
                  onClick={handleSaveTemplate}
                  disabled={loading}
                  className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
                >
                  {loading ? (
                    <>
                      <FiLoader className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : editingTemplate ? (
                    <>
                      <FiCheck className="mr-2 h-4 w-4" />
                      Update Template
                    </>
                  ) : (
                    <>
                      <FiPlus className="mr-2 h-4 w-4" />
                      Create Template
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MessageTemplates