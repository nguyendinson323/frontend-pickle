import React from 'react'
import { FederationInfo as FederationInfoType } from '../../../types/common'

interface FederationInfoProps {
  info: FederationInfoType
}

const FederationInfo: React.FC<FederationInfoProps> = ({ info }) => {
  return (
    <section className="py-20 bg-indigo-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Main Info */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {info.name}
            </h2>
            <p className="text-xl mb-8 text-indigo-200">
              {info.description}
            </p>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3 text-yellow-400">Our Mission</h3>
                <p className="text-indigo-100">{info.mission}</p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3 text-yellow-400">Our Vision</h3>
                <p className="text-indigo-100">{info.vision}</p>
              </div>
            </div>
          </div>
          
          {/* Right Column - Contact & Details */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-6 text-yellow-400">Federation Details</h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="text-yellow-400 mt-1">👑</div>
                <div>
                  <div className="font-semibold">{info.president_name}</div>
                  <div className="text-indigo-200 text-sm">{info.president_title}</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="text-yellow-400 mt-1">📅</div>
                <div>
                  <div className="font-semibold">Founded</div>
                  <div className="text-indigo-200 text-sm">{info.founded_year}</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="text-yellow-400 mt-1">📧</div>
                <div>
                  <div className="font-semibold">Contact Email</div>
                  <div className="text-indigo-200 text-sm">{info.contact_email}</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="text-yellow-400 mt-1">📞</div>
                <div>
                  <div className="font-semibold">Phone</div>
                  <div className="text-indigo-200 text-sm">{info.contact_phone}</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="text-yellow-400 mt-1">📍</div>
                <div>
                  <div className="font-semibold">Address</div>
                  <div className="text-indigo-200 text-sm">{info.address}</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="text-yellow-400 mt-1">🌐</div>
                <div>
                  <div className="font-semibold">Website</div>
                  <a 
                    href={info.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-indigo-200 text-sm hover:text-white transition-colors"
                  >
                    {info.website}
                  </a>
                </div>
              </div>
            </div>
            
            {/* Social Media Links */}
            <div className="mt-8">
              <h4 className="font-semibold mb-4 text-yellow-400">Follow Us</h4>
              <div className="flex space-x-4">
                {info.social_media.facebook && (
                  <a
                    href={info.social_media.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 hover:bg-blue-700 p-3 rounded-lg transition-colors"
                  >
                    <span className="text-xl">📘</span>
                  </a>
                )}
                {info.social_media.twitter && (
                  <a
                    href={info.social_media.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-sky-500 hover:bg-sky-600 p-3 rounded-lg transition-colors"
                  >
                    <span className="text-xl">🐦</span>
                  </a>
                )}
                {info.social_media.instagram && (
                  <a
                    href={info.social_media.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-pink-600 hover:bg-pink-700 p-3 rounded-lg transition-colors"
                  >
                    <span className="text-xl">📷</span>
                  </a>
                )}
                {info.social_media.youtube && (
                  <a
                    href={info.social_media.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-red-600 hover:bg-red-700 p-3 rounded-lg transition-colors"
                  >
                    <span className="text-xl">📺</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FederationInfo