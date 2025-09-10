import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../../store'
import { 
  MicrositePage,
  createMicrositePage,
  updateMicrositePage,
  deleteMicrositePage
} from '../../../store/slices/partnerMicrositeSlice'

interface PagesSectionProps {
  pages: MicrositePage[]
  isOwner: boolean
}

interface PageFormData {
  title: string
  slug: string
  content: string
  is_published: boolean
  display_order: number
}

const PagesSection: React.FC<PagesSectionProps> = ({ pages, isOwner }) => {
  const dispatch = useDispatch<AppDispatch>()
  const [showPageModal, setShowPageModal] = useState(false)
  const [editingPage, setEditingPage] = useState<MicrositePage | null>(null)
  const [formData, setFormData] = useState<PageFormData>({
    title: '',
    slug: '',
    content: '',
    is_published: true,
    display_order: 0
  })

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      content: '',
      is_published: true,
      display_order: 0
    })
    setEditingPage(null)
  }

  const handleAddPage = () => {
    resetForm()
    setFormData(prev => ({ ...prev, display_order: pages.length }))
    setShowPageModal(true)
  }

  const handleEditPage = (page: MicrositePage) => {
    setEditingPage(page)
    setFormData({
      title: page.title,
      slug: page.slug,
      content: page.content || '',
      is_published: page.is_published,
      display_order: page.display_order
    })
    setShowPageModal(true)
  }

  const handleDeletePage = async (pageId: number) => {
    if (window.confirm('Are you sure you want to delete this page?')) {
      try {
        await dispatch(deleteMicrositePage(pageId))
      } catch (error) {
        console.error('Failed to delete page:', error)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingPage) {
        await dispatch(updateMicrositePage(editingPage.id, formData))
      } else {
        await dispatch(createMicrositePage(formData))
      }
      setShowPageModal(false)
      resetForm()
    } catch (error) {
      console.error('Failed to save page:', error)
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleTitleChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      title: value,
      slug: prev.slug || generateSlug(value)
    }))
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Microsite Pages</h2>
        {isOwner && (
          <button
            onClick={handleAddPage}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Page
          </button>
        )}
      </div>

      {pages.length === 0 ? (
        <div className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Pages Yet</h3>
          <p className="text-gray-500 mb-4">
            {isOwner 
              ? "Create your first page to add custom content to your microsite."
              : "This partner hasn't added any custom pages yet."
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {pages
            .sort((a, b) => a.display_order - b.display_order)
            .map((page) => (
            <div key={page.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-medium text-gray-900">{page.title}</h3>
                    {!page.is_published && (
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                        Draft
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mb-2">/{page.slug}</p>
                  {page.content && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {page.content.substring(0, 150)}
                      {page.content.length > 150 ? '...' : ''}
                    </p>
                  )}
                </div>
                {isOwner && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditPage(page)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePage(page.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Page Modal */}
      {showPageModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-6 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-lg bg-white">
            <div className="flex justify-between items-center pb-4 border-b">
              <h3 className="text-xl font-bold text-gray-900">
                {editingPage ? 'Edit Page' : 'Add New Page'}
              </h3>
              <button
                onClick={() => setShowPageModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Page Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  rows={10}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter page content (supports basic HTML)"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                  />
                </div>

                <div className="flex items-end">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.is_published}
                      onChange={(e) => setFormData(prev => ({ ...prev, is_published: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Published</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => setShowPageModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingPage ? 'Update Page' : 'Create Page'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default PagesSection