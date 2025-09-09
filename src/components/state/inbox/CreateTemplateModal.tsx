import React, { useState } from 'react'
import { AnnouncementTemplate } from '../../../store/slices/stateInboxSlice'

interface CreateTemplateModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (templateData: {
    name: string
    subject: string
    content: string
    target_audience: string
  }) => Promise<void>
  onUpdate?: (templateId: number, templateData: Partial<AnnouncementTemplate>) => Promise<void>
  editTemplate?: AnnouncementTemplate | null
  loading: boolean
}

const CreateTemplateModal: React.FC<CreateTemplateModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  onUpdate,
  editTemplate,
  loading
}) => {
  const [formData, setFormData] = useState({
    name: editTemplate?.name || '',
    subject: editTemplate?.subject || '',
    content: editTemplate?.content || '',
    target_audience: editTemplate?.target_audience || 'All Members'
  })

  React.useEffect(() => {
    if (editTemplate) {
      setFormData({
        name: editTemplate.name,
        subject: editTemplate.subject,
        content: editTemplate.content,
        target_audience: editTemplate.target_audience
      })
    } else {
      setFormData({
        name: '',
        subject: '',
        content: '',
        target_audience: 'All Members'
      })
    }
  }, [editTemplate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editTemplate && onUpdate) {
        await onUpdate(editTemplate.id, formData)
      } else {
        await onCreate(formData)
      }
      
      // Reset form
      setFormData({
        name: '',
        subject: '',
        content: '',
        target_audience: 'All Members'
      })
      onClose()
    } catch (error) {
      console.error('Error saving template:', error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-8 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              {editTemplate ? 'Edit Template' : 'Create Message Template'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Template Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Template Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter template name"
              />
            </div>

            {/* Target Audience */}
            <div>
              <label htmlFor="target_audience" className="block text-sm font-medium text-gray-700">
                Target Audience
              </label>
              <select
                id="target_audience"
                name="target_audience"
                value={formData.target_audience}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="All Members">All Members</option>
                <option value="Players">Players Only</option>
                <option value="Clubs">Clubs Only</option>
                <option value="Partners">Partners Only</option>
                <option value="Coaches">Coaches Only</option>
                <option value="Players & Coaches">Players & Coaches</option>
                <option value="Clubs & Partners">Clubs & Partners</option>
              </select>
            </div>

            {/* Subject */}
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                Subject Template *
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter subject template"
              />
            </div>

            {/* Content */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                Message Template *
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                required
                rows={8}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your message template content"
              />
              <p className="mt-1 text-sm text-gray-500">
                You can use placeholders like [Name], [Date], [Event] which can be customized when sending
              </p>
            </div>

            <div className="flex justify-end space-x-3 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !formData.name || !formData.subject || !formData.content}
                className="px-4 py-2 bg-green-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (editTemplate ? 'Updating...' : 'Creating...') : (editTemplate ? 'Update Template' : 'Create Template')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateTemplateModal