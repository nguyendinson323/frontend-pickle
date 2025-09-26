import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../store'
import {
  fetchStateMembershipData,
  fetchAffiliationRequirements,
  renewStateAffiliation,
  submitComplianceReport,
  updateStateCommitteeInformation,
  clearError
} from '../../store/slices/stateMembershipSlice'
import SimpleImageUpload from '../../components/common/SimpleImageUpload'
import { FiHome, FiAward, FiUsers, FiCheckCircle, FiXCircle, FiClock, FiDollarSign, FiMail, FiPhone, FiGlobe, FiShield, FiFileText, FiCalendar, FiArrowRight, FiX, FiCamera, FiEdit, FiRefreshCw } from 'react-icons/fi'

const StateMembership: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    stateCommittee,
    affiliationStatus,
    stateStatistics,
    paymentHistory,
    recentActivities,
    complianceStatus,
    affiliationRequirements,
    loading,
    error
  } = useSelector((state: RootState) => state.stateMembership)

  const [activeTab, setActiveTab] = useState<'overview' | 'benefits' | 'governance'>('overview')
  const [showRenewalModal, setShowRenewalModal] = useState(false)
  const [showEditProfileModal, setShowEditProfileModal] = useState(false)
  const [profileFormData, setProfileFormData] = useState({
    president_name: '',
    president_title: '',
    logo_url: '',
    website: '',
    social_media: '',
    institutional_email: '',
    phone: ''
  })

  useEffect(() => {
    dispatch(fetchStateMembershipData())
    dispatch(fetchAffiliationRequirements())
  }, [dispatch])

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError())
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [error, dispatch])

  useEffect(() => {
    if (stateCommittee) {
      setProfileFormData({
        president_name: stateCommittee.president_name || '',
        president_title: stateCommittee.president_title || '',
        logo_url: stateCommittee.logo_url || '',
        website: stateCommittee.website || '',
        social_media: stateCommittee.social_media || '',
        institutional_email: stateCommittee.institutional_email || '',
        phone: stateCommittee.phone || ''
      })
    }
  }, [stateCommittee])

  const handleRenewalAffiliation = async () => {
    try {
      await dispatch(renewStateAffiliation({
        payment_method: 'credit_card'
      }))
      setShowRenewalModal(false)
    } catch (error) {
      console.error('Affiliation renewal failed:', error)
    }
  }

  const handleSubmitReport = async (reportType: string) => {
    try {
      await dispatch(submitComplianceReport(reportType, {
        submitted_by: stateCommittee?.president_name,
        submission_date: new Date().toISOString()
      }))
    } catch (error) {
      console.error('Report submission failed:', error)
    }
  }

  const handleProfileFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleLogoUpload = (imageUrl: string) => {
    setProfileFormData(prev => ({ ...prev, logo_url: imageUrl }))
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await dispatch(updateStateCommitteeInformation(profileFormData))
      setShowEditProfileModal(false)
    } catch (error) {
      console.error('Profile update failed:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount: number | string) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(numAmount)
  }

  const getComplianceColor = (completed: boolean) => {
    return completed ? 'text-green-600' : 'text-yellow-600'
  }

  const getComplianceIcon = (completed: boolean) => {
    return completed
      ? 'M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
      : 'M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 shadow-lg"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-400/20 to-purple-400/20 animate-pulse"></div>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-gray-900 mb-1">Loading State Membership</p>
            <p className="text-sm text-gray-600">Please wait while we fetch your data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-purple-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Modern Header */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 rounded-3xl shadow-2xl p-8 mb-8 text-white relative overflow-hidden backdrop-blur-sm">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-300/20 rounded-full translate-y-24 -translate-x-24 blur-2xl"></div>
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm shadow-lg">
                <FiHome className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">State Association Membership</h1>
            </div>
            <p className="text-blue-100 text-lg mb-4">Manage your state pickleball association effectively with comprehensive tools and insights</p>
            {stateCommittee && (
              <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  {stateCommittee.logo_url ? (
                    <img src={stateCommittee.logo_url} alt="Logo" className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <FiHome className="w-6 h-6 text-white" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-lg">{stateCommittee.name}</p>
                  <p className="text-blue-200">{stateCommittee.president_name} • {stateCommittee.president_title}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-2xl p-4 mb-6 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="bg-red-500 p-2 rounded-full">
                <FiXCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-red-800">Error</p>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Modern Tabs */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-2 mb-8">
          <nav className="flex space-x-2">
            {(
              [
                { key: 'overview', label: 'Overview', icon: FiHome },
                { key: 'benefits', label: 'Benefits', icon: FiAward },
                { key: 'governance', label: 'Governance', icon: FiShield }
              ] as const
            ).map((tab) => {
              const IconComponent = tab.icon
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center space-x-2 py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-300 ${
                    activeTab === tab.key
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/60'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Current Status */}
            <div className="bg-gradient-to-br from-white to-blue-50/30 rounded-3xl shadow-xl border border-gray-200/50 p-8 backdrop-blur-sm">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-blue-500 p-3 rounded-2xl shadow-lg">
                  <FiCheckCircle className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Association Status</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-6 border border-gray-200/50 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`p-2 rounded-xl ${
                      affiliationStatus?.isActive ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {affiliationStatus?.isActive ? (
                        <FiCheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <FiXCircle className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Status</p>
                  </div>
                  <p className={`text-2xl font-bold ${
                    affiliationStatus?.isActive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {affiliationStatus?.isActive ? 'Active' : 'Inactive'}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-6 border border-gray-200/50 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="bg-blue-100 p-2 rounded-xl">
                      <FiCalendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Member Since</p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {affiliationStatus?.memberSince ? new Date(affiliationStatus.memberSince).getFullYear() : 'N/A'}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-6 border border-gray-200/50 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="bg-orange-100 p-2 rounded-xl">
                      <FiClock className="w-5 h-5 text-orange-600" />
                    </div>
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Days Remaining</p>
                  </div>
                  <p className="text-2xl font-bold text-orange-600">
                    {affiliationStatus?.daysRemaining || 0}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-6 border border-gray-200/50 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="bg-purple-100 p-2 rounded-xl">
                      <FiRefreshCw className="w-5 h-5 text-purple-600" />
                    </div>
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Next Renewal</p>
                  </div>
                  <p className="text-2xl font-bold text-purple-600">
                    {affiliationStatus?.expiresAt ? formatDate(affiliationStatus.expiresAt) : 'N/A'}
                  </p>
                </div>
              </div>
              {affiliationStatus && !affiliationStatus.isActive && (
                <div className="mt-8 p-6 bg-gradient-to-r from-red-50 to-red-100 rounded-2xl border border-red-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-red-500 p-2 rounded-xl">
                        <FiXCircle className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-red-800">Membership Expired</p>
                        <p className="text-red-700">Renew your affiliation to continue accessing member benefits</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowRenewalModal(true)}
                      disabled={loading}
                      className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:from-red-600 hover:to-red-700 disabled:opacity-50 transition-all duration-200 hover:scale-105 flex items-center space-x-2"
                    >
                      <FiRefreshCw className="w-4 h-4" />
                      <span>Renew Now</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          {/* Committee Profile Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Committee Profile</h2>
              <button
                onClick={() => setShowEditProfileModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit Profile
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column - Logo and Basic Info */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                    {stateCommittee?.logo_url ? (
                      <img
                        src={stateCommittee.logo_url}
                        alt="Committee Logo"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl text-gray-400">🏛️</span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{stateCommittee?.name}</h3>
                    <p className="text-gray-600">{stateCommittee?.president_name}</p>
                    <p className="text-gray-500 text-sm">{stateCommittee?.president_title}</p>
                  </div>
                </div>
              </div>

              {/* Right Column - Contact Information */}
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">Website</p>
                  <p className="text-gray-600">{stateCommittee?.website || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Email</p>
                  <p className="text-gray-600">{stateCommittee?.institutional_email || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Phone</p>
                  <p className="text-gray-600">{stateCommittee?.phone || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Social Media</p>
                  <p className="text-gray-600">{stateCommittee?.social_media || 'Not provided'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* State Statistics */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">State Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-3xl font-bold text-blue-600">
                  {stateStatistics?.registeredPlayers?.toLocaleString() || '0'}
                </p>
                <p className="text-sm text-gray-600">Registered Players</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-3xl font-bold text-green-600">
                  {stateStatistics?.affiliatedClubs || '0'}
                </p>
                <p className="text-sm text-gray-600">Affiliated Clubs</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-3xl font-bold text-purple-600">
                  {stateStatistics?.annualTournaments || '0'}
                </p>
                <p className="text-sm text-gray-600">Annual Tournaments</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <p className="text-3xl font-bold text-orange-600">
                  {stateStatistics?.certifiedCoaches || '0'}
                </p>
                <p className="text-sm text-gray-600">Certified Coaches</p>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
            {recentActivities.length > 0 ? (
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={activity.id + index } className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="font-medium">{activity.name}</p>
                      <p className="text-sm text-gray-500">
                        {formatDate(activity.start_date)} - Status: {activity.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No recent activities found.</p>
            )}
          </div>
        </div>
      )}

        {activeTab === 'benefits' && (
          <div className="space-y-8">
            {/* Annual Fee Information */}
            {affiliationRequirements && (
              <div className="bg-gradient-to-br from-white to-emerald-50/30 rounded-3xl shadow-xl border border-gray-200/50 p-8 backdrop-blur-sm">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="bg-emerald-500 p-3 rounded-2xl shadow-lg">
                    <FiDollarSign className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Annual Affiliation</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-6 border border-gray-200/50 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="bg-blue-100 p-2 rounded-xl">
                        <FiDollarSign className="w-5 h-5 text-blue-600" />
                      </div>
                      <p className="font-semibold text-gray-500 uppercase tracking-wider">Annual Fee</p>
                    </div>
                    <p className="text-4xl font-bold text-blue-600 mb-2">
                      {formatCurrency(affiliationRequirements.annualFee)}
                    </p>
                    <p className="text-blue-700 font-medium">{affiliationRequirements.paymentSchedule}</p>
                  </div>
                  <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-6 border border-gray-200/50 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className={`p-2 rounded-xl ${
                        affiliationStatus?.isActive ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {affiliationStatus?.isActive ? (
                          <FiCheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <FiXCircle className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <p className="font-semibold text-gray-500 uppercase tracking-wider">Current Status</p>
                    </div>
                    <p className={`text-2xl font-bold mb-2 ${
                      affiliationStatus?.isActive ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {affiliationStatus?.isActive ? 'Active' : 'Expired'}
                    </p>
                    {affiliationStatus?.expiresAt && (
                      <div className="flex items-center space-x-2">
                        <FiCalendar className="w-4 h-4 text-gray-500" />
                        <p className="text-gray-600 font-medium">
                          Expires: {formatDate(affiliationStatus.expiresAt)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Benefits */}
            {affiliationRequirements && (
              <div className="bg-gradient-to-br from-white to-green-50/30 rounded-3xl shadow-xl border border-gray-200/50 p-8 backdrop-blur-sm">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="bg-green-500 p-3 rounded-2xl shadow-lg">
                    <FiAward className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Federation Benefits</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {affiliationRequirements.benefits.map((benefit, index) => (
                    <div key={index} className="bg-gradient-to-r from-white to-gray-50 rounded-2xl p-4 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300">
                      <div className="flex items-start space-x-3">
                        <div className="bg-green-100 p-2 rounded-lg flex-shrink-0 mt-1">
                          <FiCheckCircle className="w-4 h-4 text-green-600" />
                        </div>
                        <p className="text-gray-800 font-medium leading-relaxed">{benefit}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Support Services */}
            <div className="bg-gradient-to-br from-white to-blue-50/30 rounded-3xl shadow-xl border border-gray-200/50 p-8 backdrop-blur-sm">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-blue-500 p-3 rounded-2xl shadow-lg">
                  <FiShield className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Federation Support</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="group">
                  <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-6 text-center border border-gray-200/50 hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-200">
                      <FiShield className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-3">Technical Support</h3>
                    <p className="text-gray-600 leading-relaxed">24/7 platform support and comprehensive training resources for your team</p>
                  </div>
                </div>
                <div className="group">
                  <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-6 text-center border border-gray-200/50 hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <div className="bg-gradient-to-r from-green-500 to-green-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-200">
                      <FiCheckCircle className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-3">Compliance Assistance</h3>
                    <p className="text-gray-600 leading-relaxed">Expert help meeting national federation standards and requirements</p>
                  </div>
                </div>
                <div className="group">
                  <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-6 text-center border border-gray-200/50 hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-200">
                      <FiUsers className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-3">Growth Programs</h3>
                    <p className="text-gray-600 leading-relaxed">Comprehensive resources to expand pickleball participation in your state</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'governance' && (
          <div className="space-y-8">
            {/* Compliance Status */}
            {complianceStatus && (
              <div className="bg-gradient-to-br from-white to-indigo-50/30 rounded-3xl shadow-xl border border-gray-200/50 p-8 backdrop-blur-sm">
              <h2 className="text-xl font-semibold mb-4">Compliance Requirements</h2>
              <div className="space-y-4">
                <div className={`flex items-center justify-between p-3 ${complianceStatus.annualReport.completed ? 'bg-green-50' : 'bg-yellow-50'} rounded-lg`}>
                  <div className="flex items-center space-x-3">
                    <svg className={`w-5 h-5 ${getComplianceColor(complianceStatus.annualReport.completed)}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d={getComplianceIcon(complianceStatus.annualReport.completed)} clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Annual Report</span>
                  </div>
                  <span className={`text-sm ${getComplianceColor(complianceStatus.annualReport.completed)}`}>
                    {complianceStatus.annualReport.completed
                      ? `Completed ${formatDate(complianceStatus.annualReport.completedDate)}`
                      : `Due ${formatDate(complianceStatus.annualReport.dueDate)}`}
                  </span>
                </div>

                <div className={`flex items-center justify-between p-3 ${complianceStatus.insurance.valid ? 'bg-green-50' : 'bg-yellow-50'} rounded-lg`}>
                  <div className="flex items-center space-x-3">
                    <svg className={`w-5 h-5 ${getComplianceColor(complianceStatus.insurance.valid)}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d={getComplianceIcon(complianceStatus.insurance.valid)} clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Insurance Documentation</span>
                  </div>
                  <span className={`text-sm ${getComplianceColor(complianceStatus.insurance.valid)}`}>
                    {complianceStatus.insurance.valid
                      ? `Valid until ${formatDate(complianceStatus.insurance.validUntil)}`
                      : 'Expired'}
                  </span>
                </div>

                <div className={`flex items-center justify-between p-3 ${complianceStatus.boardElections.completed ? 'bg-green-50' : 'bg-yellow-50'} rounded-lg`}>
                  <div className="flex items-center space-x-3">
                    <svg className={`w-5 h-5 ${getComplianceColor(complianceStatus.boardElections.completed)}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d={getComplianceIcon(complianceStatus.boardElections.completed)} clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Board Elections</span>
                  </div>
                  <span className={`text-sm ${getComplianceColor(complianceStatus.boardElections.completed)}`}>
                    {complianceStatus.boardElections.completed
                      ? `Completed ${formatDate(complianceStatus.boardElections.completedDate)}`
                      : `Next due ${formatDate(complianceStatus.boardElections.nextDue)}`}
                  </span>
                </div>

                <div className={`flex items-center justify-between p-3 ${complianceStatus.quarterlyReview.completed ? 'bg-green-50' : 'bg-yellow-50'} rounded-lg`}>
                  <div className="flex items-center space-x-3">
                    <svg className={`w-5 h-5 ${getComplianceColor(complianceStatus.quarterlyReview.completed)}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d={getComplianceIcon(complianceStatus.quarterlyReview.completed)} clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Quarterly Financial Review</span>
                  </div>
                  <span className={`text-sm ${getComplianceColor(complianceStatus.quarterlyReview.completed)}`}>
                    {complianceStatus.quarterlyReview.completed
                      ? 'Completed'
                      : `Due by ${formatDate(complianceStatus.quarterlyReview.dueDate)}`}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => handleSubmitReport('quarterly')}
                disabled={loading}
                className="text-left p-4 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Submit Report</p>
                    <p className="text-sm text-gray-500">File quarterly or annual reports</p>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>

              {!affiliationStatus?.isActive && (
                <button
                  onClick={() => setShowRenewalModal(true)}
                  disabled={loading}
                  className="text-left p-4 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Renew Affiliation</p>
                      <p className="text-sm text-gray-500">Renew state association membership</p>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              )}
            </div>
          </div>

          {/* Payment History */}
          {paymentHistory.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Payment History</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paymentHistory.slice(0, 5).map((payment) => (
                      <tr key={payment.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {formatDate(payment.transaction_date || payment.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {payment.payment_type === 'affiliation' ? 'Annual Affiliation Fee' : payment.payment_type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {formatCurrency(payment.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            payment.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : payment.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {payment.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

        {/* Renewal Modal */}
        {showRenewalModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full flex items-center justify-center z-50">
            <div className="bg-gradient-to-br from-white to-blue-50 p-8 rounded-3xl shadow-2xl max-w-md w-full mx-4 border border-gray-200/50">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-blue-500 p-3 rounded-2xl">
                  <FiRefreshCw className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Renew State Affiliation</h3>
              </div>
              <div className="bg-white/60 rounded-2xl p-4 mb-4 backdrop-blur-sm">
                <div className="flex items-center space-x-3">
                  <FiDollarSign className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Annual affiliation fee</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {affiliationRequirements ? formatCurrency(affiliationRequirements.annualFee) : '$2,500.00'}
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                This will extend your state association membership for one year and provide continued access to all federation benefits and support.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowRenewalModal(false)}
                  className="px-6 py-3 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRenewalAffiliation}
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <FiRefreshCw className="w-4 h-4" />
                      <span>Renew Affiliation</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Profile Modal */}
        {showEditProfileModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
            <div className="relative top-8 mx-auto p-6 w-full max-w-2xl">
              <div className="bg-gradient-to-br from-white to-purple-50 rounded-3xl shadow-2xl border border-gray-200/50">
                <div className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-3">
                      <div className="bg-purple-500 p-3 rounded-2xl">
                        <FiEdit className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">Edit Committee Profile</h3>
                    </div>
                    <button
                      onClick={() => setShowEditProfileModal(false)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors duration-200"
                    >
                      <FiX className="w-6 h-6" />
                    </button>
                  </div>

                  <form onSubmit={handleUpdateProfile} className="space-y-8">
                    {/* Logo Upload */}
                    <div className="bg-white/60 rounded-2xl p-6 backdrop-blur-sm">
                      <div className="flex items-center space-x-2 mb-4">
                        <FiCamera className="w-5 h-5 text-purple-600" />
                        <h4 className="text-lg font-bold text-gray-900">Committee Logo</h4>
                      </div>
                      <SimpleImageUpload
                        fieldName="committee_logo_url"
                        fileType="image"
                        value={profileFormData.logo_url}
                        onChange={handleLogoUpload}
                        title="Committee Logo"
                        className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-300 rounded-2xl"
                        enableCropping={true}
                        aspectRatio={1}
                        icon={
                          <FiCamera className="w-6 h-6" />
                        }
                      />
                      <p className="mt-3 text-sm text-gray-600">
                        Upload your committee's official logo (PNG, JPG up to 5MB)
                      </p>
                    </div>

                    {/* Basic Information */}
                    <div className="bg-white/60 rounded-2xl p-6 backdrop-blur-sm">
                      <div className="flex items-center space-x-2 mb-4">
                        <FiUsers className="w-5 h-5 text-purple-600" />
                        <h4 className="text-lg font-bold text-gray-900">Basic Information</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="president_name" className="block text-sm font-bold text-gray-700 mb-2">
                            President Name *
                          </label>
                          <input
                            type="text"
                            id="president_name"
                            name="president_name"
                            value={profileFormData.president_name}
                            onChange={handleProfileFormChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                          />
                        </div>
                        <div>
                          <label htmlFor="president_title" className="block text-sm font-bold text-gray-700 mb-2">
                            President Title
                          </label>
                          <input
                            type="text"
                            id="president_title"
                            name="president_title"
                            value={profileFormData.president_title}
                            onChange={handleProfileFormChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="bg-white/60 rounded-2xl p-6 backdrop-blur-sm">
                      <div className="flex items-center space-x-2 mb-4">
                        <FiMail className="w-5 h-5 text-purple-600" />
                        <h4 className="text-lg font-bold text-gray-900">Contact Information</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="institutional_email" className="block text-sm font-bold text-gray-700 mb-2">
                            Institutional Email
                          </label>
                          <input
                            type="email"
                            id="institutional_email"
                            name="institutional_email"
                            value={profileFormData.institutional_email}
                            onChange={handleProfileFormChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                          />
                        </div>
                        <div>
                          <label htmlFor="phone" className="block text-sm font-bold text-gray-700 mb-2">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={profileFormData.phone}
                            onChange={handleProfileFormChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <div>
                          <label htmlFor="website" className="block text-sm font-bold text-gray-700 mb-2">
                            Website URL
                          </label>
                          <input
                            type="url"
                            id="website"
                            name="website"
                            value={profileFormData.website}
                            onChange={handleProfileFormChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                          />
                        </div>
                        <div>
                          <label htmlFor="social_media" className="block text-sm font-bold text-gray-700 mb-2">
                            Social Media
                          </label>
                          <input
                            type="text"
                            id="social_media"
                            name="social_media"
                            value={profileFormData.social_media}
                            onChange={handleProfileFormChange}
                            placeholder="Facebook, Instagram, etc."
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-4 pt-6">
                      <button
                        type="button"
                        onClick={() => setShowEditProfileModal(false)}
                        className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-semibold hover:bg-gray-200 transition-colors duration-200"
                        disabled={loading}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:from-purple-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 flex items-center space-x-2"
                      >
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <FiCheckCircle className="w-4 h-4" />
                            <span>Save Changes</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default StateMembership