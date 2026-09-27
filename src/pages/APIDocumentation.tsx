import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Book, Code, Lock, Zap, AlertCircle, Copy, Check, ChevronRight,
  ExternalLink, ArrowLeft, Search, Menu, X
} from 'lucide-react';

type Language = 'curl' | 'javascript' | 'python' | 'php' | 'ruby';

interface CodeExample {
  language: Language;
  code: string;
}

interface Endpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  title: string;
  description: string;
  parameters?: Array<{
    name: string;
    type: string;
    required: boolean;
    description: string;
  }>;
  requestBody?: string;
  responseBody: string;
  examples: CodeExample[];
}

export default function APIDocumentation() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('introduction');
  const [activeEndpoint, setActiveEndpoint] = useState('create-loan');
  const [activeLanguage, setActiveLanguage] = useState<Language>('curl');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const endpoints: Record<string, Endpoint> = {
    'create-loan': {
      method: 'POST',
      path: '/v1/loans',
      title: 'Create Loan Application',
      description: 'Create a new loan application for a borrower. The loan will go through compliance checks and decisioning before approval.',
      parameters: [
        { name: 'borrower_id', type: 'string', required: true, description: 'Unique identifier for the borrower' },
        { name: 'product_id', type: 'string', required: true, description: 'ID of the loan product to apply for' },
        { name: 'amount', type: 'integer', required: true, description: 'Loan amount in KES (must be within product limits)' },
        { name: 'consent_version', type: 'string', required: true, description: 'Version of consent terms accepted by borrower' },
      ],
      requestBody: `{
  "borrower_id": "brw_abc123",
  "product_id": "prod_salary_advance",
  "amount": 15000,
  "consent_version": "2.5"
}`,
      responseBody: `{
  "id": "LN-2026-0847",
  "status": "PENDING_DECISION",
  "borrower_id": "brw_abc123",
  "product_id": "prod_salary_advance",
  "principal": 15000,
  "interest": 450,
  "total_due": 15450,
  "due_date": "2026-07-15",
  "kfs_url": "/v1/loans/LN-2026-0847/kfs",
  "cooling_off_until": "2026-06-16T14:30:00Z",
  "created_at": "2026-06-15T14:30:00Z"
}`,
      examples: [
        {
          language: 'curl',
          code: `curl -X POST https://api.lendingos.co.ke/v1/loans \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "X-Tenant-ID: tenant_abc123" \\
  -H "Content-Type: application/json" \\
  -d '{
    "borrower_id": "brw_abc123",
    "product_id": "prod_salary_advance",
    "amount": 15000,
    "consent_version": "2.5"
  }'`
        },
        {
          language: 'javascript',
          code: `const response = await fetch('https://api.lendingos.co.ke/v1/loans', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'X-Tenant-ID': 'tenant_abc123',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    borrower_id: 'brw_abc123',
    product_id: 'prod_salary_advance',
    amount: 15000,
    consent_version: '2.5'
  })
});

const loan = await response.json();
console.log(loan.id); // LN-2026-0847`
        },
        {
          language: 'python',
          code: `import requests

response = requests.post(
    'https://api.lendingos.co.ke/v1/loans',
    headers={
        'Authorization': 'Bearer YOUR_API_KEY',
        'X-Tenant-ID': 'tenant_abc123',
        'Content-Type': 'application/json'
    },
    json={
        'borrower_id': 'brw_abc123',
        'product_id': 'prod_salary_advance',
        'amount': 15000,
        'consent_version': '2.5'
    }
)

loan = response.json()
print(loan['id'])  # LN-2026-0847`
        },
        {
          language: 'php',
          code: `$client = new GuzzleHttp\\Client();
$response = $client->post('https://api.lendingos.co.ke/v1/loans', [
    'headers' => [
        'Authorization' => 'Bearer YOUR_API_KEY',
        'X-Tenant-ID' => 'tenant_abc123',
        'Content-Type' => 'application/json'
    ],
    'json' => [
        'borrower_id' => 'brw_abc123',
        'product_id' => 'prod_salary_advance',
        'amount' => 15000,
        'consent_version' => '2.5'
    ]
]);

$loan = json_decode($response->getBody(), true);
echo $loan['id']; // LN-2026-0847`
        },
        {
          language: 'ruby',
          code: `require 'net/http'
require 'json'

uri = URI('https://api.lendingos.co.ke/v1/loans')
http = Net::HTTP.new(uri.host, uri.port)
http.use_ssl = true

request = Net::HTTP::Post.new(uri.path)
request['Authorization'] = 'Bearer YOUR_API_KEY'
request['X-Tenant-ID'] = 'tenant_abc123'
request['Content-Type'] = 'application/json'
request.body = {
  borrower_id: 'brw_abc123',
  product_id: 'prod_salary_advance',
  amount: 15000,
  consent_version: '2.5'
}.to_json

response = http.request(request)
loan = JSON.parse(response.body)
puts loan['id'] # LN-2026-0847`
        }
      ]
    },
    'disburse-loan': {
      method: 'POST',
      path: '/v1/loans/{loan_id}/disburse',
      title: 'Disburse Loan',
      description: 'Disburse an approved loan to the borrower via M-Pesa. This will trigger a B2C transaction and transfer funds to the borrower\'s mobile wallet.',
      parameters: [
        { name: 'loan_id', type: 'string', required: true, description: 'Unique identifier for the loan (path parameter)' },
      ],
      requestBody: `{
  "disbursement_method": "mpesa_b2c"
}`,
      responseBody: `{
  "id": "LN-2026-0847",
  "status": "DISBURSED",
  "disbursement": {
    "transaction_id": "txn_xyz789",
    "mpesa_receipt": "Q1A2B3C4D5",
    "amount": 15000,
    "disbursed_at": "2026-06-15T15:00:00Z"
  }
}`,
      examples: [
        {
          language: 'curl',
          code: `curl -X POST https://api.lendingos.co.ke/v1/loans/LN-2026-0847/disburse \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "X-Tenant-ID: tenant_abc123" \\
  -H "Content-Type: application/json" \\
  -d '{
    "disbursement_method": "mpesa_b2c"
  }'`
        },
        {
          language: 'javascript',
          code: `const response = await fetch(
  'https://api.lendingos.co.ke/v1/loans/LN-2026-0847/disburse',
  {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
      'X-Tenant-ID': 'tenant_abc123',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      disbursement_method: 'mpesa_b2c'
    })
  }
);

const result = await response.json();
console.log(result.disbursement.mpesa_receipt);`
        }
      ]
    },
    'record-payment': {
      method: 'POST',
      path: '/v1/loans/{loan_id}/payments',
      title: 'Record Payment',
      description: 'Record a repayment for a loan. This can be triggered by M-Pesa C2B callback or manual entry.',
      parameters: [
        { name: 'loan_id', type: 'string', required: true, description: 'Unique identifier for the loan' },
        { name: 'amount', type: 'integer', required: true, description: 'Payment amount in KES' },
        { name: 'payment_method', type: 'string', required: true, description: 'Payment method (mpesa_c2b, mpesa_stk, bank_transfer)' },
        { name: 'reference', type: 'string', required: false, description: 'External payment reference' },
      ],
      requestBody: `{
  "amount": 5000,
  "payment_method": "mpesa_c2b",
  "reference": "MPESA_RECEIPT_123"
}`,
      responseBody: `{
  "id": "pay_abc123",
  "loan_id": "LN-2026-0847",
  "amount": 5000,
  "status": "SUCCESS",
  "mpesa_receipt": "P1A2B3C4D5",
  "remaining_balance": 10450,
  "created_at": "2026-06-20T10:00:00Z"
}`,
      examples: [
        {
          language: 'curl',
          code: `curl -X POST https://api.lendingos.co.ke/v1/loans/LN-2026-0847/payments \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "X-Tenant-ID: tenant_abc123" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 5000,
    "payment_method": "mpesa_c2b",
    "reference": "MPESA_RECEIPT_123"
  }'`
        }
      ]
    }
  };

  const sections = [
    { id: 'introduction', title: 'Introduction', icon: Book },
    { id: 'authentication', title: 'Authentication', icon: Lock },
    { id: 'rate-limits', title: 'Rate Limits', icon: Zap },
    { id: 'errors', title: 'Errors', icon: AlertCircle },
    { id: 'endpoints', title: 'API Endpoints', icon: Code },
    { id: 'webhooks', title: 'Webhooks', icon: Zap },
  ];

  const apiEndpoints = [
    { id: 'create-loan', title: 'Create Loan Application', method: 'POST' },
    { id: 'disburse-loan', title: 'Disburse Loan', method: 'POST' },
    { id: 'record-payment', title: 'Record Payment', method: 'POST' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/')} className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">L</span>
                </div>
                <span className="font-bold text-lg text-gray-900">LendingOS</span>
              </button>
              <span className="text-gray-400">/</span>
              <span className="font-semibold text-gray-900">API Documentation</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/app')}
                className="hidden sm:flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft size={16} /> Back to Dashboard
              </button>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 text-gray-500 hover:text-gray-700"
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-16 flex">
        {/* Sidebar */}
        <aside className={`fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-gray-50 border-r border-gray-200 overflow-y-auto transition-transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
          <nav className="p-4 space-y-6">
            {/* Main Sections */}
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Getting Started</h3>
              <div className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => {
                      setActiveSection(section.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-colors ${
                      activeSection === section.id
                        ? 'bg-primary-50 text-primary-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <section.icon size={16} />
                    {section.title}
                  </button>
                ))}
              </div>
            </div>

            {/* API Endpoints */}
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">API Reference</h3>
              <div className="space-y-1">
                {apiEndpoints.map((endpoint) => (
                  <button
                    key={endpoint.id}
                    onClick={() => {
                      setActiveEndpoint(endpoint.id);
                      setActiveSection('endpoints');
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-colors ${
                      activeEndpoint === endpoint.id && activeSection === 'endpoints'
                        ? 'bg-primary-50 text-primary-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span className={`text-xs font-mono font-bold ${
                      endpoint.method === 'POST' ? 'text-accent-600' :
                      endpoint.method === 'GET' ? 'text-primary-600' :
                      'text-warning-600'
                    }`}>
                      {endpoint.method}
                    </span>
                    <span className="truncate">{endpoint.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Introduction */}
            {activeSection === 'introduction' && (
              <div className="prose prose-sm max-w-none">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">LendingOS API</h1>
                <p className="text-lg text-gray-600 mb-6">
                  The LendingOS API allows you to integrate lending functionality into your applications. 
                  Build custom borrower experiences, automate loan processing, and access real-time data.
                </p>

                <div className="bg-primary-50 border border-primary-200 rounded-xl p-5 mb-6">
                  <h3 className="font-semibold text-primary-900 mb-2">Base URL</h3>
                  <code className="text-sm bg-white px-3 py-1 rounded border border-primary-200">
                    https://api.lendingos.co.ke/v1
                  </code>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Quick Start</h2>
                <p className="text-gray-600 mb-4">
                  Get started with the LendingOS API in 3 simple steps:
                </p>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-700 font-bold">1</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Get your API key</h3>
                      <p className="text-sm text-gray-600">Sign up for a Growth or Enterprise tier to get API access</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-700 font-bold">2</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Make your first request</h3>
                      <p className="text-sm text-gray-600">Use the examples below to create your first loan application</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-700 font-bold">3</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Handle webhooks</h3>
                      <p className="text-sm text-gray-600">Set up webhooks to receive real-time notifications</p>
                    </div>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Key Features</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { title: 'Multi-tenant', desc: 'Isolated data per tenant with row-level security' },
                    { title: 'Compliance-first', desc: 'All regulatory requirements enforced automatically' },
                    { title: 'M-Pesa native', desc: 'Direct Daraja API integration for payments' },
                    { title: 'Real-time webhooks', desc: 'Instant notifications for all events' },
                  ].map((feature) => (
                    <div key={feature.title} className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                      <p className="text-sm text-gray-600">{feature.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Authentication */}
            {activeSection === 'authentication' && (
              <div className="prose prose-sm max-w-none">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Authentication</h1>
                <p className="text-gray-600 mb-6">
                  The LendingOS API uses Bearer token authentication. Include your API key in the Authorization header of all requests.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">API Keys</h2>
                <p className="text-gray-600 mb-4">
                  API keys are tied to your tenant and have specific permissions. You can generate and manage API keys from your dashboard.
                </p>

                <div className="bg-gray-900 rounded-xl p-5 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-400 font-mono">Example Request</span>
                    <button
                      onClick={() => copyToClipboard('Authorization: Bearer YOUR_API_KEY', 'auth-header')}
                      className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
                    >
                      {copiedCode === 'auth-header' ? <Check size={12} /> : <Copy size={12} />}
                      {copiedCode === 'auth-header' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <code className="text-sm text-green-400 font-mono">
                    Authorization: Bearer YOUR_API_KEY
                  </code>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Tenant Isolation</h2>
                <p className="text-gray-600 mb-4">
                  All API requests must include the <code className="bg-gray-100 px-2 py-0.5 rounded">X-Tenant-ID</code> header to specify which tenant the request is for. This ensures proper data isolation.
                </p>

                <div className="bg-warning-50 border border-warning-200 rounded-xl p-4 mb-6">
                  <div className="flex gap-3">
                    <AlertCircle size={20} className="text-warning-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-warning-900 mb-1">Security Notice</h3>
                      <p className="text-sm text-warning-800">
                        Never expose your API key in client-side code. Always make API calls from your backend server.
                      </p>
                    </div>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Key Types</h2>
                <div className="space-y-3">
                  {[
                    { type: 'Live Key', prefix: 'sk_live_', desc: 'For production use with real transactions' },
                    { type: 'Test Key', prefix: 'sk_test_', desc: 'For sandbox testing with simulated transactions' },
                  ].map((key) => (
                    <div key={key.type} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <code className="text-sm font-mono font-semibold text-gray-900">{key.prefix}</code>
                        <span className="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded">{key.type}</span>
                      </div>
                      <p className="text-sm text-gray-600">{key.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rate Limits */}
            {activeSection === 'rate-limits' && (
              <div className="prose prose-sm max-w-none">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Rate Limits</h1>
                <p className="text-gray-600 mb-6">
                  API requests are rate limited to ensure fair usage and platform stability. Rate limits vary by tier.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Limits by Tier</h2>
                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-700">Tier</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-700">Requests/minute</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-700">Requests/day</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {[
                        { tier: 'Free', rpm: 'N/A', rpd: 'N/A', note: 'No API access' },
                        { tier: 'Starter', rpm: '60', rpd: '10,000' },
                        { tier: 'Growth', rpm: '1,000', rpd: '100,000' },
                        { tier: 'Enterprise', rpm: '10,000', rpd: 'Unlimited' },
                      ].map((limit) => (
                        <tr key={limit.tier} className="bg-white">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{limit.tier}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{limit.rpm}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{limit.rpd}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Rate Limit Headers</h2>
                <p className="text-gray-600 mb-4">
                  All API responses include rate limit information in the headers:
                </p>
                <div className="bg-gray-900 rounded-xl p-5 mb-6">
                  <code className="text-sm text-green-400 font-mono block">
                    X-RateLimit-Limit: 1000<br />
                    X-RateLimit-Remaining: 999<br />
                    X-RateLimit-Reset: 1623840000
                  </code>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Handling Rate Limits</h2>
                <p className="text-gray-600 mb-4">
                  If you exceed the rate limit, you'll receive a <code className="bg-gray-100 px-2 py-0.5 rounded">429 Too Many Requests</code> response. Implement exponential backoff in your retry logic.
                </p>
              </div>
            )}

            {/* Errors */}
            {activeSection === 'errors' && (
              <div className="prose prose-sm max-w-none">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Error Handling</h1>
                <p className="text-gray-600 mb-6">
                  The LendingOS API uses conventional HTTP response codes to indicate the success or failure of an API request.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">HTTP Status Codes</h2>
                <div className="space-y-3">
                  {[
                    { code: '200', title: 'OK', desc: 'Request succeeded', color: 'bg-accent-50 text-accent-700' },
                    { code: '201', title: 'Created', desc: 'Resource created successfully', color: 'bg-accent-50 text-accent-700' },
                    { code: '400', title: 'Bad Request', desc: 'Invalid request parameters', color: 'bg-warning-50 text-warning-700' },
                    { code: '401', title: 'Unauthorized', desc: 'Invalid or missing API key', color: 'bg-danger-50 text-danger-700' },
                    { code: '403', title: 'Forbidden', desc: 'Insufficient permissions', color: 'bg-danger-50 text-danger-700' },
                    { code: '404', title: 'Not Found', desc: 'Resource not found', color: 'bg-warning-50 text-warning-700' },
                    { code: '422', title: 'Unprocessable', desc: 'Validation failed or compliance block', color: 'bg-warning-50 text-warning-700' },
                    { code: '429', title: 'Too Many Requests', desc: 'Rate limit exceeded', color: 'bg-warning-50 text-warning-700' },
                    { code: '500', title: 'Internal Error', desc: 'Server error', color: 'bg-danger-50 text-danger-700' },
                  ].map((error) => (
                    <div key={error.code} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                      <span className={`text-xs font-mono font-bold px-2 py-1 rounded ${error.color}`}>
                        {error.code}
                      </span>
                      <div>
                        <h3 className="font-semibold text-gray-900">{error.title}</h3>
                        <p className="text-sm text-gray-600">{error.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Error Response Format</h2>
                <div className="bg-gray-900 rounded-xl p-5 mb-6">
                  <code className="text-sm text-green-400 font-mono">
{`{
  "error": {
    "type": "compliance_block",
    "code": "IN_DUPLUM_REACHED",
    "message": "Loan has reached in duplum limit (2x principal)",
    "details": {
      "principal": 15000,
      "total_recovered": 30000,
      "limit": 30000
    }
  }
}`}
                  </code>
                </div>
              </div>
            )}

            {/* Endpoints */}
            {activeSection === 'endpoints' && endpoints[activeEndpoint] && (
              <div>
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`text-xs font-mono font-bold px-3 py-1 rounded ${
                      endpoints[activeEndpoint].method === 'POST' ? 'bg-accent-50 text-accent-700' :
                      endpoints[activeEndpoint].method === 'GET' ? 'bg-primary-50 text-primary-700' :
                      'bg-warning-50 text-warning-700'
                    }`}>
                      {endpoints[activeEndpoint].method}
                    </span>
                    <code className="text-sm font-mono text-gray-900">{endpoints[activeEndpoint].path}</code>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{endpoints[activeEndpoint].title}</h1>
                  <p className="text-gray-600">{endpoints[activeEndpoint].description}</p>
                </div>

                {/* Parameters */}
                {endpoints[activeEndpoint].parameters && (
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-3">Parameters</h2>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left px-4 py-2 text-xs font-semibold text-gray-700">Name</th>
                            <th className="text-left px-4 py-2 text-xs font-semibold text-gray-700">Type</th>
                            <th className="text-left px-4 py-2 text-xs font-semibold text-gray-700">Required</th>
                            <th className="text-left px-4 py-2 text-xs font-semibold text-gray-700">Description</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {endpoints[activeEndpoint].parameters!.map((param) => (
                            <tr key={param.name} className="bg-white">
                              <td className="px-4 py-3">
                                <code className="text-sm font-mono text-primary-600">{param.name}</code>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600">{param.type}</td>
                              <td className="px-4 py-3">
                                {param.required ? (
                                  <span className="text-xs bg-danger-50 text-danger-700 px-2 py-0.5 rounded">Required</span>
                                ) : (
                                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">Optional</span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600">{param.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Request Body */}
                {endpoints[activeEndpoint].requestBody && (
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-3">Request Body</h2>
                    <div className="bg-gray-900 rounded-xl p-5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-400 font-mono">application/json</span>
                        <button
                          onClick={() => copyToClipboard(endpoints[activeEndpoint].requestBody!, 'request')}
                          className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
                        >
                          {copiedCode === 'request' ? <Check size={12} /> : <Copy size={12} />}
                          {copiedCode === 'request' ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                      <pre className="text-sm text-green-400 font-mono overflow-x-auto">
                        <code>{endpoints[activeEndpoint].requestBody}</code>
                      </pre>
                    </div>
                  </div>
                )}

                {/* Response */}
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-3">Response</h2>
                  <div className="bg-gray-900 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-400 font-mono">200 OK</span>
                      <button
                        onClick={() => copyToClipboard(endpoints[activeEndpoint].responseBody, 'response')}
                        className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
                      >
                        {copiedCode === 'response' ? <Check size={12} /> : <Copy size={12} />}
                        {copiedCode === 'response' ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <pre className="text-sm text-green-400 font-mono overflow-x-auto">
                      <code>{endpoints[activeEndpoint].responseBody}</code>
                    </pre>
                  </div>
                </div>

                {/* Code Examples */}
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-3">Code Examples</h2>
                  <div className="flex gap-2 mb-3 overflow-x-auto">
                    {(['curl', 'javascript', 'python', 'php', 'ruby'] as Language[]).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setActiveLanguage(lang)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                          activeLanguage === lang
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {lang.charAt(0).toUpperCase() + lang.slice(1)}
                      </button>
                    ))}
                  </div>
                  <div className="bg-gray-900 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-400 font-mono">{activeLanguage}</span>
                      <button
                        onClick={() => {
                          const example = endpoints[activeEndpoint].examples.find(e => e.language === activeLanguage);
                          if (example) copyToClipboard(example.code, 'example');
                        }}
                        className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
                      >
                        {copiedCode === 'example' ? <Check size={12} /> : <Copy size={12} />}
                        {copiedCode === 'example' ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <pre className="text-sm text-green-400 font-mono overflow-x-auto">
                      <code>{endpoints[activeEndpoint].examples.find(e => e.language === activeLanguage)?.code}</code>
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {/* Webhooks */}
            {activeSection === 'webhooks' && (
              <div className="prose prose-sm max-w-none">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Webhooks</h1>
                <p className="text-gray-600 mb-6">
                  Webhooks allow you to receive real-time notifications when events occur in LendingOS. 
                  Configure webhook endpoints in your dashboard to start receiving events.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Available Events</h2>
                <div className="space-y-2">
                  {[
                    { event: 'loan.created', desc: 'A new loan application was created' },
                    { event: 'loan.approved', desc: 'A loan was approved' },
                    { event: 'loan.disbursed', desc: 'A loan was disbursed to the borrower' },
                    { event: 'loan.repaid', desc: 'A loan was fully repaid' },
                    { event: 'payment.received', desc: 'A payment was received' },
                    { event: 'payment.failed', desc: 'A payment failed' },
                    { event: 'borrower.registered', desc: 'A new borrower registered' },
                    { event: 'borrower.kyc_verified', desc: 'Borrower KYC was verified' },
                    { event: 'compliance.blocked', desc: 'A compliance rule blocked an action' },
                  ].map((event) => (
                    <div key={event.event} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <code className="text-xs font-mono font-semibold text-primary-600 bg-primary-50 px-2 py-1 rounded">
                        {event.event}
                      </code>
                      <p className="text-sm text-gray-600 flex-1">{event.desc}</p>
                    </div>
                  ))}
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Webhook Payload</h2>
                <div className="bg-gray-900 rounded-xl p-5 mb-6">
                  <pre className="text-sm text-green-400 font-mono overflow-x-auto">
                    <code>{`{
  "id": "evt_abc123",
  "type": "loan.disbursed",
  "created_at": "2026-06-15T15:00:00Z",
  "data": {
    "loan_id": "LN-2026-0847",
    "borrower_id": "brw_abc123",
    "amount": 15000,
    "mpesa_receipt": "Q1A2B3C4D5"
  }
}`}</code>
                  </pre>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Verifying Webhooks</h2>
                <p className="text-gray-600 mb-4">
                  All webhook payloads are signed with your webhook secret. Verify the signature to ensure the payload is authentic.
                </p>
                <div className="bg-gray-900 rounded-xl p-5">
                  <pre className="text-sm text-green-400 font-mono overflow-x-auto">
                    <code>{`// Verify webhook signature
const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}`}</code>
                  </pre>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
