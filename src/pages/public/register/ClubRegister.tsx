import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'
import FileUpload from '../../../components/common/FileUpload'
import PrivacyPolicyModal from '../../../components/common/PrivacyPolicyModal'

const ClubRegister: React.FC = () => {
  const { data: appData } = useSelector((state: RootState) => state.appData)
  const states = appData?.states || []
  
  const [formData, setFormData] = useState({
    name: '',
    rfc: '',
    manager_name: '',
    manager_title: '',
    email: '',
    phone: '',
    state_id: '',
    club_type: '',
    website: '',
    social_media: '',
    has_courts: false,
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

  const clubTypes = [
    'Recreational Club',
    'Competitive Club', 
    'Youth Club',
    'Senior Club',
    'Corporate Club',
    'Community Club'
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }

    // Clear error when user starts typing
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
    if (!formData.name.trim()) newErrors.name = 'Club name is required'
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

    // RFC validation (optional but if provided should be valid format)
    if (formData.rfc && formData.rfc.length < 12) {
      newErrors.rfc = 'RFC must be at least 12 characters'
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
        role: 'club',
        username: formData.username,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || null,
        
        // Club data
        name: formData.name,
        rfc: formData.rfc || null,
        manager_name: formData.manager_name || null,
        manager_title: formData.manager_title || null,
        state_id: formData.state_id ? parseInt(formData.state_id) : null,
        club_type: formData.club_type || null,
        website: formData.website || null,
        social_media: formData.social_media || null,
        logo_url: uploadedUrls.logo_url || null,
        has_courts: formData.has_courts
      }

      // API call
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/register/club`, {
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
        manager_name: '',
        manager_title: '',
        email: '',
        phone: '',
        state_id: '',
        club_type: '',
        website: '',
        social_media: '',
        has_courts: false,
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Club Registration</h1>
            <p className="text-gray-600">Register your pickleball club with the Mexican Federation</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Club Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Club Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
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
                  placeholder="Club tax ID"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.rfc ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.rfc && <p className="mt-1 text-sm text-red-600">{errors.rfc}</p>}
              </div>

              <div>
                <label htmlFor="manager_name" className="block text-sm font-medium text-gray-700 mb-2">
                  Club Manager
                </label>
                <input
                  type="text"
                  id="manager_name"
                  name="manager_name"
                  value={formData.manager_name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.manager_name ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.manager_name && <p className="mt-1 text-sm text-red-600">{errors.manager_name}</p>}
              </div>

              <div>
                <label htmlFor="manager_title" className="block text-sm font-medium text-gray-700 mb-2">
                  Manager Title
                </label>
                <input
                  type="text"
                  id="manager_title"
                  name="manager_title"
                  value={formData.manager_title}
                  onChange={handleInputChange}
                  placeholder="e.g., President, Director"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="state_id" className="block text-sm font-medium text-gray-700 mb-2">
                  State
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

              <div>
                <label htmlFor="club_type" className="block text-sm font-medium text-gray-700 mb-2">
                  Club Type
                </label>
                <select
                  id="club_type"
                  name="club_type"
                  value={formData.club_type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Club Type</option>
                  {clubTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Email *
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
                  placeholder="https://yourclub.com"
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

            {/* Courts and Services */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center mb-4">
                <input
                  id="has_courts"
                  name="has_courts"
                  type="checkbox"
                  checked={formData.has_courts}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="has_courts" className="ml-2 text-sm font-medium text-purple-900">
                  Our club has courts available for rental
                </label>
              </div>
              
              {formData.has_courts && (
                <div className="mt-3 p-3 bg-purple-100 rounded">
                  <h4 className="text-sm font-medium text-purple-800 mb-2">Premium Club Benefits:</h4>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>• Register courts in the system for public viewing and booking</li>
                    <li>• Create and manage tournaments directly from the platform</li>
                    <li>• Generate revenue from court rentals</li>
                    <li>• Access to advanced club management tools</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Logo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Club Logo (Optional)
              </label>
              <FileUpload
                accept="image/*"
                onFileSelect={handleFileUpload}
                error={errors.logo_url}
                helpText="Upload your club logo in PNG, JPG, or JPEG format"
                uploadEndpoint="/api/upload/logo"
              />
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

            {/* Club Benefits */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-blue-800 mb-2">Club Membership Benefits</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Official federation recognition and credibility</li>
                <li>• Access to sanctioned tournaments and events</li>
                <li>• Member management and communication tools</li>
                <li>• Club microsite for online presence</li>
                <li>• Networking with other clubs and players</li>
                <li>• Priority support from federation</li>
              </ul>
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
                    : 'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                {isSubmitting ? 'Registering...' : 'Register Club'}
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

export default ClubRegister