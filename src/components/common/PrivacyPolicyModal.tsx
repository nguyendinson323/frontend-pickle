import React from 'react'

interface PrivacyPolicyModalProps {
  onClose: () => void
}

const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ onClose }) => {
  const downloadPrivacyPolicy = () => {
    // Create a simple PDF content for demonstration
    const content = `
MEXICAN PICKLEBALL FEDERATION
PRIVACY POLICY

Last Updated: ${new Date().toLocaleDateString('en-US')}

1. INFORMATION WE COLLECT
We collect information you provide directly to us, such as when you:
- Register for an account
- Participate in tournaments
- Contact us for support
- Use our services

2. HOW WE USE YOUR INFORMATION
We use the information we collect to:
- Provide and maintain our services
- Process your registration and tournament entries
- Communicate with you about our services
- Improve our platform and user experience

3. INFORMATION SHARING
We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.

4. DATA SECURITY
We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.

5. YOUR RIGHTS
You have the right to:
- Access your personal information
- Correct inaccurate information
- Request deletion of your information
- Opt out of communications

6. CONTACT US
If you have questions about this Privacy Policy, please contact us at:
Email: privacy@mexicanpickleball.org
Phone: +52 55 1234-5678

This policy may be updated from time to time. We will notify you of any material changes.
    `

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'Mexican_Pickleball_Federation_Privacy_Policy.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Privacy Policy</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US')}
            </p>

            <section className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">1. INFORMATION WE COLLECT</h3>
              <p className="text-gray-700 mb-3">We collect information you provide directly to us, such as when you:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Register for an account on our platform</li>
                <li>Participate in tournaments and events</li>
                <li>Contact us for customer support</li>
                <li>Use our services and features</li>
                <li>Upload documents and photos</li>
              </ul>
            </section>

            <section className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">2. HOW WE USE YOUR INFORMATION</h3>
              <p className="text-gray-700 mb-3">We use the information we collect to:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Provide and maintain our services</li>
                <li>Process your registration and tournament entries</li>
                <li>Communicate with you about our services</li>
                <li>Improve our platform and user experience</li>
                <li>Ensure fair play and compliance with federation rules</li>
                <li>Generate official player credentials and rankings</li>
              </ul>
            </section>

            <section className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">3. INFORMATION SHARING</h3>
              <p className="text-gray-700">
                We do not sell, trade, or otherwise transfer your personal information to third parties 
                without your consent, except as described in this policy. We may share information with:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 mt-3">
                <li>Tournament organizers for event management</li>
                <li>State committees for regional administration</li>
                <li>Service providers who assist in platform operations</li>
                <li>Legal authorities when required by law</li>
              </ul>
            </section>

            <section className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">4. DATA SECURITY</h3>
              <p className="text-gray-700">
                We implement appropriate security measures to protect your personal information against 
                unauthorized access, alteration, disclosure, or destruction. However, no internet 
                transmission is completely secure.
              </p>
            </section>

            <section className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">5. YOUR RIGHTS</h3>
              <p className="text-gray-700 mb-3">You have the right to:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>Opt out of marketing communications</li>
                <li>Control your visibility in player searches</li>
              </ul>
            </section>

            <section className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">6. CONTACT US</h3>
              <p className="text-gray-700">
                If you have questions about this Privacy Policy, please contact us at:
              </p>
              <div className="mt-3 text-gray-700">
                <p><strong>Email:</strong> privacy@mexicanpickleball.org</p>
                <p><strong>Phone:</strong> +52 55 1234-5678</p>
                <p><strong>Address:</strong> Mexican Pickleball Federation, Mexico City, CDMX</p>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">7. UPDATES TO THIS POLICY</h3>
              <p className="text-gray-700">
                This policy may be updated from time to time. We will notify you of any material 
                changes by posting the new policy on our platform and updating the "Last Updated" date.
              </p>
            </section>
          </div>
        </div>

        <div className="flex justify-between items-center p-6 border-t bg-gray-50">
          <button
            onClick={downloadPrivacyPolicy}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            Download PDF
          </button>
          <div className="space-x-3">
            <button
              onClick={onClose}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicyModal