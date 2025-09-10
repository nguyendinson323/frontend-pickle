import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../../store'
import {
  fetchStateDocumentsData,
  uploadStateDocument,
  updateStateDocument,
  deleteStateDocument,
  createStateInvoice,
  updateStateInvoice,
  deleteStateInvoice,
  createDocumentTemplate,
  StateDocument,
  StateInvoice,
  DocumentTemplate
} from '../../store/slices/stateDocumentsSlice'

import DocumentsHeader from '../../components/state/documents/DocumentsHeader'
import DocumentsStatsCard from '../../components/state/documents/DocumentsStatsCard'
import DocumentsList from '../../components/state/documents/DocumentsList'
import InvoicesList from '../../components/state/documents/InvoicesList'
import TemplatesList from '../../components/state/documents/TemplatesList'
import UploadDocumentModal from '../../components/state/documents/UploadDocumentModal'
import InvoiceModal from '../../components/state/documents/InvoiceModal'

const StateDocuments: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth)
  const {
    documents,
    invoices,
    templates,
    stats,
    loading,
    error
  } = useSelector((state: RootState) => state.stateDocuments)

  const [activeTab, setActiveTab] = useState<'documents' | 'invoices' | 'templates'>('documents')
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showInvoiceModal, setShowInvoiceModal] = useState(false)
  const [editingInvoice, setEditingInvoice] = useState<StateInvoice | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    if (user?.role !== 'state') {
      navigate('/dashboard')
      return
    }

    dispatch(fetchStateDocumentsData())
  }, [dispatch, isAuthenticated, user, navigate])

  const handleUploadDocument = async (formData: FormData) => {
    try {
      await dispatch(uploadStateDocument(formData))
      setShowUploadModal(false)
    } catch (error) {
      console.error('Failed to upload document:', error)
    }
  }

  const handleEditDocument = (document: StateDocument) => {
    // For now, just show an alert. In a real app, you'd open an edit modal
    const newTitle = prompt('Enter new title:', document.title)
    if (newTitle && newTitle !== document.title) {
      dispatch(updateStateDocument(document.id, { title: newTitle }))
    }
  }

  const handleDeleteDocument = async (documentId: number) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await dispatch(deleteStateDocument(documentId))
      } catch (error) {
        console.error('Failed to delete document:', error)
      }
    }
  }

  const handleCreateInvoice = () => {
    setEditingInvoice(null)
    setShowInvoiceModal(true)
  }

  const handleEditInvoice = (invoice: StateInvoice) => {
    setEditingInvoice(invoice)
    setShowInvoiceModal(true)
  }

  const handleSaveInvoice = async (invoiceData: any) => {
    try {
      if (editingInvoice) {
        await dispatch(updateStateInvoice(editingInvoice.id, invoiceData))
      } else {
        await dispatch(createStateInvoice(invoiceData))
      }
      setShowInvoiceModal(false)
      setEditingInvoice(null)
    } catch (error) {
      console.error('Failed to save invoice:', error)
    }
  }

  const handleDeleteInvoice = async (invoiceId: number) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        await dispatch(deleteStateInvoice(invoiceId))
      } catch (error) {
        console.error('Failed to delete invoice:', error)
      }
    }
  }

  const handleCreateTemplate = () => {
    // For now, just show an alert. In a real app, you'd open a template creation modal
    const templateName = prompt('Enter template name:')
    if (templateName) {
      const templateData = {
        name: templateName,
        description: 'Template description',
        template_type: 'invoice',
        template_content: 'Template content here',
        variables: ['recipient_name', 'amount', 'due_date']
      }
      dispatch(createDocumentTemplate(templateData))
    }
  }

  const handleEditTemplate = (template: DocumentTemplate) => {
    // For now, just show an alert. In a real app, you'd open a template edit modal
    const newName = prompt('Enter new template name:', template.name)
    if (newName && newName !== template.name) {
      console.log('Edit template:', template.id, { name: newName })
    }
  }

  const handleDeleteTemplate = (templateId: number) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      console.log('Delete template:', templateId)
    }
  }

  if (!isAuthenticated || user?.role !== 'state') {
    return null
  }

  return (
    <div className="min-h-screen  py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <DocumentsHeader
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onUploadDocument={() => setShowUploadModal(true)}
          onCreateInvoice={handleCreateInvoice}
          onCreateTemplate={handleCreateTemplate}
        />

        <DocumentsStatsCard stats={stats} />

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <DocumentsList
            documents={documents}
            onEdit={handleEditDocument}
            onDelete={handleDeleteDocument}
            loading={loading}
          />
        )}

        {activeTab === 'invoices' && (
          <InvoicesList
            invoices={invoices}
            onEdit={handleEditInvoice}
            onDelete={handleDeleteInvoice}
            loading={loading}
          />
        )}

        {activeTab === 'templates' && (
          <TemplatesList
            templates={templates}
            onEdit={handleEditTemplate}
            onDelete={handleDeleteTemplate}
            loading={loading}
          />
        )}
      </div>

      <UploadDocumentModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleUploadDocument}
        loading={loading}
      />

      <InvoiceModal
        isOpen={showInvoiceModal}
        onClose={() => {
          setShowInvoiceModal(false)
          setEditingInvoice(null)
        }}
        onSave={handleSaveInvoice}
        loading={loading}
        invoice={editingInvoice}
      />
    </div>
  )
}

export default StateDocuments