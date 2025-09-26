import React, { useState, useEffect } from 'react'
import { StateMicrositeNews } from '../../../store/slices/stateMicrositeSlice'
import SimpleImageUpload from '../../common/SimpleImageUpload'
import { FiX, FiFileText, FiImage, FiStar, FiEye, FiSave, FiEdit2 } from 'react-icons/fi'

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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
      <div className="relative top-8 mx-auto p-6 w-full max-w-4xl">
        <div className="bg-gradient-to-br from-white to-orange-50 rounded-3xl shadow-2xl border border-gray-200/50">
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <div className="bg-orange-500 p-3 rounded-2xl shadow-lg">
                  {editNews ? <FiEdit2 className="w-6 h-6 text-white" /> : <FiFileText className="w-6 h-6 text-white" />}
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {editNews ? 'Edit News Article' : 'Create News Article'}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors duration-200"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Title */}
              <div className="bg-white/60 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-center space-x-2 mb-6">
                  <FiFileText className="w-5 h-5 text-orange-600" />
                  <h4 className="text-lg font-bold text-gray-900">Article Details</h4>
                </div>
                <div>
                  <label htmlFor="title" className="block text-sm font-bold text-gray-700 mb-2">
                    Article Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                    placeholder="Enter article title"
                  />
                </div>
              </div>

              {/* News Image */}
              <div className="bg-white/60 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-center space-x-2 mb-6">
                  <FiImage className="w-5 h-5 text-orange-600" />
                  <h4 className="text-lg font-bold text-gray-900">Article Image</h4>
                </div>
                <SimpleImageUpload
                  fieldName="news-image"
                  fileType="image"
                  value={formData.image_url}
                  onChange={handleImageUpload}
                  title="Article Image (Optional)"
                  className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-300 rounded-2xl"
                  enableCropping={true}
                  aspectRatio={16/9}
                  icon={
                    <FiImage className="w-6 h-6" />
                  }
                />
                <p className="mt-3 text-sm text-gray-600">
                  Upload an image to display with your article (PNG, JPG up to 5MB)
                </p>
              </div>

              {/* Featured */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200/50">
                <div className="flex items-center space-x-3">
                  <input
                    id="is_featured"
                    name="is_featured"
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={handleInputChange}
                    className="h-5 w-5 text-yellow-600 focus:ring-2 focus:ring-yellow-500 border-gray-300 rounded transition-colors duration-200"
                  />
                  <div className="flex items-center space-x-2">
                    <FiStar className="w-5 h-5 text-yellow-600" />
                    <label htmlFor="is_featured" className="text-sm font-medium text-gray-800">
                      Make this a featured article
                    </label>
                  </div>
                </div>
                <p className="mt-2 text-xs text-gray-600 ml-8">
                  Featured articles appear prominently at the top of your news section
                </p>
              </div>

              {/* Content */}
              <div className="bg-white/60 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-center space-x-2 mb-6">
                  <FiEdit2 className="w-5 h-5 text-orange-600" />
                  <h4 className="text-lg font-bold text-gray-900">Article Content</h4>
                </div>
                <div>
                  <label htmlFor="content" className="block text-sm font-bold text-gray-700 mb-2">
                    Article Content *
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    required
                    rows={10}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                    placeholder="Write your article content here..."
                  />
                  <p className="mt-3 text-sm text-gray-600">
                    Write your full article content. You can include multiple paragraphs.
                  </p>
                </div>
              </div>

              {/* Preview */}
              {formData.title && formData.content && (
                <div className="bg-white/60 rounded-2xl p-6 backdrop-blur-sm">
                  <div className="flex items-center space-x-2 mb-6">
                    <FiEye className="w-5 h-5 text-orange-600" />
                    <h4 className="text-lg font-bold text-gray-900">Preview</h4>
                  </div>
                  <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200/50 p-6">
                    {formData.is_featured && (
                      <div className="inline-flex items-center px-4 py-2 text-sm font-bold rounded-xl shadow-sm bg-gradient-to-r from-yellow-400 to-orange-400 text-white mb-4">
                        <FiStar className="w-4 h-4 mr-2" />
                        Featured
                      </div>
                    )}
                    {formData.image_url && (
                      <div className="relative mb-4 overflow-hidden rounded-2xl">
                        <img
                          src={formData.image_url}
                          alt="Preview"
                          className="w-full h-48 object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none'
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      </div>
                    )}
                    <h5 className="font-bold text-gray-900 text-xl mb-3 leading-tight">{formData.title}</h5>
                    <div className="bg-white/60 rounded-xl p-4 backdrop-blur-sm">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap line-clamp-6 leading-relaxed">
                        {formData.content}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-4 pt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-semibold hover:bg-gray-200 transition-colors duration-200"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !formData.title || !formData.content}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold shadow-lg hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>{editNews ? 'Updating...' : 'Publishing...'}</span>
                    </>
                  ) : (
                    <>
                      <FiSave className="w-4 h-4" />
                      <span>{editNews ? 'Update Article' : 'Publish Article'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateNewsModal