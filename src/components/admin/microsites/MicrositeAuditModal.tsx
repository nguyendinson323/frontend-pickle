import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../../store'
import { MicrositeAdmin } from '../../../types/admin'
import { performContentAudit } from '../../../store/slices/adminMicrositesSlice'

interface MicrositeAuditModalProps {
  microsite: MicrositeAdmin
  onClose: () => void
}

const MicrositeAuditModal: React.FC<MicrositeAuditModalProps> = ({ microsite, onClose }) => {
  const dispatch = useDispatch<AppDispatch>()
  const [auditResults, setAuditResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [auditStarted, setAuditStarted] = useState(false)

  const handleStartAudit = async () => {
    setLoading(true)
    setAuditStarted(true)
    try {
      const result = await dispatch(performContentAudit(microsite.id))
      setAuditResults(result)
    } catch (error) {
      console.error('Failed to perform audit:', error)
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100 border-green-200'
    if (score >= 60) return 'bg-yellow-100 border-yellow-200'
    return 'bg-red-100 border-red-200'
  }

  const getSeverityBadge = (severity: string) => {
    const severityConfig = {
      high: { bg: 'bg-red-100', text: 'text-red-800', label: 'High' },
      medium: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Medium' },
      low: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Low' },
      info: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Info' }
    }
    const config = severityConfig[severity as keyof typeof severityConfig] || severityConfig.info
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    )
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Content Audit</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900">{microsite.title}</h4>
          <p className="text-sm text-blue-700">Domain: {microsite.subdomain || "No subdomain"}</p>
          <p className="text-sm text-blue-700">Owner: {microsite.owner_name} ({microsite.owner_type})</p>
        </div>

        {!auditStarted && (
          <div className="text-center py-12">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
              <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Content Audit</h3>
            <p className="text-gray-600 mb-6">
              Perform a comprehensive audit of this microsite's content, SEO, accessibility, and performance.
            </p>
            <button
              onClick={handleStartAudit}
              disabled={loading}
              className="px-6 py-3 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Running Audit...' : 'Start Audit'}
            </button>
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
            <h3 className="text-lg font-medium text-gray-900 mt-4">Running Content Audit...</h3>
            <p className="text-gray-600 mt-2">This may take a few moments.</p>
            <div className="mt-6 space-y-2">
              <div className="text-sm text-gray-600">✓ Analyzing content quality</div>
              <div className="text-sm text-gray-600">✓ Checking SEO compliance</div>
              <div className="text-sm text-gray-600">✓ Scanning for inappropriate content</div>
              <div className="text-sm text-gray-600">✓ Testing accessibility standards</div>
              <div className="text-sm text-gray-600">✓ Measuring performance metrics</div>
            </div>
          </div>
        )}

        {auditResults && !loading && (
          <div className="space-y-6">
            {/* Overall Score */}
            <div className={`p-6 rounded-lg border-2 ${getScoreBg(auditResults.audit_results?.overall_score || 0)}`}>
              <div className="text-center">
                <div className={`text-4xl font-bold ${getScoreColor(auditResults.audit_results?.overall_score || 0)}`}>
                  {auditResults.audit_results?.overall_score || 0}/100
                </div>
                <div className="text-lg font-medium text-gray-800">Overall Audit Score</div>
              </div>
            </div>

            {/* Audit Categories */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className=" border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Content Quality</h4>
                <div className={`text-2xl font-bold ${getScoreColor(microsite.content_score)}`}>
                  {microsite.content_score}/100
                </div>
              </div>

              <div className=" border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">SEO Performance</h4>
                <div className={`text-2xl font-bold ${getScoreColor(microsite.seo_score)}`}>
                  {microsite.seo_score}/100
                </div>
              </div>

              <div className=" border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Performance</h4>
                <div className={`text-2xl font-bold ${getScoreColor(microsite.performance_score)}`}>
                  {microsite.performance_score}/100
                </div>
              </div>
            </div>

            {/* Issues Found */}
            <div className="space-y-4">
              {/* Content Warnings */}
              {auditResults.audit_results?.content_warnings && auditResults.audit_results.content_warnings.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-medium text-red-900 mb-2">⚠️ Content Warnings</h4>
                  <ul className="space-y-1">
                    {auditResults.audit_results.content_warnings.map((warning: string, index: number) => (
                      <li key={index} className="text-sm text-red-800">
                        • {warning}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* SEO Issues */}
              {auditResults.audit_results?.seo_issues && auditResults.audit_results.seo_issues.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-900 mb-2">🔍 SEO Issues</h4>
                  <ul className="space-y-1">
                    {auditResults.audit_results.seo_issues.map((issue: string, index: number) => (
                      <li key={index} className="text-sm text-yellow-800">
                        • {issue}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Accessibility Issues */}
              {auditResults.audit_results?.accessibility_issues && auditResults.audit_results.accessibility_issues.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">♿ Accessibility Issues</h4>
                  <ul className="space-y-1">
                    {auditResults.audit_results.accessibility_issues.map((issue: string, index: number) => (
                      <li key={index} className="text-sm text-blue-800">
                        • {issue}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Performance Issues */}
              {auditResults.audit_results?.broken_links > 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h4 className="font-medium text-orange-900 mb-2">🔗 Technical Issues</h4>
                  <div className="text-sm text-orange-800">
                    • Found {auditResults.audit_results.broken_links} broken links
                  </div>
                </div>
              )}
            </div>

            {/* Recommendations */}
            {auditResults.audit_results?.recommendations && auditResults.audit_results.recommendations.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-900 mb-2">💡 Recommendations</h4>
                <ul className="space-y-1">
                  {auditResults.audit_results.recommendations.map((recommendation: string, index: number) => (
                    <li key={index} className="text-sm text-green-800">
                      • {recommendation}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Audit Summary */}
            <div className=" border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Audit Summary</h4>
              <div className="text-sm text-gray-700 space-y-1">
                <div>Audit completed on: {new Date().toLocaleString()}</div>
                <div>Overall score: {auditResults.audit_results?.overall_score || 0}/100</div>
                <div>
                  Issues found: {
                    (auditResults.audit_results?.content_warnings?.length || 0) +
                    (auditResults.audit_results?.seo_issues?.length || 0) +
                    (auditResults.audit_results?.accessibility_issues?.length || 0) +
                    (auditResults.audit_results?.broken_links || 0)
                  }
                </div>
                <div>
                  Recommendations: {auditResults.audit_results?.recommendations?.length || 0}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-end space-x-3">
          {auditResults && !loading && (
            <button
              onClick={handleStartAudit}
              className="px-4 py-2 text-sm font-medium text-indigo-600 bg-white border border-indigo-300 rounded-md hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Run New Audit
            </button>
          )}
          <button
            onClick={onClose}
            className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover: focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default MicrositeAuditModal