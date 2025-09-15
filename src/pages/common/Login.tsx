import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { FiUser, FiLock, FiEye, FiEyeOff, FiLogIn, FiUserPlus, FiAward, FiUsers, FiBriefcase, FiMapPin, FiSettings } from 'react-icons/fi'
import { login } from '../../store/slices/authSlice'
import { LoginRequest, LoginResponse } from '../../types'
import { AppDispatch } from '../../store'

const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()

  const [formData, setFormData] = useState<LoginRequest>({
    username: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.username.trim() || !formData.password.trim()) {
      return
    }

    // Dispatch the login action
    const result = await dispatch(login(formData)) as any
    
    // Check if login failed
    if (result.error) {
      console.error('❌ Login failed:', result.error)
      // You can display error to user here if needed
      // For example: setErrorMessage(result.error)
      return
    }
    
    // Login successful
    const loginData = result as LoginResponse
    // Redirect based on user role
    const userRole = loginData.user.role
    console.log('🔄 Redirecting to dashboard for role:', userRole)
    
    switch (userRole) {
      case 'admin':
        navigate('/admin/dashboard')
        break
      case 'player':
        navigate('/player/dashboard')
        break
      case 'coach':
        navigate('/coach/dashboard')
        break
      case 'club':
        navigate('/club/dashboard')
        break
      case 'partner':
        navigate('/partner/dashboard')
        break
      case 'state':
        navigate('/state/dashboard')
        break
      default:
        console.warn('⚠️ Unknown user role, redirecting to generic dashboard')
        navigate('/dashboard')
    }
  }

  const handleForgotPassword = () => {
    navigate('/forgot-password')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-green-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-xl animate-pulse opacity-30" />
        <div className="absolute top-1/4 right-20 w-48 h-48 bg-green-300 rounded-full blur-2xl animate-bounce opacity-20" />
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-teal-300 rounded-full blur-xl animate-ping opacity-25" />
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-emerald-300 rounded-full blur-lg animate-pulse opacity-30" />
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Enhanced Header */}
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mb-6 shadow-2xl border border-white/20">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-2xl">🏓</span>
                </div>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center animate-pulse">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
              Pickleball Federation
            </h1>
            <h2 className="text-2xl font-semibold text-white">
              Welcome Back
            </h2>
            <p className="text-green-100 text-lg max-w-sm mx-auto leading-relaxed">
              Sign in to access your federation dashboard and manage your profile
            </p>
          </div>
        </div>

        {/* Enhanced Login Form */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
          <div className="mb-8 text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Sign In</h3>
            <div className="w-12 h-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mx-auto"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Enhanced Username/Email Field */}
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-semibold text-gray-700 flex items-center">
                <FiUser className="w-4 h-4 mr-2 text-green-600" />
                Username or Email
              </label>
              <div className="relative group">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleInputChange}
                  className="appearance-none relative block w-full px-4 py-4 pl-12 border-2 border-gray-200 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 group-hover:border-green-300"
                  placeholder="Enter your username or email"
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiUser className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors duration-300" />
                </div>
              </div>
            </div>

            {/* Enhanced Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 flex items-center">
                <FiLock className="w-4 h-4 mr-2 text-green-600" />
                Password
              </label>
              <div className="relative group">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="appearance-none relative block w-full px-4 py-4 pl-12 pr-12 border-2 border-gray-200 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 group-hover:border-green-300"
                  placeholder="Enter your password"
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors duration-300" />
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center hover:text-green-600 focus:text-green-600 transition-colors duration-300"
                >
                  {showPassword ? (
                    <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-green-600 transition-colors duration-300" />
                  ) : (
                    <FiEye className="h-5 w-5 text-gray-400 hover:text-green-600 transition-colors duration-300" />
                  )}
                </button>
              </div>
            </div>

            {/* Enhanced Remember Me & Forgot Password */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded transition-colors duration-200"
                />
                <label htmlFor="remember-me" className="ml-3 block text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors duration-200">
                  Remember me
                </label>
              </div>

              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-green-600 hover:text-green-500 font-semibold transition-all duration-200 hover:underline"
              >
                Forgot password?
              </button>
            </div>

            {/* Enhanced Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={false || !formData.username.trim() || !formData.password.trim()}
                className="group relative w-full flex justify-center py-4 px-6 border border-transparent text-lg font-bold rounded-xl text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl disabled:transform-none disabled:shadow-none"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-700 to-emerald-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center">
                  {false ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    <>
                      <FiLogIn className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                      Sign In to Dashboard
                      <div className="ml-3 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300">
                        →
                      </div>
                    </>
                  )}
                </div>
              </button>
            </div>

            {/* Enhanced Registration Link */}
            <div className="text-center pt-6 border-t border-gray-200">
              <p className="text-gray-600 mb-4">
                Don't have an account yet?
              </p>
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="group inline-flex items-center px-6 py-3 text-sm font-semibold text-green-600 hover:text-green-700 border-2 border-green-200 hover:border-green-300 rounded-xl transition-all duration-300 hover:bg-green-50"
              >
                <FiUserPlus className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                Create New Account
              </button>
            </div>
          </form>
        </div>

        {/* Enhanced User Type Information */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-white mb-2">Federation Account Types</h3>
            <div className="w-16 h-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { type: 'Player', desc: 'Individual athletes', icon: FiAward, color: 'from-blue-400 to-blue-600' },
              { type: 'Coach', desc: 'Certified trainers', icon: FiUsers, color: 'from-purple-400 to-purple-600' },
              { type: 'Club', desc: 'Team organizations', icon: FiUsers, color: 'from-green-400 to-green-600' },
              { type: 'Partner', desc: 'Business entities', icon: FiBriefcase, color: 'from-orange-400 to-orange-600' },
              { type: 'State', desc: 'Regional committees', icon: FiMapPin, color: 'from-red-400 to-red-600' },
              { type: 'Admin', desc: 'System administrators', icon: FiSettings, color: 'from-gray-400 to-gray-600' }
            ].map((account) => {
              const IconComponent = account.icon
              return (
                <div key={account.type} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 bg-gradient-to-br ${account.color} rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-white text-sm">{account.type}</div>
                      <div className="text-green-100 text-xs">{account.desc}</div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-white/20">
            <p className="text-center text-green-100 text-sm">
              Each account type has specialized dashboard features and permissions
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage