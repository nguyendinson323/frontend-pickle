import React, { useState } from 'react'
import { AnnouncementTemplate } from '../../../store/slices/stateInboxSlice'
import { FiX, FiSave, FiFileText, FiUsers, FiEdit3 } from 'react-icons/fi'

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
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
      <div className="relative top-8 mx-auto p-8 border border-white/20 w-full max-w-3xl shadow-2xl rounded-3xl bg-white/90 backdrop-blur-lg">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className={`bg-gradient-to-br p-4 rounded-2xl shadow-lg ${
                editTemplate ? 'from-orange-500 to-red-600' : 'from-purple-500 to-indigo-600'
              }`}>
                {editTemplate ? <FiEdit3 className="w-6 h-6 text-white" /> : <FiFileText className="w-6 h-6 text-white" />}
              </div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-indigo-900 bg-clip-text text-transparent">
                {editTemplate ? 'Edit Template' : 'Create Message Template'}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-xl transition-all duration-200"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Template Name */}
            <div>
              <label htmlFor="name" className="block text-lg font-bold text-gray-800 mb-3 flex items-center space-x-2">
                <FiFileText className="w-5 h-5 text-purple-600" />
                <span>Template Name</span>
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="block w-full px-4 py-4 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/80 backdrop-blur-sm text-lg font-medium transition-all duration-200 hover:border-purple-300"
                placeholder="Enter template name"
              />
            </div>

            {/* Target Audience */}
            <div>
              <label htmlFor="target_audience" className="block text-lg font-bold text-gray-800 mb-3 flex items-center space-x-2">
                <FiUsers className="w-5 h-5 text-green-600" />
                <span>Target Audience</span>
              </label>
              <select
                id="target_audience"
                name="target_audience"
                value={formData.target_audience}
                onChange={handleInputChange}
                className="block w-full px-4 py-4 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/80 backdrop-blur-sm text-lg font-medium transition-all duration-200 hover:border-green-300"
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
              <label htmlFor="subject" className="block text-lg font-bold text-gray-800 mb-3 flex items-center space-x-2">
                <span>Subject Template</span>
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                className="block w-full px-4 py-4 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm text-lg font-medium transition-all duration-200 hover:border-blue-300"
                placeholder="Enter subject template"
              />
            </div>

            {/* Content */}
            <div>
              <label htmlFor="content" className="block text-lg font-bold text-gray-800 mb-3 flex items-center space-x-2">
                <span>Message Template</span>
                <span className="text-red-500">*</span>
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                required
                rows={10}
                className="block w-full px-4 py-4 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm text-lg font-medium transition-all duration-200 hover:border-blue-300 resize-none"
                placeholder="Enter your message template content"
              />
              <div className="mt-4 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border border-amber-200/50">
                <p className="text-amber-800 font-medium flex items-center space-x-2">
                  <span>💡</span>
                  <span>You can use placeholders like [Name], [Date], [Event] which can be customized when sending</span>
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-8 border-t border-gray-200/50">
              <button
                type="button"
                onClick={onClose}
                className="px-8 py-4 border-2 border-gray-300 rounded-xl shadow-sm text-lg font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 hover:scale-105"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !formData.name || !formData.subject || !formData.content}
                className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-700 border border-transparent rounded-xl shadow-lg text-lg font-semibold text-white hover:from-green-700 hover:to-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 disabled:hover:scale-100 flex items-center space-x-2"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>{editTemplate ? 'Updating...' : 'Creating...'}</span>
                  </div>
                ) : (
                  <>
                    <FiSave className="w-5 h-5" />
                    <span>{editTemplate ? 'Update Template' : 'Create Template'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateTemplateModal