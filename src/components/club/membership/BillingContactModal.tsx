import React, { useState, useEffect } from 'react'
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiHome,
  FiX,
  FiSave,
  FiEdit3
} from 'react-icons/fi'

interface ClubInfo {
  id: number
  name: string
  has_courts: boolean
  premium_expires_at: string | null
  affiliation_expires_at: string | null
}

interface BillingContactModalProps {
  isOpen: boolean
  onClose: () => void
  clubInfo: ClubInfo | null
  onUpdate: (contactData: {
    billing_contact_name: string
    billing_contact_email: string
    billing_contact_phone: string
    billing_address: string
    billing_city: string
    billing_state: string
    billing_zip: string
  }) => void
  loading: boolean
}

const BillingContactModal: React.FC<BillingContactModalProps> = ({
  isOpen,
  onClose,
  clubInfo,
  onUpdate,
  loading
}) => {
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zipCode, setZipCode] = useState('')

  useEffect(() => {
    if (clubInfo) {
      setContactName(clubInfo.name || '')
      // In a real implementation, these would come from the club's billing information
      setContactEmail('')
      setContactPhone('')
      setAddress('')
      setCity('')
      setState('')
      setZipCode('')
    }
  }, [clubInfo])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    onUpdate({
      billing_contact_name: contactName,
      billing_contact_email: contactEmail,
      billing_contact_phone: contactPhone,
      billing_address: address,
      billing_city: city,
      billing_state: state,
      billing_zip: zipCode
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white shadow-2xl rounded-3xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white p-6 border-b-4 border-green-800">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold flex items-center">
                <FiEdit3 className="h-6 w-6 mr-3" />
                Edit Billing Contact
              </h3>
              <p className="text-green-100 text-sm font-medium mt-1">
                Update your billing information and contact details
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 p-2 rounded-xl hover:bg-white hover:bg-opacity-20 transition-all duration-200"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Contact Information Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6">
              <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <FiUser className="h-5 w-5 mr-2" />
                Contact Information
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center">
                    <FiUser className="h-4 w-4 mr-2" />
                    Contact Name *
                  </label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Enter contact name"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl font-medium bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 hover:border-gray-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center">
                    <FiMail className="h-4 w-4 mr-2" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="billing@club.com"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl font-medium bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 hover:border-gray-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center">
                    <FiPhone className="h-4 w-4 mr-2" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl font-medium bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 hover:border-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Billing Address Section */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-6">
              <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <FiHome className="h-5 w-5 mr-2" />
                Billing Address
              </h4>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center">
                    <FiMapPin className="h-4 w-4 mr-2" />
                    Street Address *
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="123 Main Street"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl font-medium bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 hover:border-gray-400"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center">
                      <FiMapPin className="h-4 w-4 mr-2" />
                      City *
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="City"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl font-medium bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 hover:border-gray-400"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center">
                      <FiMapPin className="h-4 w-4 mr-2" />
                      State *
                    </label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="State"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl font-medium bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 hover:border-gray-400"
                      required
                    />
                  </div>
                </div>

                <div className="w-1/2">
                  <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center">
                    <FiMapPin className="h-4 w-4 mr-2" />
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="12345"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl font-medium bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 hover:border-gray-400"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border-2 border-gray-300 rounded-2xl text-gray-700 font-bold hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 hover:shadow-md"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-2xl hover:from-green-700 hover:to-emerald-800 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 flex items-center font-bold shadow-lg hover:shadow-xl transition-all duration-200 hover:transform hover:scale-105"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <FiSave className="w-4 h-4 mr-2" />
                    Update Contact
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

export default BillingContactModal