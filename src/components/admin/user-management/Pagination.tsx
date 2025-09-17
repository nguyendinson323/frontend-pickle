import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../../store'
import { setCurrentPage, fetchUsers } from '../../../store/slices/adminUserManagementSlice'
import {
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
  FiMoreHorizontal,
  FiInfo
} from 'react-icons/fi'

const Pagination: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { pagination, userFilter } = useSelector((state: RootState) => state.adminUserManagement)

  const handlePageChange = (newPage: number) => {
    dispatch(setCurrentPage(newPage))
    dispatch(fetchUsers(userFilter, newPage))
  }

  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    const halfVisible = Math.floor(maxVisiblePages / 2)

    let startPage = Math.max(1, pagination.page - halfVisible)
    let endPage = Math.min(pagination.pages, startPage + maxVisiblePages - 1)

    // Adjust start page if we're near the end
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    return pages
  }

  if (pagination.pages <= 1) {
    return null
  }

  return (
    <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-t-2 border-gray-200">
      <div className="flex items-center justify-between">
        {/* Mobile pagination */}
        <div className="flex justify-between w-full sm:hidden">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="inline-flex items-center px-6 py-3 text-lg font-bold text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            <FiChevronLeft className="mr-2 h-5 w-5" />
            Previous
          </button>
          <div className="flex items-center px-4">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white mr-3">
              <FiInfo className="h-5 w-5" />
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{pagination.page} of {pagination.pages}</div>
              <div className="text-sm text-gray-600">{pagination.total} total</div>
            </div>
          </div>
          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.pages}
            className="inline-flex items-center px-6 py-3 text-lg font-bold text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Next
            <FiChevronRight className="ml-2 h-5 w-5" />
          </button>
        </div>

        {/* Desktop pagination */}
        <div className="hidden sm:flex sm:items-center sm:justify-between sm:w-full">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white mr-4">
              <FiInfo className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
              </h3>
              <p className="text-gray-600 font-medium">Users displayed on this page</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {/* First page button */}
            {pagination.page > 2 && (
              <button
                onClick={() => handlePageChange(1)}
                className="inline-flex items-center px-4 py-3 text-lg font-bold text-indigo-700 bg-white border-2 border-indigo-300 rounded-xl hover:bg-indigo-50 hover:border-indigo-400 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FiChevronsLeft className="h-5 w-5" />
              </button>
            )}

            {/* Previous button */}
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="inline-flex items-center px-4 py-3 text-lg font-bold text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              <FiChevronLeft className="h-5 w-5" />
            </button>

            {/* Ellipsis before current pages */}
            {getPageNumbers()[0] > 2 && (
              <div className="inline-flex items-center px-4 py-3 text-lg font-bold text-gray-500 bg-white border-2 border-gray-200 rounded-xl">
                <FiMoreHorizontal className="h-5 w-5" />
              </div>
            )}

            {/* Page numbers */}
            {getPageNumbers().map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`inline-flex items-center px-5 py-3 text-lg font-bold border-2 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  pageNum === pagination.page
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-700 text-white border-indigo-600 focus:ring-indigo-500'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:ring-gray-500'
                }`}
              >
                {pageNum}
              </button>
            ))}

            {/* Ellipsis after current pages */}
            {getPageNumbers()[getPageNumbers().length - 1] < pagination.pages - 1 && (
              <div className="inline-flex items-center px-4 py-3 text-lg font-bold text-gray-500 bg-white border-2 border-gray-200 rounded-xl">
                <FiMoreHorizontal className="h-5 w-5" />
              </div>
            )}

            {/* Next button */}
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="inline-flex items-center px-4 py-3 text-lg font-bold text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              <FiChevronRight className="h-5 w-5" />
            </button>

            {/* Last page button */}
            {pagination.page < pagination.pages - 1 && (
              <button
                onClick={() => handlePageChange(pagination.pages)}
                className="inline-flex items-center px-4 py-3 text-lg font-bold text-indigo-700 bg-white border-2 border-indigo-300 rounded-xl hover:bg-indigo-50 hover:border-indigo-400 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FiChevronsRight className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Pagination