import React from 'react'
import { CredentialTemplate } from '../../../store/slices/digitalCredentialsSlice'
import {
  FiPlus,
  FiList,
  FiCheckCircle
} from 'react-icons/fi'

interface CreateCredentialTemplatesProps {
  templates: CredentialTemplate[]
  onCreateCredential: (templateType: string) => void
  getCredentialIcon: (type: string) => string
}

const CreateCredentialTemplates: React.FC<CreateCredentialTemplatesProps> = ({
  templates,
  onCreateCredential,
  getCredentialIcon
}) => {
  return (
    <div>
      <div className="bg-gradient-to-r from-purple-600 to-pink-700 rounded-2xl p-8 mb-8 text-white">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mr-4">
            <FiPlus className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-3xl font-bold mb-2">Create New Credential</h3>
            <p className="text-purple-100 text-lg">Choose from available credential templates</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {templates.map(template => (
          <div
            key={template.type}
            className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl border-2 border-gray-200 p-8 hover:border-purple-400 hover:shadow-2xl transition-all duration-300 hover:transform hover:scale-105"
          >
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-3xl">{getCredentialIcon(template.type)}</span>
              </div>
              <div>
                <h4 className="text-2xl font-bold text-gray-900 mb-1">{template.name}</h4>
                <p className="text-gray-600 font-medium">{template.description}</p>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center mb-4">
                <FiList className="w-5 h-5 text-purple-600 mr-3" />
                <p className="text-sm font-bold text-purple-800">Required fields:</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {template.required_fields.map((field: string) => (
                  <div
                    key={field}
                    className="inline-flex items-center px-3 py-2 bg-purple-50 text-purple-800 text-sm font-medium rounded-2xl border border-purple-200"
                  >
                    <FiCheckCircle className="w-4 h-4 mr-2" />
                    {field.replace('_', ' ')}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => onCreateCredential(template.type)}
              className="w-full inline-flex justify-center items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-700 text-white font-bold rounded-2xl hover:from-purple-700 hover:to-pink-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 shadow-xl hover:shadow-2xl hover:transform hover:scale-105"
            >
              <FiPlus className="w-6 h-6 mr-3" />
              Create {template.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CreateCredentialTemplates