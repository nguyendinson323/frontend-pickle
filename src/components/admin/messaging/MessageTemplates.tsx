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

const MessageTemplates: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { templates, selectedTemplate, loading } = useSelector((state: RootState) => state.adminMessaging)
  
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
    <div className="bg-white shadow-sm rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Message Templates</h3>
          <button
            onClick={handleCreateTemplate}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
          >
            Create Template
          </button>
        </div>
      </div>

      <div className="p-6">
        {templates.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No message templates found. Create your first template to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <div key={template.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-semibold text-gray-900">{template.name}</h4>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleEditTemplate(template)}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Edit Template"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteTemplate(template.id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete Template"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-700 mb-1">Subject:</p>
                  <p className="text-sm text-gray-600">{template.subject}</p>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-1">Body:</p>
                  <p className="text-sm text-gray-600 line-clamp-3">{template.body}</p>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    {new Date(template.created_at).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => handleUseTemplate(template)}
                    className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                  >
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
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border max-w-lg shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {editingTemplate ? 'Edit Template' : 'Create Template'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Template Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={templateForm.name}
                    onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    placeholder="Enter template name"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    value={templateForm.subject}
                    onChange={(e) => setTemplateForm({ ...templateForm, subject: e.target.value })}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    placeholder="Enter message subject"
                  />
                </div>

                <div>
                  <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-1">
                    Message Body
                  </label>
                  <textarea
                    id="body"
                    value={templateForm.body}
                    onChange={(e) => setTemplateForm({ ...templateForm, body: e.target.value })}
                    rows={6}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    placeholder="Enter message body. Use {{variable}} for dynamic content."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    You can use variables like {'{{name}}'}, {'{{tournament_name}}'}, {'{{date}}'} in your message.
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveTemplate}
                  disabled={loading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Saving...' : editingTemplate ? 'Update' : 'Create'}
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