import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'
import FileUpload from '../../../components/common/FileUpload'
import InteractiveCropUpload from '../../../components/common/InteractiveCropUpload'
import PrivacyPolicyModal from '../../../components/common/PrivacyPolicyModal'

const PlayerRegister: React.FC = () => {
  const { data: appData } = useSelector((state: RootState) => state.appData)
  const states = appData?.states || []
  
  const [formData, setFormData] = useState({
    full_name: '',
    birth_date: '',
    gender: '',
    state_id: '',
    curp: '',
    nrtp_level: '',
    nationality: 'Mexico',
    club_id: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    password_confirmation: '',
    privacy_accepted: false
  })
  
  const [files, setFiles] = useState({
    profile_photo: null as File | null,
    id_document: null as File | null
  })
  
  const [uploadedUrls, setUploadedUrls] = useState({
    profile_photo_url: '',
    id_document_url: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return ''
    const today = new Date()
    const birth = new Date(birthDate)
    const age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      return (age - 1).toString()
    }
    return age.toString()
  }

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

  const handleProfilePhotoUpload = (cloudinaryUrl: string | null) => {
    setUploadedUrls(prev => ({ ...prev, profile_photo_url: cloudinaryUrl || '' }))
    if (errors.profile_photo) {
      setErrors(prev => ({ ...prev, profile_photo: '' }))
    }
  }

  const handleDocumentUpload = (cloudinaryUrl: string | null) => {
    setUploadedUrls(prev => ({ ...prev, id_document_url: cloudinaryUrl || '' }))
    if (errors.id_document) {
      setErrors(prev => ({ ...prev, id_document: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Required fields based on database models
    if (!formData.full_name.trim()) newErrors.full_name = 'Full name is required'
    if (!formData.birth_date) newErrors.birth_date = 'Date of birth is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    if (!formData.username.trim()) newErrors.username = 'Username is required'
    if (!formData.password) newErrors.password = 'Password is required'
    if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'Passwords do not match'
    }
    if (!uploadedUrls.id_document_url) newErrors.id_document = 'ID document is required'
    if (!formData.privacy_accepted) newErrors.privacy_accepted = 'You must accept the privacy policy'

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // CURP validation (18 characters for Mexico) - optional field
    if (formData.curp && formData.curp.trim() && formData.curp.length !== 18) {
      newErrors.curp = 'CURP must be 18 characters long'
    }

    // NRTP Level validation
    if (formData.nrtp_level) {
      const level = parseFloat(formData.nrtp_level)
      if (level < 1.0 || level > 5.0) {
        newErrors.nrtp_level = 'NRTP level must be between 1.0 and 5.0'
      }
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
        role: 'player',
        username: formData.username,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || null,
        
        // Player data
        full_name: formData.full_name,
        birth_date: formData.birth_date,
        gender: formData.gender || null,
        state_id: formData.state_id ? parseInt(formData.state_id) : null,
        curp: formData.curp || null,
        nrtp_level: formData.nrtp_level ? parseFloat(formData.nrtp_level) : null,
        nationality: formData.nationality || null,
        club_id: formData.club_id ? parseInt(formData.club_id) : null,
        profile_photo_url: uploadedUrls.profile_photo_url || null,
        id_document_url: uploadedUrls.id_document_url
      }

      // API call would go here
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/register/player`, {
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
        full_name: '',
        birth_date: '',
        gender: '',
        state_id: '',
        curp: '',
        nrtp_level: '',
        nationality: 'Mexico',
        club_id: '',
        email: '',
        phone: '',
        username: '',
        password: '',
        password_confirmation: '',
        privacy_accepted: false
      })
      setUploadedUrls({
        profile_photo_url: '',
        id_document_url: ''
      })
      
    } catch (error) {
      setIsSubmitting(false)
      console.error('Registration failed:', error)
    }
  }

  const currentAge = calculateAge(formData.birth_date)

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Player Registration</h1>
            <p className="text-gray-600">Join the Mexican Pickleball Federation as a player</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Photo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Photo
              </label>
              <InteractiveCropUpload
                onFileSelect={handleProfilePhotoUpload}
                error={errors.profile_photo}
              />
            </div>

            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.full_name ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.full_name && <p className="mt-1 text-sm text-red-600">{errors.full_name}</p>}
              </div>

              <div>
                <label htmlFor="birth_date" className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  id="birth_date"
                  name="birth_date"
                  value={formData.birth_date}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.birth_date ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.birth_date && <p className="mt-1 text-sm text-red-600">{errors.birth_date}</p>}
                {currentAge && (
                  <p className="mt-1 text-sm text-gray-500">Age: {currentAge} years</p>
                )}
              </div>

              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.gender ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender}</p>}
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
                <label htmlFor="curp" className="block text-sm font-medium text-gray-700 mb-2">
                  CURP
                </label>
                <input
                  type="text"
                  id="curp"
                  name="curp"
                  value={formData.curp}
                  onChange={handleInputChange}
                  maxLength={18}
                  placeholder="18-character CURP"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.curp ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.curp && <p className="mt-1 text-sm text-red-600">{errors.curp}</p>}
              </div>

              <div>
                <label htmlFor="nrtp_level" className="block text-sm font-medium text-gray-700 mb-2">
                  NRTP Level
                </label>
                <input
                  type="number"
                  id="nrtp_level"
                  name="nrtp_level"
                  value={formData.nrtp_level}
                  onChange={handleInputChange}
                  min="1.0"
                  max="5.0"
                  step="0.1"
                  placeholder="e.g., 3.5"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.nrtp_level ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.nrtp_level && <p className="mt-1 text-sm text-red-600">{errors.nrtp_level}</p>}
                <p className="mt-1 text-xs text-gray-500">Scale: 1.0 (Beginner) to 5.0 (Professional)</p>
              </div>

              <div>
                <label htmlFor="nationality" className="block text-sm font-medium text-gray-700 mb-2">
                  Nationality
                </label>
                <input
                  type="text"
                  id="nationality"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
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
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Phone
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
            </div>

            {/* ID Document Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID Document (INE or Passport) *
              </label>
              <FileUpload
                accept=".pdf,.png,.jpg,.jpeg"
                onFileSelect={handleDocumentUpload}
                error={errors.id_document}
                helpText="Upload your INE or passport in PDF, PNG, or JPG format"
                uploadEndpoint="/api/upload/document"
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
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isSubmitting ? 'Registering...' : 'Register as Player'}
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

export default PlayerRegister