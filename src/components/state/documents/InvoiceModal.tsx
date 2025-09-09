import React, { useState, useEffect } from 'react'
import { StateInvoice } from '../../../store/slices/stateDocumentsSlice'

interface InvoiceModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (invoiceData: any) => void
  loading: boolean
  invoice?: StateInvoice | null
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({
  isOpen,
  onClose,
  onSave,
  loading,
  invoice
}) => {
  const [formData, setFormData] = useState({
    invoice_type: 'other',
    recipient_type: 'tournament',
    recipient_id: '',
    recipient_name: '',
    amount: '',
    tax_amount: '',
    due_date: '',
    description: ''
  })

  const invoiceTypes = [
    { value: 'tournament_fee', label: 'Tournament Fee' },
    { value: 'membership_fee', label: 'Membership Fee' },
    { value: 'court_rental', label: 'Court Rental' },
    { value: 'sponsorship', label: 'Sponsorship' },
    { value: 'other', label: 'Other' }
  ]

  const recipientTypes = [
    { value: 'tournament', label: 'Tournament' },
    { value: 'club', label: 'Club' },
    { value: 'partner', label: 'Partner' },
    { value: 'player', label: 'Player' },
    { value: 'coach', label: 'Coach' }
  ]

  useEffect(() => {
    if (invoice) {
      setFormData({
        invoice_type: invoice.invoice_type,
        recipient_type: invoice.recipient_type,
        recipient_id: invoice.recipient_id.toString(),
        recipient_name: invoice.recipient_name,
        amount: invoice.amount.toString(),
        tax_amount: invoice.tax_amount?.toString() || '',
        due_date: invoice.due_date.split('T')[0],
        description: invoice.description || ''
      })
    } else {
      // Set default due date to 30 days from now
      const defaultDueDate = new Date()
      defaultDueDate.setDate(defaultDueDate.getDate() + 30)
      
      setFormData({
        invoice_type: 'other',
        recipient_type: 'tournament',
        recipient_id: '',
        recipient_name: '',
        amount: '',
        tax_amount: '',
        due_date: defaultDueDate.toISOString().split('T')[0],
        description: ''
      })
    }
  }, [invoice, isOpen])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const calculateTotal = () => {
    const amount = parseFloat(formData.amount) || 0
    const taxAmount = parseFloat(formData.tax_amount) || 0
    return amount + taxAmount
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const invoiceData = {
      invoice_type: formData.invoice_type,
      recipient_type: formData.recipient_type,
      recipient_id: parseInt(formData.recipient_id),
      recipient_name: formData.recipient_name,
      amount: parseFloat(formData.amount),
      tax_amount: formData.tax_amount ? parseFloat(formData.tax_amount) : undefined,
      due_date: formData.due_date,
      description: formData.description || undefined
    }

    onSave(invoiceData)
  }

  const resetForm = () => {
    const defaultDueDate = new Date()
    defaultDueDate.setDate(defaultDueDate.getDate() + 30)
    
    setFormData({
      invoice_type: 'other',
      recipient_type: 'tournament',
      recipient_id: '',
      recipient_name: '',
      amount: '',
      tax_amount: '',
      due_date: defaultDueDate.toISOString().split('T')[0],
      description: ''
    })
  }

  const handleClose = () => {
    if (!loading) {
      if (!invoice) resetForm()
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center pb-3">
          <h3 className="text-lg font-bold text-gray-900">
            {invoice ? 'Edit Invoice' : 'Create Invoice'}
          </h3>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Invoice Type *
              </label>
              <select
                name="invoice_type"
                value={formData.invoice_type}
                onChange={handleInputChange}
                required
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {invoiceTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recipient Type *
              </label>
              <select
                name="recipient_type"
                value={formData.recipient_type}
                onChange={handleInputChange}
                required
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {recipientTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recipient ID *
              </label>
              <input
                type="number"
                name="recipient_id"
                value={formData.recipient_id}
                onChange={handleInputChange}
                required
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                placeholder="Enter recipient ID"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recipient Name *
              </label>
              <input
                type="text"
                name="recipient_name"
                value={formData.recipient_name}
                onChange={handleInputChange}
                required
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                placeholder="Enter recipient name"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount *
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                required
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tax Amount
              </label>
              <input
                type="number"
                name="tax_amount"
                value={formData.tax_amount}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Amount
              </label>
              <div className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 font-medium">
                ${calculateTotal().toFixed(2)}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Due Date *
            </label>
            <input
              type="date"
              name="due_date"
              value={formData.due_date}
              onChange={handleInputChange}
              required
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              disabled={loading}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              placeholder="Enter invoice description"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : (invoice ? 'Update Invoice' : 'Create Invoice')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default InvoiceModal