import React from 'react'

interface CreateCredentialTemplatesProps {
  templates: any[]
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
      <h3 className="text-lg font-medium text-gray-900 mb-6">Create New Credential</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {templates.map(template => (
          <div
            key={template.type}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:border-green-500 transition-colors"
          >
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-2xl">{getCredentialIcon(template.type)}</span>
              <div>
                <h4 className="text-lg font-medium text-gray-900">{template.name}</h4>
                <p className="text-sm text-gray-600">{template.description}</p>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2">Required fields:</p>
              <div className="flex flex-wrap gap-2">
                {template.required_fields.map((field: string) => (
                  <span
                    key={field}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                  >
                    {field.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>
            
            <button
              onClick={() => onCreateCredential(template.type)}
              className="w-full inline-flex justify-center items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Create {template.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CreateCredentialTemplates