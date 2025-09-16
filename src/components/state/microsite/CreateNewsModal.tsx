import React, { useState, useEffect } from 'react'
import { StateMicrositeNews } from '../../../store/slices/stateMicrositeSlice'
import SimpleImageUpload from '../../common/SimpleImageUpload'

interface CreateNewsModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (newsData: {
    title: string
    content: string
    is_featured?: boolean
    image_url?: string
  }) => Promise<void>
  onUpdate?: (newsId: number, newsData: Partial<StateMicrositeNews>) => Promise<void>
  editNews?: StateMicrositeNews | null
  loading: boolean
}

const CreateNewsModal: React.FC<CreateNewsModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  onUpdate,
  editNews,
  loading
}) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    is_featured: false,
    image_url: ''
  })

  useEffect(() => {
    if (editNews) {
      setFormData({
        title: editNews.title,
        content: editNews.content,
        is_featured: editNews.is_featured,
        image_url: editNews.image_url || ''
      })
    } else {
      setFormData({
        title: '',
        content: '',
        is_featured: false,
        image_url: ''
      })
    }
  }, [editNews])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const newsData = {
        ...formData,
        image_url: formData.image_url || undefined
      }

      if (editNews && onUpdate) {
        await onUpdate(editNews.id, newsData)
      } else {
        await onCreate(newsData)
      }
      
      // Reset form
      setFormData({
        title: '',
        content: '',
        is_featured: false,
        image_url: ''
      })
      onClose()
    } catch (error) {
      console.error('Error saving news:', error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    })
  }

  const handleImageUpload = (imageUrl: string) => {
    setFormData(prev => ({ ...prev, image_url: imageUrl }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-8 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              {editNews ? 'Edit News Article' : 'Create News Article'}
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
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Article Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter article title"
              />
            </div>

            {/* News Image */}
            <div>
              <SimpleImageUpload
                uploadType="news-image"
                value={formData.image_url}
                onChange={handleImageUpload}
                title="Article Image (Optional)"
                className="bg-gray-50 border border-gray-200"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                }
              />
              <p className="mt-1 text-sm text-gray-500">
                Upload an image to display with your article (PNG, JPG up to 5MB)
              </p>
            </div>

            {/* Featured */}
            <div className="flex items-center">
              <input
                id="is_featured"
                name="is_featured"
                type="checkbox"
                checked={formData.is_featured}
                onChange={handleInputChange}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="is_featured" className="text-sm text-gray-700">
                Make this a featured article
              </label>
              <p className="ml-2 text-xs text-gray-500">(Featured articles appear prominently)</p>
            </div>

            {/* Content */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                Article Content *
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                required
                rows={10}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Write your article content here..."
              />
              <p className="mt-1 text-sm text-gray-500">
                Write your full article content. You can include multiple paragraphs.
              </p>
            </div>

            {/* Preview */}
            {formData.title && formData.content && (
              <div className="border border-gray-200 rounded-lg p-4 ">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Preview:</h4>
                <div className="bg-white rounded-lg p-4 border">
                  {formData.is_featured && (
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 mb-2">
                      Featured
                    </span>
                  )}
                  {formData.image_url && (
                    <div className="mb-3">
                      <img
                        src={formData.image_url}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none'
                        }}
                      />
                    </div>
                  )}
                  <h5 className="font-semibold text-gray-900 text-lg mb-2">{formData.title}</h5>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap line-clamp-4">
                    {formData.content}
                  </p>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !formData.title || !formData.content}
                className="px-4 py-2 bg-green-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (editNews ? 'Updating...' : 'Publishing...') : (editNews ? 'Update Article' : 'Publish Article')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateNewsModal