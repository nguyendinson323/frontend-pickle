import React from 'react'
import { Partner, User } from '../../../types/auth'

interface PartnerProfileViewProps {
  partner: Partner
  user: User
  onEdit: () => void
}

const PartnerProfileView: React.FC<PartnerProfileViewProps> = ({ partner, user, onEdit }) => {
  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden">
      <div className="bg-blue-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-20 h-20 bg-blue-700 rounded-full flex items-center justify-center mr-6">
              {partner.logo_url ? (
                <img 
                  src={partner.logo_url} 
                  alt="Partner Logo" 
                  className="w-20 h-20 rounded-full object-cover" 
                />
              ) : (
                <span className="text-3xl text-white">🏢</span>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{partner.business_name}</h1>
              <p className="text-blue-100">
                {partner.partner_type?.replace('_', ' ') || 'Partner'} • {partner.state?.name || 'Unknown State'}
              </p>
              <p className="text-blue-100">
                {partner.has_courts ? 'Has Courts Available' : 'No Courts'}
              </p>
            </div>
          </div>
          <button
            onClick={onEdit}
            className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-white"
          >
            Edit Profile
          </button>
        </div>
      </div>

      <div className="p-8">
        {/* Account Information */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Username</label>
              <p className="text-gray-900">{user.username}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
              <p className="text-gray-900">{user.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Phone</label>
              <p className="text-gray-900">{user.phone || 'Not provided'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Account Status</label>
              <div className="flex items-center">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {user.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Verification Status</label>
              <div className="flex items-center">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {user.is_verified ? 'Verified' : 'Pending'}
                </span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Premium Status</label>
              <div className="flex items-center">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.is_premium ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {user.is_premium ? 'Premium' : 'Standard'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Partner Information */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Partner Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Business Name</label>
              <p className="text-gray-900">{partner.business_name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Partner Type</label>
              <p className="text-gray-900 capitalize">{partner.partner_type?.replace('_', ' ') || 'Not specified'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">RFC</label>
              <p className="text-gray-900">{partner.rfc || 'Not provided'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Contact Name</label>
              <p className="text-gray-900">{partner.contact_name || 'Not specified'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Contact Title</label>
              <p className="text-gray-900">{partner.contact_title || 'Not specified'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">State</label>
              <p className="text-gray-900">{partner.state?.name || 'Not specified'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Has Courts</label>
              <div className="flex items-center">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  partner.has_courts ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {partner.has_courts ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Website</label>
              <p className="text-gray-900">
                {partner.website ? (
                  <a href={partner.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                    {partner.website}
                  </a>
                ) : (
                  'Not provided'
                )}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Social Media</label>
              <p className="text-gray-900">{partner.social_media || 'Not provided'}</p>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Premium Expires</label>
              <p className="text-gray-900">
                {partner.premium_expires_at ? 
                  new Date(partner.premium_expires_at).toLocaleDateString() : 
                  'Not premium member'
                }
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Member Since</label>
              <p className="text-gray-900">{new Date(partner.created_at).toLocaleDateString()}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Last Updated</label>
              <p className="text-gray-900">{new Date(partner.updated_at).toLocaleDateString()}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Last Login</label>
              <p className="text-gray-900">
                {user.last_login ? 
                  new Date(user.last_login).toLocaleDateString() : 
                  'Never logged in'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PartnerProfileView