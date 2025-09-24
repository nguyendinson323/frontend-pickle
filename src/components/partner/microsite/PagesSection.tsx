import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../../store'
import {
  MicrositePage,
  createMicrositePage,
  updateMicrositePage,
  deleteMicrositePage
} from '../../../store/slices/partnerMicrositeSlice'
import {
  FiFile,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiSave,
  FiEye,
  FiEyeOff,
  FiHash,
  FiAlignLeft
} from 'react-icons/fi'

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
    <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-2xl rounded-3xl p-8 mb-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl flex items-center justify-center mr-4">
            <FiFile className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Microsite Pages</h2>
        </div>
        {isOwner && (
          <button
            onClick={handleAddPage}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:transform hover:scale-105 font-bold"
          >
            <FiPlus className="w-5 h-5 mr-2" />
            Add Page
          </button>
        )}
      </div>

      {pages.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <FiFile className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">No Pages Yet</h3>
          <p className="text-gray-600 font-medium mb-6">
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
            <div key={page.id} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="text-xl font-bold text-gray-900">{page.title}</h3>
                    {!page.is_published ? (
                      <span className="inline-flex items-center px-3 py-1 text-xs font-bold bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 border border-gray-300 rounded-full">
                        <FiEyeOff className="w-3 h-3 mr-1" />
                        Draft
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 text-xs font-bold bg-gradient-to-r from-green-100 to-emerald-200 text-green-700 border border-green-300 rounded-full">
                        <FiEye className="w-3 h-3 mr-1" />
                        Published
                      </span>
                    )}
                  </div>

                  <div className="flex items-center bg-blue-50 rounded-2xl px-4 py-2 mb-3">
                    <FiHash className="w-4 h-4 text-blue-600 mr-2" />
                    <span className="text-sm font-bold text-blue-800">/{page.slug}</span>
                  </div>

                  {page.content && (
                    <div className="bg-gray-50 rounded-2xl p-4">
                      <div className="flex items-center mb-2">
                        <FiAlignLeft className="w-4 h-4 text-gray-600 mr-2" />
                        <span className="font-bold text-gray-600 text-sm">Content Preview</span>
                      </div>
                      <p className="text-sm text-gray-700 line-clamp-3 font-medium">
                        {page.content.substring(0, 200)}
                        {page.content.length > 200 ? '...' : ''}
                      </p>
                    </div>
                  )}
                </div>

                {isOwner && (
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleEditPage(page)}
                      className="inline-flex items-center px-4 py-2 text-sm font-bold text-blue-700 bg-gradient-to-r from-blue-100 to-blue-200 border border-blue-300 rounded-2xl hover:from-blue-200 hover:to-blue-300 transition-all duration-200"
                    >
                      <FiEdit2 className="w-4 h-4 mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePage(page.id)}
                      className="inline-flex items-center px-4 py-2 text-sm font-bold text-red-700 bg-gradient-to-r from-red-100 to-red-200 border border-red-300 rounded-2xl hover:from-red-200 hover:to-red-300 transition-all duration-200"
                    >
                      <FiTrash2 className="w-4 h-4 mr-1" />
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
          <div className="relative top-20 mx-auto p-0 border-0 w-11/12 md:w-3/4 lg:w-2/3 shadow-2xl rounded-3xl bg-gradient-to-br from-white to-gray-50 overflow-hidden">

            {/* Modal Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 px-8 py-6">
              <div className="flex justify-between items-center text-white">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mr-3">
                    <FiFile className="w-4 h-4" />
                  </div>
                  <h3 className="text-xl font-bold">
                    {editingPage ? 'Edit Page' : 'Add New Page'}
                  </h3>
                </div>
                <button
                  onClick={() => setShowPageModal(false)}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-xl transition-colors"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Page Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-medium text-gray-900 bg-white hover:bg-gray-50 transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-medium text-gray-900 bg-white hover:bg-gray-50 transition-all duration-200"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  rows={10}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-medium text-gray-900 bg-white hover:bg-gray-50 transition-all duration-200"
                  placeholder="Enter page content (supports basic HTML)"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-medium text-gray-900 bg-white hover:bg-gray-50 transition-all duration-200"
                    min="0"
                  />
                </div>

                <div className="flex items-end">
                  <label className="flex items-center bg-white border-2 border-gray-300 rounded-2xl p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_published}
                      onChange={(e) => setFormData(prev => ({ ...prev, is_published: e.target.checked }))}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 mr-3"
                    />
                    <span className="text-sm font-bold text-gray-700">Published</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowPageModal(false)}
                  className="inline-flex items-center px-6 py-3 border-2 border-gray-300 rounded-2xl text-gray-700 font-bold hover:bg-gray-50 transition-all duration-200"
                >
                  <FiX className="w-5 h-5 mr-2" />
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-2xl hover:from-indigo-700 hover:to-purple-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:transform hover:scale-105 font-bold"
                >
                  <FiSave className="w-5 h-5 mr-2" />
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