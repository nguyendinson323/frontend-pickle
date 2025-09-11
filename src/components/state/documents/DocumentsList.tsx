import React from 'react'
import { Document as StateDocument } from '../../../store/slices/stateDocumentsSlice'

interface DocumentsListProps {
  documents: StateDocument[]
  onEdit: (document: StateDocument) => void
  onDelete: (documentId: number) => void
  loading: boolean
}

const DocumentsList: React.FC<DocumentsListProps> = ({
  documents,
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

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 Bytes'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  const getDocumentTypeColor = (type: string) => {
    const colors = {
      invoice: 'bg-green-100 text-green-800',
      contract: 'bg-blue-100 text-blue-800',
      report: 'bg-purple-100 text-purple-800',
      certificate: 'bg-yellow-100 text-yellow-800',
      policy: 'bg-red-100 text-red-800',
      other: 'bg-gray-100 text-gray-800'
    }
    return colors[type as keyof typeof colors] || colors.other
  }

  const getEntityTypeColor = (type: string | null) => {
    if (!type) return 'bg-gray-100 text-gray-800'
    
    const colors = {
      tournament: 'bg-blue-100 text-blue-800',
      club: 'bg-green-100 text-green-800',
      partner: 'bg-purple-100 text-purple-800',
      player: 'bg-yellow-100 text-yellow-800',
      coach: 'bg-orange-100 text-orange-800',
      general: 'bg-gray-100 text-gray-800'
    }
    return colors[type as keyof typeof colors] || colors.general
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow border border-gray-200 p-8">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  if (documents.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow border border-gray-200 p-8 text-center">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No documents</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by uploading your first document.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Document
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Related To
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Size
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Uploaded By
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Public
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {documents.map((document) => (
              <tr key={document.id} className="hover:">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{document.title}</div>
                    <div className="text-sm text-gray-500">{document.file_name}</div>
                    {document.description && (
                      <div className="text-xs text-gray-400 mt-1 max-w-xs truncate">
                        {document.description}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDocumentTypeColor(document.document_type)}`}>
                    {document.document_type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {document.related_entity_type ? (
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEntityTypeColor(document.related_entity_type)}`}>
                      {document.related_entity_type}
                    </span>
                  ) : (
                    <span className="text-gray-400 text-sm">-</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatFileSize(document.file_size)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{document.created_by_user.username}</div>
                  <div className="text-sm text-gray-500">{document.created_by_user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(document.created_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {document.is_public ? (
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Public
                    </span>
                  ) : (
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                      Private
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => onEdit(document)}
                      className="text-blue-600 hover:text-blue-900 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(document.id)}
                      className="text-red-600 hover:text-red-900 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DocumentsList