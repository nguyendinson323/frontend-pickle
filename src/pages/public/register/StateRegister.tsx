import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'
import FileUpload from '../../../components/common/FileUpload'
import PrivacyPolicyModal from '../../../components/common/PrivacyPolicyModal'

const StateRegister: React.FC = () => {
  const { data: appData } = useSelector((state: RootState) => state.appData)
  const states = appData?.states || []
  
  const [formData, setFormData] = useState({
    name: '',
    rfc: '',
    president_name: '',
    president_title: '',
    email: '',
    institutional_email: '',
    phone: '',
    state_id: '',
    website: '',
    social_media: '',
    username: '',
    password: '',
    password_confirmation: '',
    privacy_accepted: false
  })
  
  const [uploadedUrls, setUploadedUrls] = useState({
    logo_url: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleFileUpload = (cloudinaryUrl: string | null) => {
    setUploadedUrls(prev => ({ ...prev, logo_url: cloudinaryUrl || '' }))
    if (errors.logo_url) {
      setErrors(prev => ({ ...prev, logo_url: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Required fields based on database models
    if (!formData.name.trim()) newErrors.name = 'Association name is required'
    if (!formData.state_id) newErrors.state_id = 'State is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    if (!formData.username.trim()) newErrors.username = 'Username is required'
    if (!formData.password) newErrors.password = 'Password is required'
    if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'Passwords do not match'
    }
    if (!formData.privacy_accepted) newErrors.privacy_accepted = 'You must accept the privacy policy'

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    // Institutional email validation (optional field)
    if (formData.institutional_email && formData.institutional_email.trim() && !emailRegex.test(formData.institutional_email)) {
      newErrors.institutional_email = 'Please enter a valid institutional email address'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      // Prepare complete registration data
      const registrationData = {
        // User data
        role: 'state',
        username: formData.username,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || null,
        
        // StateCommittee data
        name: formData.name,
        president_name: formData.president_name || null,
        president_title: formData.president_title || null,
        rfc: formData.rfc || null,
        state_id: parseInt(formData.state_id),
        logo_url: uploadedUrls.logo_url || null,
        website: formData.website || null,
        social_media: formData.social_media || null,
        institutional_email: formData.institutional_email || null
      }

      // API call
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/register/state`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(registrationData)
      })
      
      if (!response.ok) {
        throw new Error('Registration failed')
      }
      
      const result = await response.json()
      alert('Registration successful! Please check your email for verification.')
      
      // Reset form
      setFormData({
        name: '',
        rfc: '',
        president_name: '',
        president_title: '',
        email: '',
        institutional_email: '',
        phone: '',
        state_id: '',
        website: '',
        social_media: '',
        username: '',
        password: '',
        password_confirmation: '',
        privacy_accepted: false
      })
      setUploadedUrls({ logo_url: '' })
      
    } catch (error) {
      setIsSubmitting(false)
      console.error('Registration failed:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">State Committee Registration</h1>
            <p className="text-gray-600">Register your state committee with the Mexican Pickleball Federation</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Committee Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Association/Committee Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., State of Mexico Pickleball Committee"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="rfc" className="block text-sm font-medium text-gray-700 mb-2">
                  RFC (Optional)
                </label>
                <input
                  type="text"
                  id="rfc"
                  name="rfc"
                  value={formData.rfc}
                  onChange={handleInputChange}
                  placeholder="Committee tax ID"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="president_name" className="block text-sm font-medium text-gray-700 mb-2">
                  President/Representative Name
                </label>
                <input
                  type="text"
                  id="president_name"
                  name="president_name"
                  value={formData.president_name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.president_name ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.president_name && <p className="mt-1 text-sm text-red-600">{errors.president_name}</p>}
              </div>

              <div>
                <label htmlFor="president_title" className="block text-sm font-medium text-gray-700 mb-2">
                  Role/Title
                </label>
                <input
                  type="text"
                  id="president_title"
                  name="president_title"
                  value={formData.president_title}
                  onChange={handleInputChange}
                  placeholder="e.g., President, Director, Coordinator"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="state_id" className="block text-sm font-medium text-gray-700 mb-2">
                  State *
                </label>
                <select
                  id="state_id"
                  name="state_id"
                  value={formData.state_id}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.state_id ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select State</option>
                  {states.map((state) => (
                    <option key={state.id} value={state.id}>
                      {state.name}
                    </option>
                  ))}
                </select>
                {errors.state_id && <p className="mt-1 text-sm text-red-600">{errors.state_id}</p>}
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="institutional_email" className="block text-sm font-medium text-gray-700 mb-2">
                  Institutional Email
                </label>
                <input
                  type="email"
                  id="institutional_email"
                  name="institutional_email"
                  value={formData.institutional_email}
                  onChange={handleInputChange}
                  placeholder="committee@state.gov.mx"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.institutional_email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.institutional_email && <p className="mt-1 text-sm text-red-600">{errors.institutional_email}</p>}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone / WhatsApp
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
              </div>

              <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                  Website (Optional)
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://yourcommittee.gov.mx"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="social_media" className="block text-sm font-medium text-gray-700 mb-2">
                  Social Media (Optional)
                </label>
                <input
                  type="text"
                  id="social_media"
                  name="social_media"
                  value={formData.social_media}
                  onChange={handleInputChange}
                  placeholder="Facebook, Instagram, etc."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* State Committee Responsibilities */}
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-red-800 mb-3">State Committee Responsibilities</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• Organize state-level tournaments and championships</li>
                  <li>• Oversee clubs and partners within the state</li>
                  <li>• Coordinate with national federation</li>
                  <li>• Promote pickleball development in the region</li>
                </ul>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• Manage state player affiliations</li>
                  <li>• Maintain state committee microsite</li>
                  <li>• Send announcements to state members</li>
                  <li>• Generate state activity reports</li>
                </ul>
              </div>
            </div>

            {/* Logo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Committee Logo (Optional)
              </label>
              <FileUpload
                accept="image/*"
                onFileSelect={handleFileUpload}
                error={errors.logo_url}
                helpText="Upload your committee logo in PNG, JPG, or JPEG format"
                uploadEndpoint="/api/upload/logo"
              />
            </div>

            {/* State Committee Benefits */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-blue-800 mb-2">State Committee Benefits</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Full administrative dashboard access</li>
                  <li>• Tournament creation and management tools</li>
                  <li>• Member and club oversight capabilities</li>
                  <li>• Custom microsite for state promotion</li>
                </ul>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Direct communication with federation</li>
                  <li>• State statistics and reporting</li>
                  <li>• Priority support and resources</li>
                  <li>• Official recognition and credibility</li>
                </ul>
              </div>
            </div>

            {/* Account Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Username *
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.username ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
              </div>

              <div>
                <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  id="password_confirmation"
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.password_confirmation ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.password_confirmation && <p className="mt-1 text-sm text-red-600">{errors.password_confirmation}</p>}
              </div>
            </div>

            {/* Important Notice */}
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Important Notice</h3>
                  <p className="text-sm text-yellow-700 mt-2">
                    State committee registration requires approval from the Mexican Pickleball Federation. 
                    Once submitted, your application will be reviewed and you will be contacted within 5-7 business days.
                  </p>
                </div>
              </div>
            </div>

            {/* Privacy Policy */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <input
                    id="privacy_accepted"
                    name="privacy_accepted"
                    type="checkbox"
                    checked={formData.privacy_accepted}
                    onChange={handleInputChange}
                    className={`mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ${
                      errors.privacy_accepted ? 'border-red-500' : ''
                    }`}
                  />
                </div>
                <div className="ml-3">
                  <label htmlFor="privacy_accepted" className="text-sm text-gray-700">
                    I have read and accept the{' '}
                    <button
                      type="button"
                      onClick={() => setShowPrivacyModal(true)}
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Privacy Policy
                    </button>{' '}
                    *
                  </label>
                  {errors.privacy_accepted && <p className="mt-1 text-sm text-red-600">{errors.privacy_accepted}</p>}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors duration-200 ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {isSubmitting ? 'Registering...' : 'Register State Committee'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <PrivacyPolicyModal onClose={() => setShowPrivacyModal(false)} />
      )}
    </div>
  )
}

export default StateRegister