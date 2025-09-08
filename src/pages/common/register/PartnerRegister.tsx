import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '../../../components/layout'
import { loginSuccess } from '../../../store/slices/authSlice'
import { useDispatch as useReduxDispatch } from 'react-redux'
import { AppDispatch } from '../../../store'
import axios from 'axios'

const BASE_URL = 'http://localhost:5000'

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
import { PartnerRegisterRequest } from '../../../types'

const PartnerRegisterPage: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useReduxDispatch<AppDispatch>()

  const [formData, setFormData] = useState<PartnerRegisterRequest>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    businessName: '',
    contactPersonName: '',
    partnerType: 'hotel',
    state: '',
    rfc: '',
    businessLogoUrl: '',
    privacyPolicyAccepted: false
  })

  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  const mexicanStates = [
    'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche', 'Chiapas', 'Chihuahua',
    'Coahuila', 'Colima', 'Durango', 'Guanajuato', 'Guerrero', 'Hidalgo', 'Jalisco', 'México',
    'Michoacán', 'Morelos', 'Nayarit', 'Nuevo León', 'Oaxaca', 'Puebla', 'Querétaro',
    'Quintana Roo', 'San Luis Potosí', 'Sinaloa', 'Sonora', 'Tabasco', 'Tamaulipas', 'Tlaxcala',
    'Veracruz', 'Yucatán', 'Zacatecas', 'Ciudad de México'
  ]

  const partnerTypes = [
    { value: 'hotel', label: 'Hotel/Resort', description: 'Hotels and resorts with pickleball facilities', icon: '🏨' },
    { value: 'sports_center', label: 'Sports Center', description: 'Dedicated sports facilities with courts', icon: '🏟️' },
    { value: 'country_club', label: 'Country Club', description: 'Private clubs with recreational facilities', icon: '⛳' },
    { value: 'business', label: 'Business', description: 'Other businesses offering pickleball services', icon: '🏢' }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const uploadData = new FormData()
    uploadData.append('file', file)
    uploadData.append('upload_preset', 'your_upload_preset')

    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/your_cloud_name/image/upload', {
        method: 'POST',
        body: uploadData
      })
      
      const data = await response.json()
      
      setFormData(prev => ({ ...prev, businessLogoUrl: data.secure_url }))
      setLogoPreview(data.secure_url)
    } catch (error) {
      console.error('Upload failed:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const registerData = {
        userData: {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: 'partner' as const,
          phone: formData.phoneNumber
        },
        profileData: {
          business_name: formData.businessName,
          contact_name: formData.contactPersonName,
          contact_title: 'Contact Person',
          partner_type: formData.partnerType,
          state_id: mexicanStates.indexOf(formData.state) + 1,
          rfc: formData.rfc,
          logo_url: formData.businessLogoUrl,
          has_courts: true
        }
      }

      const response = await apiClient.post('/api/auth/register', registerData)
      dispatch(loginSuccess(response.data))
      navigate('/partner/dashboard')
    } catch (error) {
      console.error('Registration failed:', error)
    }
  }

  const handleBackToSelect = () => {
    navigate('/register')
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center">
                <span className="text-2xl">🏨</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Partner Registration</h1>
            <p className="text-gray-600">Register your business as a federation partner</p>
          </div>

          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="bg-orange-600 text-white p-6">
              <h2 className="text-xl font-semibold mb-2">Complete Your Partner Profile</h2>
              <p className="text-orange-100">Join as a business partner and offer pickleball services</p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Account Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Username *</label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                      placeholder="Choose a unique username"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                      placeholder="business@example.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                      placeholder="Create a secure password"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                      placeholder="Confirm your password"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                      placeholder="+52 55 1234 5678"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Business Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Business Name *</label>
                    <input
                      type="text"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                      placeholder="Official name of your business"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person Name *</label>
                    <input
                      type="text"
                      name="contactPersonName"
                      value={formData.contactPersonName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                      placeholder="Full name of main contact person"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State Location *</label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                    >
                      <option value="">Select state where business is located</option>
                      {mexicanStates.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">RFC (Optional)</label>
                    <input
                      type="text"
                      name="rfc"
                      value={formData.rfc}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                      placeholder="Tax identification number"
                      maxLength={13}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a1.994 1.994 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Partner Type
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {partnerTypes.map(type => (
                    <div key={type.value} className="relative">
                      <input
                        type="radio"
                        name="partnerType"
                        value={type.value}
                        checked={formData.partnerType === type.value}
                        onChange={handleInputChange}
                        className="sr-only"
                        id={`partnerType-${type.value}`}
                      />
                      <label
                        htmlFor={`partnerType-${type.value}`}
                        className={`block p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                          formData.partnerType === type.value
                            ? 'border-orange-500 bg-orange-50 text-orange-900'
                            : 'border-gray-300 hover:border-orange-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center mb-2">
                          <span className="text-2xl mr-2">{type.icon}</span>
                          <div className="font-semibold">{type.label}</div>
                        </div>
                        <div className="text-sm text-gray-600">{type.description}</div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Business Logo & Branding
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Logo *</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-500 transition-colors duration-200">
                    {logoPreview ? (
                      <div className="space-y-4">
                        <img src={logoPreview} alt="Business logo preview" className="w-24 h-24 mx-auto object-contain" />
                        <p className="text-sm text-green-600">Logo uploaded successfully</p>
                        <button
                          type="button"
                          onClick={() => {
                            setLogoPreview(null)
                            setFormData(prev => ({ ...prev, businessLogoUrl: '' }))
                          }}
                          className="text-sm text-red-600 hover:text-red-500"
                        >
                          Remove logo
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <svg className="w-12 h-12 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <div>
                          <p className="text-lg font-medium text-gray-900">Upload your business logo</p>
                          <p className="text-sm text-gray-600">PNG, JPG, or SVG files up to 10MB</p>
                        </div>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="mt-4"
                      required={!logoPreview}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-blue-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-2">Partner Benefits & Features</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Court rental management system</li>
                      <li>• Event hosting and tournament organization</li>
                      <li>• Business microsite with federation integration</li>
                      <li>• Revenue tracking and reporting tools</li>
                      <li>• Partner directory listing and promotion</li>
                      <li>• Access to federation player database</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    name="privacyPolicyAccepted"
                    checked={formData.privacyPolicyAccepted}
                    onChange={handleInputChange}
                    required
                    className="mt-1 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <div className="ml-3">
                    <p className="text-sm text-gray-700">
                      I accept the{' '}
                      <button type="button" className="text-orange-600 hover:text-orange-500 underline">
                        Privacy Policy
                      </button>{' '}
                      and{' '}
                      <button type="button" className="text-orange-600 hover:text-orange-500 underline">
                        Terms of Service
                      </button>{' '}
                      of the Mexican Pickleball Federation. I confirm that I have the authority to register this business as a federation partner and that all provided information is accurate and up-to-date. I understand that partner membership includes premium features and associated fees.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <button
                  type="button"
                  onClick={handleBackToSelect}
                  className="text-gray-600 hover:text-gray-800 px-8 py-3 text-lg font-medium transition-colors duration-200"
                >
                  ← Back to User Selection
                </button>
                
                <button
                  type="submit"
                  disabled={false}
                  className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-12 py-3 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  {false ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Partner Account...
                    </div>
                  ) : (
                    'Complete Partner Registration'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default PartnerRegisterPage